from algosdk.v2client import algod
from algosdk.logic import get_application_address

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 756423283

client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

contract_address = get_application_address(APP_ID)

info = client.account_info(contract_address)

balance = info["amount"] / 1_000_000

print("🏦 Contract Balance:", balance, "ALGO")