from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction
from algosdk.logic import get_application_address
import base64

# 🔴 CONFIGURATION
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 756423283
SPONSOR_MNEMONIC = "PASTE_SPONSOR_25_WORDS"
TEAM_ADDRESS = "PASTE_TEAM_ADDRESS"

private_key = mnemonic.to_private_key(SPONSOR_MNEMONIC)
sender = account.address_from_private_key(private_key)

client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)


# 🏦 Contract Address
def get_contract_address():
    return get_application_address(APP_ID)


# 💰 Balance (in ALGO)
def get_balance(address):
    info = client.account_info(address)
    return info["amount"] / 1_000_000


# 📊 Read Global State
def read_contract_state():
    app_info = client.application_info(APP_ID)
    global_state = app_info["params"]["global-state"]

    decoded = {}

    for item in global_state:
        key = base64.b64decode(item["key"]).decode()

        if item["value"]["type"] == 1:
            value = base64.b64decode(item["value"]["bytes"]).decode()
        else:
            value = item["value"]["uint"]

        decoded[key] = value

    return decoded


# 🟡 Approve Milestone
def approve_milestone():
    params = client.suggested_params()

    txn = transaction.ApplicationNoOpTxn(
        sender,
        params,
        APP_ID,
        app_args=[b"approve"]
    )

    signed = txn.sign(private_key)
    txid = client.send_transaction(signed)

    return txid


# 💸 Release Funds
def release_funds():
    params = client.suggested_params()

    txn = transaction.ApplicationNoOpTxn(
        sender,
        params,
        APP_ID,
        app_args=[b"release"]
    )

    signed = txn.sign(private_key)
    txid = client.send_transaction(signed)

    return txid


# 📋 System Status Summary
def system_status():
    contract_addr = get_contract_address()

    return {
        "app_id": APP_ID,
        "contract_address": contract_addr,
        "contract_balance": get_balance(contract_addr),
        "team_balance": get_balance(TEAM_ADDRESS),
        "state": read_contract_state()
    }