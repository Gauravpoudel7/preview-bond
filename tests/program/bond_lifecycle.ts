import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  AttackSimulator,
  Scenario
} from "@preview-bond/simulator";
import {
  verifyStructuralMatch,
  Fingerprint
} from "@preview-bond/shared";
import { PreviewBond, BondStatus } from "../target/types/preview_bond";
import { TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo } from "@solana/spl-token";

describe("Preview Bond E2E Lifecycle", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.PreviewBond as Program<PreviewBond>;

  const user = Keypair.generate();
  const providerKey = Keypair.generate();
  const keeper = Keypair.generate();
  const admin = provider.wallet;

  let configAccount = PublicKey.findProgramAddressSync([Buffer.from("config")], program.programId)[0];
  let usdcMint = null;
  let userTokenAccount = null;
  let providerTokenAccount = null;
  let vaultAccount = null;

  before(async () => {
    // Airdrop SOL
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(providerKey.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(keeper.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL)
    );

    // 1. Initialize Global Config
    await program.methods
      .initializeConfig(30, new anchor.BN(1000 * 10**6)) // 30 bps, 1000 USDC daily cap
      .accounts({
        config: configAccount,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // 2. Setup Mock USDC
    usdcMint = await createMint(
      provider.connection,
      provider.wallet,
      admin.publicKey,
      null,
      9
    );

    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet,
      usdcMint,
      user.publicKey
    );

    providerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet,
      usdcMint,
      providerKey.publicKey
    );

    // Mint USDC to provider for bonding
    await mintTo(
      provider.connection,
      provider.wallet,
      usdcMint,
      providerTokenAccount,
      admin.publicKey,
      1000 * 10**6
    );
  });

  async function setupBondScenario(scenario: Scenario) {
    const simulator = new AttackSimulator();
    const res = simulator.generateScenario(scenario);

    const txDigest = new Uint8Array(32).fill(1);
    const previewDigest = new Uint8Array(32).fill(2);
    const payoutCap = new anchor.BN(100 * 10**6);

    const [bondAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("bond"), txDigest],
      program.programId
    );

    // 1. DECLARE
    await program.methods
      .declareTx(txDigest, previewDigest, payoutCap)
      .accounts({
        bondAccount,
        user: user.publicKey,
        provider: providerKey.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // 2. BOND
    const amount = new anchor.BN(10 * 10**6);

    // Deriving vault PDA
    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), txDigest],
      program.programId
    );
    vaultAccount = vault;

    await program.methods
      .bondTx(amount)
      .accounts({
        bondAccount,
        provider: providerKey.publicKey,
        providerTokenAccount: providerTokenAccount,
        bondVault: vaultAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([providerKey])
      .rpc();

    // 3. EXECUTE (Simulated)
    const actualFingerprint = res.actual;
    const expectedFingerprint = res.expected;

    // 4. VERIFY (Keeper)
    const verification = verifyStructuralMatch(expectedFingerprint, actualFingerprint);

    await program.methods
      .verifyTx(verification.isMatch, new Uint8Array(32).fill(3))
      .accounts({
        bondAccount,
        keeper: keeper.publicKey,
      })
      .signers([keeper])
      .rpc();

    // 5. SETTLE
    // For the test, we need to create the user's token account to receive payouts
    const userPayoutAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet,
      usdcMint,
      user.publicKey
    );

    await program.methods
      .settleTx()
      .accounts({
        bondAccount,
        providerTokenAccount: providerTokenAccount,
        userTokenAccount: userPayoutAccount,
        bondVault: vaultAccount,
        config: configAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return {
      scenario,
      verification,
      loss: res.realizedLoss,
      bondAccount
    };
  }

  it("Scenario A: Happy Path - Honest swap pays back bond", async () => {
    const { verification, loss, bondAccount } = await setupBondScenario(Scenario.HAPPY_PATH);
    expect(verification.isMatch).to.be.true;
    expect(loss).to.equal(0);
    const acc = await program.account.bondAccount.fetch(bondAccount.publicKey);
    expect(acc.status).to.equal(BondStatus.Released);
  });

  it("Scenario B: Attack Path - Hidden transfer triggers payout", async () => {
    const { verification, loss, bondAccount } = await setupBondScenario(Scenario.HIDDEN_TRANSFER);
    expect(verification.isMatch).to.be.false;
    expect(loss).to.be.above(0);
    const acc = await program.account.bondAccount.fetch(bondAccount.publicKey);
    expect(acc.status).to.equal(BondStatus.ClaimPaid);
  });

  it("Scenario C: Boundary Path - Slippage does NOT trigger payout", async () => {
    const { verification, loss, bondAccount } = await setupBondScenario(Scenario.SLIPPAGE_BOUNDARY);
    expect(verification.isMatch).to.be.true;
    const acc = await program.account.bondAccount.fetch(bondAccount.publicKey);
    expect(acc.status).to.equal(BondStatus.Released);
  });
});
