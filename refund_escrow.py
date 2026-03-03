import time
from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction
from algosdk.logic import get_application_address

creator_mnemonic = "ride youth ghost nice common little cushion nurse veteran cube jazz purity account cry excuse uphold stick like mind crazy judge corn banner above shock"
private_key = mnemonic.to_private_key(creator_mnemonic)
sender = account.address_from_private_key(private_key)

algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""
client = algod.AlgodClient(algod_token, algod_address)

app_id = 756442667 # Updated APP ID!
app_address = get_application_address(app_id)

print(f"Requesting 2 ALGO refund from app {app_id} (Address: {app_address}) to {sender}...")

params = client.suggested_params()

# Call the "refund" branch
app_args = [b"refund", (2_000_000).to_bytes(8, "big")]

# 🔹 We need to double the minimal fee because the smart contract executes an inner transaction
params.fee = 2000
params.flat_fee = True

txn = transaction.ApplicationNoOpTxn(
    sender=sender,
    sp=params,
    index=app_id,
    app_args=app_args
)

signed_txn = txn.sign(private_key)
txid = client.send_transaction(signed_txn)
print("Successfully sent refund transaction with txID: {}".format(txid))

try:
    transaction.wait_for_confirmation(client, txid, 4)
    print("Refund confirmed! 2 ALGO returned.")
except Exception as err:
    print(err)
