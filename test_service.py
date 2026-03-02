"""
AlgoGrant - Service Test Script
Quick test to verify grant_service.py functions work correctly.
"""

from grant_service import *

print("=" * 50)
print("AlgoGrant Service Test")
print("=" * 50)

# 1. Contract address
contract_addr = get_contract_address()
print(f"\n[1] Contract Address: {contract_addr}")

# 2. Contract balance
balance = get_balance(contract_addr)
print(f"[2] Contract Balance: {balance} ALGO")

# 3. Full grant state
print(f"\n[3] On-Chain State:")
state = get_grant_state()
for key, value in state.items():
    print(f"    {key}: {value}")

# 4. Grant status summary
print(f"\n[4] Grant Status Summary:")
team_addr = state.get("team", "")
if team_addr and team_addr != "-":
    status = get_grant_status(team_addr)
    for key, value in status.items():
        print(f"    {key}: {value}")
else:
    print("    WARNING: Team address not found in state")

# 5. Transaction history
print(f"\n[5] Recent Transactions:")
txns = get_transactions(limit=5)
if txns:
    for i, tx in enumerate(txns, 1):
        tx_type = tx.get("type", "?")
        txid = tx.get("txid", "?")[:16] + "..."
        action = ""
        if tx.get("app_args"):
            action = f" -> {tx['app_args']}"
        print(f"    {i}. [{tx_type}] {txid}{action}")
else:
    print("    No transactions found")

print("\n" + "=" * 50)
print("Service test complete!")
