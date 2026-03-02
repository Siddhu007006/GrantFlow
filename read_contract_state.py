from algosdk.v2client import algod

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 756430745

client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)


def read_global_state(app_id):
    app_info = client.application_info(app_id)
    global_state = app_info["params"]["global-state"]

    decoded = {}

    for item in global_state:
        key = item["key"]
        value = item["value"]

        import base64
        decoded_key = base64.b64decode(key).decode()

        if value["type"] == 1:
            raw = base64.b64decode(value["bytes"])
            if len(raw) == 32:
                from algosdk import encoding
                decoded_value = encoding.encode_address(raw)
            else:
                decoded_value = raw.decode("utf-8", errors="replace")
        else:
            decoded_value = value["uint"]

        decoded[decoded_key] = decoded_value

    return decoded


state = read_global_state(APP_ID)

print("📊 Contract State:")
for k, v in state.items():
    print(f"{k}: {v}")