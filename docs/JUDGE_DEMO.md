# Judge Demo Kit: Preview Bond

**⚠️ IMPORTANT: NOT INSURANCE.** 
Preview Bond is a structural verification proof. It is **not** a financial insurance product. This localnet demo is **status-only**, proving the state machine transitions without executing real token transfers.

---

## 🎙️ Judge Talk Track (60–90 Seconds)

*Use this narrative while interacting with the UI. Speak slowly and clearly.*

**1. The Problem (0-15s)**
"Right now, wallet transaction previews are just guesses. If a 'safe' preview hides a malicious trick—like a hidden transfer to a hacker's wallet—you lose everything. We solve this with **bonded accountability**: we record a structural fingerprint of the promise on-chain, and the provider puts a bond behind it."

**2. Not Insurance (15-25s)**
"Before we dive in, a key distinction: this is **not insurance**. We aren't covering market volatility or bad trades. We are verifying **structural honesty**. If the actual execution matches the structural promise, the bond is released. If it doesn't, it's paid out."

**3. The Demo Path (25-75s)**
*(Click scenarios in this order)*

*   **The Happy Path**: "First, a standard honest swap. We declare the preview, lock the bond, and verify the match. Result: **Released**. Everything worked as promised."
*   **The Attack**: "Now, a malicious preview. It looks safe, but it hides a structural trick—a hidden transfer. The system detects the mismatch instantly. Result: **ClaimPaid**. The bond is settled because the promise was broken."
*   **The Slippage Case**: "Finally, let's look at slippage. The user loses money because the price moved, but the transaction *structure* is still honest. Result: **Released**. This is correct—we don't cover bad prices."

**4. The Caveat (75-85s)**
"For this localnet proof, we are using a **status-only** model. The program proves the logic of the bond and settlement flow without moving real USDC, allowing us to demonstrate the full state machine rapidly."

**5. The Closer (85-90s)**
"The bottom line: **We don’t cover bad prices; we cover broken promises.**"

---

## 🖱️ UI Click-Path Checklist (`localhost:5173`)

Follow these steps precisely for a smooth demo:

- [ ] **Initialize**: Open `http://localhost:5173`.
- [ ] **Test Honest Flow**:
    - Click **Happy Path** $\rightarrow$ Wait for `🎉 Simulation Complete` $\rightarrow$ Verify status: `Released`.
- [ ] **Test Malicious Flow**:
    - Click **Attack Scenario** $\rightarrow$ Wait for `🎉 Simulation Complete` $\rightarrow$ Verify status: `ClaimPaid`.
- [ ] **Test Boundary Flow**:
    - Click **Slippage Case** $\rightarrow$ Wait for `🎉 Simulation Complete` $\rightarrow$ Verify status: `Released`.
