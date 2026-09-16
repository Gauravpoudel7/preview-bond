import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { AttackSimulator, Scenario } from "@preview-bond/simulator";
import { verifyStructuralMatch } from "@preview-bond/shared";
import { PreviewBond, BondStatus } from "@preview-bond/types";
import * as fs from "fs";
import * as path from "path";

async function runDemo() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const idlPath = require("path").join(__dirname, "../../idl/preview_bond.json");
  const idl = JSON.parse(require("fs").readFileSync(idlPath, "utf8"));
  idl.address = "5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi";
  const program = new anchor.Program(idl as any, provider) as any;
const user = Keypair.generate();
  const providerKey = Keypair.generate();
  const keeper = Keypair.generate();
  for (const k of [user, providerKey, keeper]) {
    const sig = await provider.connection.requestAirdrop(k.publicKey, 2_000_000_000);
    await provider.connection.confirmTransaction(sig, "confirmed");
  }

  console.log("\n📉 Starting Slippage Boundary Demo...");
  console.log("--------------------------------------------------");

  const simulator = new AttackSimulator();
  const res = simulator.generateScenario(Scenario.SLIPPAGE_BOUNDARY);

  console.log("1. DECLARE: Simulating Swap with slippage risk...");
  const txDigest = require("crypto").randomBytes(32);
  const previewDigest = require("crypto").randomBytes(32);

  const [bondAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("bond"), txDigest],
    program.programId
  );

  await program.methods
    .declareTx(txDigest, previewDigest, new anchor.BN(100 * 10**6))
    .accounts({
      bondAccount,
      user: user.publicKey,
      provider: providerKey.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([user])
    .rpc();
  console.log("✅ Transaction Declared.");

  console.log("\n2. BOND: Locking Funds (Status-Only)...");
  await program.methods
    .bondTx(new anchor.BN(10 * 10**6))
    .accounts({
      bondAccount,
      provider: providerKey.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([providerKey])
    .rpc();
  console.log("💰 Bond Status: Locked.");

  console.log("\n3. EXECUTE: Transaction landed with SLIPPAGE LOSS...");
  console.log("Structural Check:");
  console.log("  EXPECTED Structure:", JSON.stringify(res.expected.transfers, null, 2));
  console.log("  ACTUAL Structure:  ", JSON.stringify(res.actual.transfers, null, 2));

  const verification = verifyStructuralMatch(res.expected, res.actual);
  console.log(`\n4. VERIFY: Keeper Attestation -> ${verification.isMatch ? 'MATCH' : 'MISMATCH'}`);
  console.log("Note: Price moves do not change the structural fingerprint.");

  await program.methods
    .verifyTx(verification.isMatch, new Uint8Array(32).fill(9))
    .accounts({
      bondAccount,
      keeper: keeper.publicKey,
    })
    .signers([keeper])
    .rpc();
  console.log("✅ Verification recorded on-chain.");

  console.log("\n5. SETTLE: Finalizing funds...");
  await program.methods
    .settleTx()
    .accounts({
      bondAccount,
    })
    .rpc();

  console.log("🎉 RESULT: Bond Released. (Slippage is not covered, but structure was honest).");
  console.log("--------------------------------------------------\n");
}

runDemo().catch(console.error);
