from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction, encoding
from pyteal import *
import base64

# 🔴 PASTE YOUR 25-WORD MNEMONIC HERE
creator_mnemonic = "reason tip lady equal impose rocket negative casino burger flock fever together stable spider never trick sudden donate option focus rail jeans nice ability luggage"

private_key = mnemonic.to_private_key(creator_mnemonic)
sender = account.address_from_private_key(private_key)

algod_address = "https://testnet-api.algonode.cloud"
algod_token = ""

client = algod.AlgodClient(algod_token, algod_address)

# ---------- CONTRACT CODE (same as before) ----------

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

# Compile programs
approval_teal = compileTeal(approval_program(), Mode.Application, version=6)
clear_teal = compileTeal(clear_program(), Mode.Application, version=6)

approval_compiled = base64.b64decode(client.compile(approval_teal)["result"])
clear_compiled = base64.b64decode(client.compile(clear_teal)["result"])

params = client.suggested_params()

# 🔵 PUT TEAM ADDRESS HERE
team_address = "G3LWP232XHXXJB6HAUHBCZKDQGPJLSFD7VCYDSVCUOREOUNZFOPYCNNYJI"

txn = transaction.ApplicationCreateTxn(
    sender,
    params,
    on_complete=transaction.OnComplete.NoOpOC,
    approval_program=approval_compiled,
    clear_program=clear_compiled,
    global_schema=transaction.StateSchema(num_uints=3, num_byte_slices=2),
    local_schema=transaction.StateSchema(0, 0),
    app_args=[
        encoding.decode_address(team_address),  # Raw 32-byte public key
        (1_000_000).to_bytes(8, "big")  # 1 ALGO per milestone
    ]
)

signed_txn = txn.sign(private_key)

txid = client.send_transaction(signed_txn)

print("Deploying contract... TXID:", txid)

result = transaction.wait_for_confirmation(client, txid, 4)

print("🎉 Application ID:", result["application-index"])