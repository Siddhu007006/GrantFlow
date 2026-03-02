from pyteal import *

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


if __name__ == "__main__":
    print(compileTeal(approval_program(), Mode.Application, version=6))