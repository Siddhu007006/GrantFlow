from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction

# 🔴 Sponsor mnemonic
creator_mnemonic = "PASTE_SPONSOR_MNEMONIC"

private_key = mnemonic.to_private_key(creator_mnemonic)
sender = account.address_from_private_key(private_key)

algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""

client = algod.AlgodClient(algod_token, algod_address)

app_id = 756430745  # YOUR APP ID

params = client.suggested_params()

txn = transaction.ApplicationNoOpTxn(
    sender,
    params,
    app_id,
    app_args=[b"approve"]
)

signed_txn = txn.sign(private_key)

txid = client.send_transaction(signed_txn)

print("Approving milestone... TXID:", txid)

transaction.wait_for_confirmation(client, txid, 4)

print("✅ Milestone approved")