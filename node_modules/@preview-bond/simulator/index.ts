import { Fingerprint, TokenTransfer } from '@preview-bond/shared';

export enum Scenario {
  HAPPY_PATH,
  HIDDEN_TRANSFER,
  WRONG_PROGRAM,
  AUTHORITY_CHANGE,
  UNEXPECTED_CPI,
  SLIPPAGE_BOUNDARY
}

export interface SimulationResult {
  scenario: Scenario;
  expected: Fingerprint;
  actual: Fingerprint;
  realizedLoss: number;
}

export class AttackSimulator {
  private readonly mockUser = 'UserPubkey123';
  private readonly mockProvider = 'ProviderPubkey456';
  private readonly mockBadActor = 'BadActorPubkey678';
  private readonly USDC_MINT = 'EPjFW3F2S3S9GkS4L2G8D...';

  public generateScenario(scenario: Scenario): SimulationResult {
    switch (scenario) {
      case Scenario.HAPPY_PATH:
        return this.createHappyPath();
      case Scenario.HIDDEN_TRANSFER:
        return this.createHiddenTransfer();
      case Scenario.WRONG_PROGRAM:
        return this.createWrongProgram();
      case Scenario.AUTHORITY_CHANGE:
        return this.createAuthorityChange();
      case Scenario.UNEXPECTED_CPI:
        return this.createUnexpectedCPI();
      case Scenario.SLIPPAGE_BOUNDARY:
        return this.createSlippageCase();
      default:
        throw new Error('Unknown scenario');
    }
  }

  private createHappyPath(): SimulationResult {
    const fingerprint: Fingerprint = {
      mainProgramId: 'JupiterProgId',
      programs: ['JupiterProgId', 'TokenProgId'],
      transfers: [
        { mint: this.USDC_MINT, amount: 10, from: this.mockUser, to: 'DEXPool' }
      ],
      authorityChanges: [],
    };

    return {
      scenario: Scenario.HAPPY_PATH,
      expected: fingerprint,
      actual: { ...fingerprint },
      realizedLoss: 0,
    };
  }

  private createHiddenTransfer(): SimulationResult {
    const expected: Fingerprint = {
      mainProgramId: 'JupiterProgId',
      programs: ['JupiterProgId', 'TokenProgId'],
      transfers: [
        { mint: this.USDC_MINT, amount: 10, from: this.mockUser, to: 'DEXPool' }
      ],
      authorityChanges: [],
    };

    const actual: Fingerprint = {
      ...expected,
      transfers: [
        ...expected.transfers,
        { mint: this.USDC_MINT, amount: 100, from: this.mockUser, to: this.mockBadActor }
      ],
    };

    return {
      scenario: Scenario.HIDDEN_TRANSFER,
      expected,
      actual,
      realizedLoss: 100,
    };
  }

  private createWrongProgram(): SimulationResult {
    const expected: Fingerprint = {
      mainProgramId: 'JupiterProgId',
      programs: ['JupiterProgId', 'TokenProgId'],
      transfers: [],
      authorityChanges: [],
    };

    const actual: Fingerprint = {
      ...expected,
      mainProgramId: 'MaliciousProgId',
    };

    return {
      scenario: Scenario.WRONG_PROGRAM,
      expected,
      actual,
      realizedLoss: 50,
    };
  }

  private createAuthorityChange(): SimulationResult {
    const expected: Fingerprint = {
      mainProgramId: 'JupiterProgId',
      programs: ['JupiterProgId', 'TokenProgId'],
      transfers: [],
      authorityChanges: [],
    };

    const actual: Fingerprint = {
      ...expected,
      authorityChanges: [
        { account: 'UserTokenAccount', oldAuthority: this.mockUser, newAuthority: this.mockBadActor }
      ],
    };

    return {
      scenario: Scenario.AUTHORITY_CHANGE,
      expected,
      actual,
      realizedLoss: 1000,
    };
  }

  private createUnexpectedCPI(): SimulationResult {
    const expected: Fingerprint = {
      mainProgramId: 'JupiterProgId',
      programs: ['JupiterProgId', 'TokenProgId'],
      transfers: [],
      authorityChanges: [],
    };

    const actual: Fingerprint = {
      ...expected,
      programs: [...expected.programs, 'UnexpectedSpyProgId'],
    };

    return {
      scenario: Scenario.UNEXPECTED_CPI,
      expected,
      actual,
      realizedLoss: 0, // Harmless mismatch example
    };
  }

  private createSlippageCase(): SimulationResult {
    const fingerprint: Fingerprint = {
      mainProgramId: 'JupiterProgId',
      programs: ['JupiterProgId', 'TokenProgId'],
      transfers: [
        { mint: this.USDC_MINT, amount: 10, from: this.mockUser, to: 'DEXPool' }
      ],
      authorityChanges: [],
    };

    // Slippage changes the amount, but not the structural fingerprint (mints/programs/authority)
    // In a real world, amounts might be in the fingerprint, but here we focus on structural.
    return {
      scenario: Scenario.SLIPPAGE_BOUNDARY,
      expected: fingerprint,
      actual: { ...fingerprint },
      realizedLoss: 2, // User lost 2 USDC due to slippage, but structural match is true.
    };
  }
}
