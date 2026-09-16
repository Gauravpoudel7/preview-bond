import React, { useState } from 'react';
import { AttackSimulator, Scenario } from '@preview-bond/simulator';
import { verifyStructuralMatch, Fingerprint } from '@preview-bond/shared';

function App() {
  const [scenario, setScenario] = useState<Scenario>(Scenario.HAPPY_PATH);
  const [step, setStep] = useState('IDLE'); // IDLE -> DECLARED -> BONDED -> EXECUTED -> SETTLED
  const [result, setResult] = useState<{ expected: Fingerprint; actual: Fingerprint; loss: number } | null>(null);
  const [statusMsg, setStatusMsg] = useState('Select a scenario to begin.');

  const simulator = new AttackSimulator();

  const handleDeclare = () => {
    setStatusMsg('Simulating transaction and recording fingerprint...');
    setStep('DECLARED');
  };

  const handleBond = () => {
    setStatusMsg('Locking USDC in Solana program... (Check Explorer)');
    setStep('BONDED');
  };

  const handleExecute = () => {
    setStatusMsg('Executing transaction on-chain...');
    const res = simulator.generateScenario(scenario);
    setResult({ expected: res.expected, actual: res.actual, loss: res.realizedLoss });
    setStep('EXECUTED');
    setStatusMsg('Transaction landed. Keeper is verifying...');
  };

  const handleSettle = () => {
    if (!result) return;
    const verification = verifyStructuralMatch(result.expected, result.actual);

    if (verification.isMatch) {
      setStatusMsg('MATCH: Bond released to provider. Fee: 0.30%');
    } else if (result.loss > 0) {
      setStatusMsg(`MISMATCH: ${verification.violatedRule} detected. Payout: $${result.loss} USDC`);
    } else {
      setStatusMsg('MISMATCH: Structural trick found, but $0 loss. No payout.');
    }
    setStep('SETTLED');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🛡️ Preview Bond Demo</h1>
      <p><strong>Positioning:</strong> Economic Verification for Solana Tx Previews</p>

      <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <label>Select Scenario: </label>
        <select value={scenario} onChange={(e) => { setScenario(Number(e.target.value)); setStep('IDLE'); setResult(null); }}>
          <option value={Scenario.HAPPY_PATH}>Happy Path (Standard Swap)</option>
          <option value={Scenario.HIDDEN_TRANSFER}>Attack: Hidden Transfer</option>
          <option value={Scenario.WRONG_PROGRAM}>Attack: Wrong Program</option>
          <option value={Scenario.AUTHORITY_CHANGE}>Attack: Authority Change</option>
          <option value={Scenario.UNEXPECTED_CPI}>Attack: Unexpected CPI</option>
          <option value={Scenario.SLIPPAGE_BOUNDARY}>Boundary: High Slippage</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button disabled={step !== 'IDLE'} onClick={handleDeclare}>1. Declare</button>
        <button disabled={step !== 'DECLARED'} onClick={handleBond}>2. Bond</button>
        <button disabled={step !== 'BONDED'} onClick={handleExecute}>3. Execute</button>
        <button disabled={step !== 'EXECUTED'} onClick={handleSettle}>4. Settle</button>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#007bff' }}>{statusMsg}</div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Expected Fingerprint</h3>
            <pre>{JSON.stringify(result.expected, null, 2)}</pre>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Actual Execution</h3>
            <pre>{JSON.stringify(result.actual, null, 2)}</pre>
          </div>
        </div>
      )}

      {step === 'SETTLED' && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#eef', borderRadius: '8px', textAlign: 'center' }}>
          <h2>Final Outcome: {statusMsg}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
