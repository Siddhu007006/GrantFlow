"""
Redeploy the escrow contract with correctly encoded team address.
"""
from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction, encoding
from pyteal import *
import base64

# New Sponsor mnemonic
creator_mnemonic = "ride youth ghost nice common little cushion nurse veteran cube jazz purity account cry excuse uphold stick like mind crazy judge corn banner above shock"
private_key = mnemonic.to_private_key(creator_mnemonic)
sender = account.address_from_private_key(private_key)

client = algod.AlgodClient("", "https://testnet-api.algonode.cloud")

# Check balance
info = client.account_info(sender)
balance = info["amount"] / 1_000_000
print(f"Sender: {sender}")
print(f"Balance: {balance} ALGO")

# ---- Contract code ----
def approval_program():
    sponsor_key = Bytes("sponsor")
    team_key = Bytes("team")
    amount_key = Bytes("milestone_amt")
    released_key = Bytes("released")
    approved_key = Bytes("approved")

    on_create = Seq(
        App.globalPut(sponsor_key, Txn.sender()),
        App.globalPut(team_key, Txn.application_args[0]),
        App.globalPut(amount_key, Btoi(Txn.application_args[1])),
        App.globalPut(released_key, Int(0)),
        App.globalPut(approved_key, Int(0)),
        Return(Int(1))
    )

    approve_milestone = Seq(
        Assert(Txn.sender() == App.globalGet(sponsor_key)),
        App.globalPut(approved_key, Int(1)),
        Return(Int(1))
    )

    release_funds = Seq(
        Assert(App.globalGet(approved_key) == Int(1)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(team_key),
            TxnField.amount: App.globalGet(amount_key),
        }),
        InnerTxnBuilder.Submit(),
        App.globalPut(
            released_key,
            App.globalGet(released_key) + App.globalGet(amount_key)
        ),
        App.globalPut(approved_key, Int(0)),
        Return(Int(1))
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("approve"), approve_milestone],
        [Txn.application_args[0] == Bytes("release"), release_funds]
    )
    return program

def clear_program():
    return Return(Int(1))

# Compile
approval_teal = compileTeal(approval_program(), Mode.Application, version=6)
clear_teal = compileTeal(clear_program(), Mode.Application, version=6)

approval_compiled = base64.b64decode(client.compile(approval_teal)["result"])
clear_compiled = base64.b64decode(client.compile(clear_teal)["result"])

params = client.suggested_params()

# Team/Receiver address - decoded as raw 32-byte public key
team_address = "OHQISH2P67CG7KVQA7T22ICMRN245VE4M4KGO7G43R4QBUATJN36NMFDRM"
team_bytes = encoding.decode_address(team_address)

print(f"Team address: {team_address}")
print(f"Team bytes length: {len(team_bytes)} (should be 32)")

txn = transaction.ApplicationCreateTxn(
    sender,
    params,
    on_complete=transaction.OnComplete.NoOpOC,
    approval_program=approval_compiled,
    clear_program=clear_compiled,
    global_schema=transaction.StateSchema(num_uints=3, num_byte_slices=2),
    local_schema=transaction.StateSchema(0, 0),
    app_args=[
        team_bytes,
        (100_000).to_bytes(8, "big")
    ]
)

signed_txn = txn.sign(private_key)
txid = client.send_transaction(signed_txn)
print(f"\nDeploying... TXID: {txid}")

result = transaction.wait_for_confirmation(client, txid, 4)
app_id = result["application-index"]
print(f"\n{'='*50}")
print(f"NEW APP ID: {app_id}")
print(f"{'='*50}")
