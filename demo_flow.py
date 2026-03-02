from backend_service import *
import time

print("\n🔎 Initial Status")
print(system_status())

print("\n🟡 Approving Milestone...")
tx1 = approve_milestone()
print("TX:", tx1)

time.sleep(5)

print("\n💸 Releasing Funds...")
tx2 = release_funds()
print("TX:", tx2)

time.sleep(5)

print("\n✅ Final Status")
print(system_status())