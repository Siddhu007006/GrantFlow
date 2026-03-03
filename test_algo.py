from grant_service import get_grant_state, get_grant_status

print("Fetching grant state...")
try:
    state = get_grant_state()
    print("State:", state)
    team_addr = state.get("team", "")
    print("Team Address:", team_addr)
    status = get_grant_status(team_addr)
    print("Status:", status)
except Exception as e:
    print("Error:", e)
