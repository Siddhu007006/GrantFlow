from backend_service import *

status = system_status()

print("\n🏦 CONTRACT INFO")
print("App ID:", status["app_id"])
print("Address:", status["contract_address"])

print("\n💰 BALANCES")
print("Escrow:", status["contract_balance"], "ALGO")
print("Team:", status["team_balance"], "ALGO")

print("\n📊 STATE")
for k, v in status["state"].items():
    print(k, ":", v)