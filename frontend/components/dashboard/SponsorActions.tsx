"use client";

import { useState } from "react";
import algosdk from "algosdk";
import { useWallet } from "@/components/WalletProvider";
import { SPONSOR_ADDRESS, RECEIVER_ADDRESS, APP_ID, ALGOD_URL } from "@/lib/constants";

const algodClient = new algosdk.Algodv2("", ALGOD_URL, "");

async function sendAppCall(
  action: "approve" | "release",
  senderAddress: string,
  signTxn: (txnGroups: Array<{ txn: algosdk.Transaction }[]>) => Promise<Uint8Array[]>
): Promise<string> {
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    sender: senderAddress,
    appIndex: APP_ID,
    appArgs: [new Uint8Array(Buffer.from(action))],
    // For "release", the contract sends an inner payment to the team address.
    // AVM requires referenced accounts to be passed explicitly.
    accounts: action === "release" ? [RECEIVER_ADDRESS] : undefined,
    suggestedParams,
  });
  const signedTxns = await signTxn([[{ txn }]]);
  const response = await algodClient.sendRawTransaction(signedTxns[0]).do();
  const txId = response.txid;
  console.log(`[${action.toUpperCase()}] Transaction sent: ${txId}`);
  await algosdk.waitForConfirmation(algodClient, txId, 4);
  console.log(`[${action.toUpperCase()}] Transaction confirmed: ${txId}`);
  return txId;
}

export default function SponsorActions() {
  const [approving, setApproving] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress, isSponsor, connectWallet, resetConnection, peraWallet } = useWallet();

  const txPending = approving || releasing;

  const handleApprove = async () => {
    if (txPending) return;
    if (!walletAddress || !peraWallet) {
      await connectWallet();
      return;
    }
    if (walletAddress !== SPONSOR_ADDRESS) {
      setError("Only the sponsor wallet can perform this action.");
      return;
    }
    setApproving(true);
    setError(null);
    setLastTx(null);
    try {
      const txId = await sendAppCall(
        "approve",
        walletAddress,
        (txnGroups) => peraWallet.signTransaction(txnGroups)
      );
      setLastTx(txId);
    } catch (err: any) {
      handleTxError(err, "Approval");
    } finally {
      setApproving(false);
    }
  };

  const handleRelease = async () => {
    if (txPending) return;
    if (!walletAddress || !peraWallet) {
      await connectWallet();
      return;
    }
    if (walletAddress !== SPONSOR_ADDRESS) {
      setError("Only the sponsor wallet can perform this action.");
      return;
    }
    setReleasing(true);
    setError(null);
    setLastTx(null);
    try {
      const txId = await sendAppCall(
        "release",
        walletAddress,
        (txnGroups) => peraWallet.signTransaction(txnGroups)
      );
      setLastTx(txId);
    } catch (err: any) {
      handleTxError(err, "Release");
    } finally {
      setReleasing(false);
    }
  };

  const handleTxError = async (err: any, action: string) => {
    console.error(`${action} error:`, err);
    const msg = err?.message || err?.data?.message || "";
    const code = err?.data?.code || err?.code;

    if (code === 4100 || msg.includes("4100") || msg.includes("pending") || msg.includes("in progress")) {
      // Auto-reset stale Pera session
      await resetConnection();
      setError("Wallet session reset. Please try again.");
    } else if (msg.includes("CONNECT_MODAL_CLOSED") || msg.includes("cancelled")) {
      setError("Transaction cancelled by user.");
    } else if (msg.includes("No account") || msg.includes("not connected")) {
      await resetConnection();
      setError("Wallet session expired. Reconnected — please try again.");
    } else {
      setError(msg || `${action} failed. Check console for details.`);
    }
  };

  // Button labels
  let approveLabel = "CONNECT WALLET TO APPROVE";
  let releaseLabel = "CONNECT TO RELEASE";
  if (walletAddress && isSponsor) {
    approveLabel = approving ? "APPROVING..." : "APPROVE MILESTONE";
    releaseLabel = releasing ? "RELEASING..." : "RELEASE FUNDS";
  } else if (walletAddress && !isSponsor) {
    approveLabel = "SPONSOR ONLY";
    releaseLabel = "SPONSOR ONLY";
  }

  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
        <span className="w-[8px] h-[8px] bg-[#FFD600]" />
        <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
          SPONSOR ACTIONS
        </span>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        <p className="font-ibm-mono text-[11px] text-[#888888] tracking-[0.5px] leading-[1.6]">
          As the grant sponsor, you can approve milestones and release funds to the team wallet upon successful completion.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApprove}
            disabled={approving || txPending || (!!walletAddress && !isSponsor)}
            className="flex items-center justify-center flex-1 h-[48px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[2px]">
              {approveLabel}
            </span>
          </button>
          <button
            onClick={handleRelease}
            disabled={releasing || txPending || (!!walletAddress && !isSponsor)}
            className="flex items-center justify-center flex-1 h-[48px] bg-[#0A0A0A] border-2 border-[#4ADE80] hover:border-[#6EE7A0] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-ibm-mono text-[11px] text-[#4ADE80] tracking-[2px]">
              {releaseLabel}
            </span>
          </button>
        </div>

        {/* Status feedback */}
        {lastTx && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0A2E1A] border border-[#4ADE80]">
            <span className="w-[5px] h-[5px] rounded-full bg-[#4ADE80]" />
            <span className="font-ibm-mono text-[9px] text-[#4ADE80] tracking-[1px]">
              TX CONFIRMED: {lastTx.slice(0, 12)}...
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2E0A0A] border border-[#FF4444]">
            <span className="w-[5px] h-[5px] rounded-full bg-[#FF4444]" />
            <span className="font-ibm-mono text-[9px] text-[#FF4444] tracking-[1px]">
              ERROR: {error}
            </span>
          </div>
        )}

        {/* Role status indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#1D1D1D]">
          {!walletAddress ? (
            <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">
              CONNECT YOUR PERA WALLET TO SIGN TRANSACTIONS
            </span>
          ) : isSponsor ? (
            <>
              <span className="w-[5px] h-[5px] rounded-full bg-[#4ADE80]" />
              <span className="font-ibm-mono text-[9px] text-[#4ADE80] tracking-[1px]">
                SPONSOR WALLET CONNECTED // {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </>
          ) : (
            <>
              <span className="w-[5px] h-[5px] rounded-full bg-[#60A5FA]" />
              <span className="font-ibm-mono text-[9px] text-[#60A5FA] tracking-[1px]">
                VIEWER MODE — NOT AUTHORIZED // {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
