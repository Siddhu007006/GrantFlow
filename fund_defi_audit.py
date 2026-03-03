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

# App ID for DeFi Protocol Audit
app_id = 756442667
app_address = get_application_address(app_id)

print(f"Funding app {app_id} (Address: {app_address}) with 4 ALGO from {sender}...")

params = client.suggested_params()
amount = 4_000_000  # 4 ALGO

unsigned_txn = transaction.PaymentTxn(sender, params, app_address, amount)
signed_txn = unsigned_txn.sign(private_key)

txid = client.send_transaction(signed_txn)
print("Successfully sent transaction with txID: {}".format(txid))

try:
    transaction.wait_for_confirmation(client, txid, 4)
    print("Funding confirmed!")
except Exception as err:
    print(err)
