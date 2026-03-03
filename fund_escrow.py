from algosdk.v2client import algod
from algosdk import transaction, mnemonic, account
from grant_service import get_contract_address, SPONSOR_MNEMONIC

# 1. Connect to AlgoNode TestNet
client = algod.AlgodClient("", "https://testnet-api.algonode.cloud")

# 2. Get Sponsor account details
private_key = mnemonic.to_private_key(SPONSOR_MNEMONIC)
sponsor_address = account.address_from_private_key(private_key)

# 3. Get the Escrow Contract Address
contract_address = get_contract_address()
funding_amount = 2_000_000 # 2.0 ALGO (in microAlgos)

print(f"Sponsor: {sponsor_address}")
print(f"Contract: {contract_address}")
print(f"Funding: {funding_amount / 1_000_000} ALGO")

# 4. Create and send the Payment Transaction
params = client.suggested_params()
txn = transaction.PaymentTxn(
    sender=sponsor_address,
    sp=params,
    receiver=contract_address,
    amt=funding_amount
)

signed_txn = txn.sign(private_key)
txid = client.send_transaction(signed_txn)
print(f"Waiting for confirmation... TXID: {txid}")
transaction.wait_for_confirmation(client, txid, 4)
print(f"✅ Successfully funded {funding_amount / 1_000_000} ALGO to the Escrow Contract!")
