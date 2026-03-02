"""
AlgoGrant - REST API Server
Flask API that wraps grant_service.py and exposes endpoints for the frontend.
Run: python api_server.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from grant_service import (
    get_contract_address,
    get_balance,
    get_grant_state,
    get_grant_status,
    get_transactions,
    approve_milestone,
    release_funds,
    APP_ID,
)

app = Flask(__name__)
CORS(app)  # Allow frontend to call API from different port


# ============================================
# GET /api/status — Full grant status summary
# ============================================
@app.route("/api/status", methods=["GET"])
def api_status():
    """Returns the complete grant status including balances and state."""
    try:
        state = get_grant_state()
        team_addr = state.get("team", "")
        status = get_grant_status(team_addr)
        return jsonify({"success": True, "data": status})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# GET /api/state — Raw on-chain state
# ============================================
@app.route("/api/state", methods=["GET"])
def api_state():
    """Returns raw global state from the smart contract."""
    try:
        state = get_grant_state()
        return jsonify({"success": True, "data": state})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# GET /api/balance/<address> — Balance of any address
# ============================================
@app.route("/api/balance/<address>", methods=["GET"])
def api_balance(address):
    """Returns balance in ALGO for the given address."""
    try:
        bal = get_balance(address)
        return jsonify({"success": True, "data": {"address": address, "balance_algo": bal}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# GET /api/contract-address — Escrow address
# ============================================
@app.route("/api/contract-address", methods=["GET"])
def api_contract_address():
    """Returns the derived escrow/contract address."""
    try:
        addr = get_contract_address()
        return jsonify({"success": True, "data": {"contract_address": addr}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# GET /api/transactions — Transaction history
# ============================================
@app.route("/api/transactions", methods=["GET"])
def api_transactions():
    """Returns recent transactions for the contract address."""
    try:
        limit = request.args.get("limit", 10, type=int)
        address = request.args.get("address", None)
        txns = get_transactions(address=address, limit=limit)
        return jsonify({"success": True, "data": txns})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# POST /api/approve — Approve milestone
# ============================================
@app.route("/api/approve", methods=["POST"])
def api_approve():
    """Sponsor approves the current milestone. Returns TX ID."""
    try:
        txid = approve_milestone()
        return jsonify({"success": True, "data": {"txid": txid, "action": "approve"}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# POST /api/release — Release funds
# ============================================
@app.route("/api/release", methods=["POST"])
def api_release():
    """Release milestone funds to the team wallet. Returns TX ID."""
    try:
        txid = release_funds()
        return jsonify({"success": True, "data": {"txid": txid, "action": "release"}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================
# GET /api/info — App ID and basic info
# ============================================
@app.route("/api/info", methods=["GET"])
def api_info():
    """Returns basic app info."""
    try:
        return jsonify({
            "success": True,
            "data": {
                "app_id": APP_ID,
                "contract_address": get_contract_address(),
                "network": "Algorand TestNet",
            },
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    print("=" * 50)
    print("AlgoGrant API Server")
    print(f"App ID: {APP_ID}")
    print(f"Contract: {get_contract_address()}")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=True)
