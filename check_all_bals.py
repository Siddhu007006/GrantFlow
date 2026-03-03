from algosdk.v2client import algod
from algosdk import account, mnemonic
from algosdk.logic import get_application_address

client = algod.AlgodClient('', 'https://testnet-api.algonode.cloud')

sponsor_mnemonic = "ride youth ghost nice common little cushion nurse veteran cube jazz purity account cry excuse uphold stick like mind crazy judge corn banner above shock"
sponsor_addr = account.address_from_private_key(mnemonic.to_private_key(sponsor_mnemonic))

app1 = 756439065
app1_addr = get_application_address(app1)

app2 = 756442667
app2_addr = get_application_address(app2)

team_addr = "G3LWP232XHXXJB6HAUHBCZKDQGPJLSFD7VCYDSVCUOREOUNZFOPYCNNYJI"

def print_bal(name, addr):
    info = client.account_info(addr)
    print(f"{name}: {info.get('amount') / 1_000_000} ALGO ({addr})")

print_bal("Sponsor", sponsor_addr)
print_bal("Team", team_addr)
print_bal("App 1 (Old)", app1_addr)
print_bal("App 2 (New)", app2_addr)
