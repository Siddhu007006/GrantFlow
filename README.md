# GrantFlow — Blockchain Escrow for Milestone-Based Grants

A full-stack dApp for transparent, milestone-based grant payments on the **Algorand TestNet**. Funds are locked in a smart contract and released only when milestones are approved by the sponsor.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Home    │  │  Dashboard   │  │ Transparency  │  │
│  │  Page    │  │  (Live Data) │  │    Page       │  │
│  └──────────┘  └──────┬───────┘  └───────────────┘  │
│                       │                              │
│            ┌──────────┴──────────┐                   │
│            │  Pera/Lute Wallet   │                   │
│            │  (Client-side sign) │                   │
│            └──────────┬──────────┘                   │
└───────────────────────┼─────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐   ┌──────▼──────┐  ┌─────▼─────┐
   │  Flask  │   │  Algorand   │  │  Indexer  │
   │  API    │   │  TestNet    │  │  API      │
   │ :5000   │   │  (AlgoNode) │  │ (AlgoNode)│
   └─────────┘   └─────────────┘  └───────────┘
```

---

## ⛓️ Smart Contract

Written in **PyTeal**, deployed on Algorand TestNet.

| Property | Value |
|---|---|
| **App ID** | `756423283` |
| **Sponsor** | `HO5GLWLUO74NP3YNUKZVT7HDISGYZK23EIKXHVZSSYCNWCTKQRV7SHYBHE` |
| **Receiver** | `OHQISH2P67CG7KVQA7T22ICMRN245VE4M4KGO7G43R4QBUATJN36NMFDRM` |
| **Milestone Amount** | 0.1 ALGO |

### Contract Operations

| Operation | Who Can Call | What It Does |
|---|---|---|
| `approve` | Sponsor only | Sets `approved = 1` on-chain |
| `release` | Sponsor only | Sends `milestone_amt` ALGO from escrow to team wallet (requires `approved = 1`) |

### Escrow Flow

```
1. Sponsor deposits ALGO → Smart Contract Escrow
2. Team works on milestone
3. Sponsor clicks "Approve Milestone" → signs with wallet → approved = 1
4. Sponsor clicks "Release Funds" → signs with wallet → 0.1 ALGO sent to team
5. approved resets to 0, ready for next milestone
```

---

## 📁 Project Structure

```
algo/
├── frontend/                      # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx               # Home page
│   │   ├── dashboard/page.tsx     # Dashboard page
│   │   └── layout.tsx             # Root layout
│   ├── components/
│   │   ├── WalletProvider.tsx     # Pera Wallet context (connect/disconnect/sign)
│   │   ├── Navbar.tsx             # Navigation with wallet button
│   │   └── dashboard/
│   │       ├── SponsorActions.tsx  # Approve & Release buttons (on-chain txns)
│   │       ├── TeamPayment.tsx    # Payment status & team wallet info
│   │       ├── ContractOverview.tsx # Contract balances & addresses
│   │       └── TransactionHistory.tsx # On-chain transaction log
│   └── lib/
│       └── constants.ts           # APP_ID, SPONSOR/RECEIVER addresses, Algod URL
│
├── escrow_contract.py             # PyTeal smart contract source
├── deploy_contract.py             # Original deploy script
├── redeploy_contract.py           # Fixed deploy script (correct address encoding)
├── grant_service.py               # Backend service (reads contract state)
├── api_server.py                  # Flask REST API server
├── read_contract_state.py         # CLI: read on-chain state
├── check_balances.py              # CLI: check wallet balances
└── approve_milestone.py           # CLI: server-side approve (fallback)
```

---

## 🚀 Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Pera Wallet** or **Lute Wallet** (browser extension) set to **TestNet**

---

## ⚙️ Setup & Run

### 1. Clone & Install Backend Dependencies

```bash
cd algo
pip install py-algorand-sdk pyteal flask flask-cors
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start the Backend API Server

```bash
# From the algo/ directory
python api_server.py
```

The API server starts on `http://localhost:5000`.

### 4. Start the Frontend Dev Server

```bash
# From the frontend/ directory
npm run dev
```

The frontend starts on `http://localhost:3001` (or `3000` if available).

### 5. Connect Wallet

1. Open `http://localhost:3001` in your browser
2. Click **"CONNECT WALLET"** in the navbar
3. Scan the QR code with **Pera Wallet** (mobile) or connect via **Lute** (browser extension)
4. Make sure your wallet is on **Algorand TestNet**

### 6. Use the Dashboard

Navigate to `http://localhost:3001/dashboard`:

- **Contract Overview** — Live balances and addresses from on-chain state
- **Sponsor Actions** — Approve milestones & release funds (sponsor wallet only)
- **Team Payment** — Payment status and receiver wallet info
- **Transaction History** — Recent on-chain transactions

---

## 🔑 Role-Based Access

| Role | Address | Permissions |
|---|---|---|
| **Sponsor** | `HO5GLW...SHYBHE` | Approve milestones, release funds |
| **Receiver** | `OHQISH...NMFDRM` | Receives released funds |
| **Viewer** | Any other wallet | Read-only dashboard access |

When a non-sponsor wallet connects, the action buttons show **"SPONSOR ONLY"** and a blue **"VIEWER MODE — NOT AUTHORIZED"** indicator.

---

## 🔄 Redeploying the Contract

If you need to redeploy with different parameters:

1. Edit `redeploy_contract.py`:
   - Update `creator_mnemonic` (sponsor's 25-word mnemonic)
   - Update `team_address` (receiver's Algorand address)
   - Adjust `milestone_amount` if needed

2. Run the deploy:
   ```bash
   python redeploy_contract.py
   ```

3. Copy the new **App ID** from the output

4. Update the App ID in:
   - `frontend/lib/constants.ts`
   - `grant_service.py`
   - All other `.py` files that reference the old App ID

5. Fund the new contract escrow address:
   ```bash
   # Send ALGO to the contract's application address
   python -c "from algosdk.logic import get_application_address; print(get_application_address(NEW_APP_ID))"
   ```

6. Restart the API server

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Full grant summary (balances, state) |
| `/api/state` | GET | Raw on-chain global state |
| `/api/balance/<addr>` | GET | Balance of any address |
| `/api/contract-address` | GET | Escrow contract address |
| `/api/transactions` | GET | Transaction history |
| `/api/info` | GET | App ID and network info |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Blockchain** | Algorand TestNet |
| **Smart Contract** | PyTeal (compiled to TEAL v6) |
| **Frontend** | Next.js, React, TypeScript |
| **Styling** | Tailwind CSS |
| **Wallet** | @perawallet/connect, Lute |
| **Blockchain SDK** | algosdk (Python + JavaScript) |
| **Backend API** | Flask + flask-cors |

---

## ⚠️ Important Notes

- This runs on **Algorand TestNet** — no real funds are used
- The contract must be **funded** with ALGO before release operations work
- Milestones must be **approved before released** (approve → release flow)
- All transaction signing happens **client-side** via the connected wallet
- The API server provides **read-only** data to the dashboard
