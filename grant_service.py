"""
AlgoGrant — Unified Backend Service
Connects to Algorand TestNet and exposes all grant management functions.
"""

from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction
from algosdk.logic import get_application_address

# ============================================
# 🔴 CONFIGURATION
# ============================================

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 756442667
SPONSOR_MNEMONIC = "ride youth ghost nice common little cushion nurse veteran cube jazz purity account cry excuse uphold stick like mind crazy judge corn banner above shock"

# Derive sponsor credentials
private_key = mnemonic.to_private_key(SPONSOR_MNEMONIC)
sender = account.address_from_private_key(private_key)

# Initialize Algod client
client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)


# ============================================
# 🏦 Contract Address
# ============================================

def get_contract_address(app_id=None):
    """Get the escrow/application account address."""
    if app_id is None:
        app_id = APP_ID
    return get_application_address(app_id)


# ============================================
# 💰 Balance Lookup
# ============================================

def get_balance(address):
    """Get balance of any Algorand address (in ALGO)."""
    info = client.account_info(address)
    return info["amount"] / 1_000_000  # Convert microAlgos → ALGO


# ============================================
# 🟡 Approve Milestone
# ============================================

def approve_milestone(app_id=None):
    """
    Sponsor approves the current milestone.
    Sets approved = 1 in the contract global state.
    Returns the transaction ID.
    """
    if app_id is None:
        app_id = APP_ID

    params = client.suggested_params()

    txn = transaction.ApplicationNoOpTxn(
        sender,
        params,
        app_id,
        app_args=[b"approve"]
    )

    signed = txn.sign(private_key)
    txid = client.send_transaction(signed)
    transaction.wait_for_confirmation(client, txid, 4)

    print(f"✅ Milestone approved — TXID: {txid}")
    return txid


# ============================================
# 💸 Release Funds
# ============================================

def release_funds(app_id=None):
    """
    Release milestone funds to the team wallet.
    Requires approved = 1. Sends milestone_amt ALGO to team address.
    Returns the transaction ID.
    """
    if app_id is None:
        app_id = APP_ID

    params = client.suggested_params()

    txn = transaction.ApplicationNoOpTxn(
        sender,
        params,
        app_id,
        app_args=[b"release"]
    )

    signed = txn.sign(private_key)
    txid = client.send_transaction(signed)
    transaction.wait_for_confirmation(client, txid, 4)

    print(f"💸 Funds released — TXID: {txid}")
    return txid


# ============================================
# 📊 Grant State & Summary
# ============================================

def get_grant_state(app_id=None):
    """
    Read the full global state of the smart contract.
    Returns a dict with all on-chain values.
    """
    import base64
    from algosdk import encoding

    if app_id is None:
        app_id = APP_ID

    app_info = client.application_info(app_id)
    global_state = app_info.get("params", {}).get("global-state", [])

    state = {}
    for item in global_state:
        key = item["key"]
        decoded_key = base64.b64decode(key).decode("utf-8")
        val = item["value"]

        if val["type"] == 1:
            # Bytes value — could be 32-byte public key or address string
            raw_bytes = base64.b64decode(val["bytes"])
            if len(raw_bytes) == 32:
                # Raw public key (e.g. sponsor from Txn.sender())
                state[decoded_key] = encoding.encode_address(raw_bytes)
            else:
                # String-encoded address (e.g. team from app_args)
                state[decoded_key] = raw_bytes.decode("utf-8", errors="ignore")
        elif val["type"] == 2:
            # Uint
            state[decoded_key] = val["uint"]

    return state


def get_grant_status(team_address, app_id=None):
    """
    Get a human-readable summary of the grant status.
    Includes contract address, balances, and on-chain state.
    """
    if app_id is None:
        app_id = APP_ID

    contract_addr = get_contract_address(app_id)
    state = get_grant_state(app_id)

    contract_balance = get_balance(contract_addr)
    team_balance = get_balance(team_address)

    approved = state.get("approved", 0)
    released = state.get("released", 0)
    milestone_amt = state.get("milestone_amt", 0)

    return {
        "app_id": app_id,
        "contract_address": contract_addr,
        "sponsor": state.get("sponsor", "—"),
        "team": state.get("team", "—"),
        "contract_balance_algo": contract_balance,
        "team_balance_algo": team_balance,
        "milestone_amount_microalgo": milestone_amt,
        "milestone_amount_algo": milestone_amt / 1_000_000,
        "total_released_microalgo": released,
        "total_released_algo": released / 1_000_000,
        "milestone_approved": bool(approved),
    }


# ============================================
# 📜 Transaction History
# ============================================

def get_transactions(address=None, limit=10, app_id=None):
    """
    Fetch recent transactions for a given address (defaults to contract address).
    Uses the Indexer API.
    """
    from algosdk.v2client import indexer

    indexer_address = "https://testnet-idx.algonode.cloud"
    indexer_client = indexer.IndexerClient("", indexer_address)

    if app_id is None:
        app_id = APP_ID

    if address is None:
        address = get_contract_address(app_id)

    response = indexer_client.search_transactions_by_address(
        address,
        limit=limit
    )

    txns = []
    for tx in response.get("transactions", []):
        txn_info = {
            "txid": tx.get("id"),
            "type": tx.get("tx-type"),
            "sender": tx.get("sender"),
            "round": tx.get("confirmed-round"),
            "timestamp": tx.get("round-time"),
            "fee": tx.get("fee"),
        }

        # Payment details
        if tx.get("payment-transaction"):
            pay = tx["payment-transaction"]
            txn_info["payment_amount_algo"] = pay.get("amount", 0) / 1_000_000
            txn_info["payment_receiver"] = pay.get("receiver", "")

        # App call details
        if tx.get("application-transaction"):
            app_tx = tx["application-transaction"]
            txn_info["app_id"] = app_tx.get("application-id")
            import base64
            txn_info["app_args"] = [
                base64.b64decode(a).decode("utf-8", errors="ignore")
                for a in app_tx.get("application-args", [])
            ]

        # Inner transactions (fund releases)
        if tx.get("inner-txns"):
            inner_list = []
            for inner in tx["inner-txns"]:
                inner_info = {
                    "type": inner.get("tx-type"),
                    "sender": inner.get("sender"),
                }
                if inner.get("payment-transaction"):
                    inner_info["amount_algo"] = inner["payment-transaction"].get("amount", 0) / 1_000_000
                    inner_info["receiver"] = inner["payment-transaction"].get("receiver", "")
                inner_list.append(inner_info)
            txn_info["inner_txns"] = inner_list

        txns.append(txn_info)

    return txns
