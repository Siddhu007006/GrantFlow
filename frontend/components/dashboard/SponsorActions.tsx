"use client";

import { useState } from "react";
import algosdk from "algosdk";
import { useWallet } from "@/components/WalletProvider";
import { SPONSOR_ADDRESS, RECEIVER_ADDRESS, APP_ID, ALGOD_URL } from "@/lib/constants";
import { useMilestones, type MilestoneStatusType } from "./MilestoneContext";

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

const statusBadge: Record<MilestoneStatusType, { bg: string; border: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-[#1A1A1A]", border: "border-[#555555]", text: "text-[#555555]", dot: "bg-[#555555]" },
  SUBMITTED: { bg: "bg-[#0A1A2E]", border: "border-[#60A5FA]", text: "text-[#60A5FA]", dot: "bg-[#60A5FA]" },
  APPROVED: { bg: "bg-[#332800]", border: "border-[#FFD600]", text: "text-[#FFD600]", dot: "bg-[#FFD600]" },
  PAID: { bg: "bg-[#0A2E1A]", border: "border-[#4ADE80]", text: "text-[#4ADE80]", dot: "bg-[#4ADE80]" },
};

export default function SponsorActions() {
  const [approving, setApproving] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress, isSponsor, connectWallet, resetConnection, peraWallet } = useWallet();
  const { milestones, selectedId, selectedMilestone, selectMilestone, approveMilestone, releaseMilestone } = useMilestones();

  const txPending = approving || releasing;

  // Button enable rules
  const canApprove =
    selectedMilestone &&
    (selectedMilestone.status === "PENDING" || selectedMilestone.status === "SUBMITTED") &&
    isSponsor &&
    !txPending;

  const canRelease =
    selectedMilestone &&
    selectedMilestone.status === "APPROVED" &&
    isSponsor &&
    !txPending;

  const handleApprove = async () => {
    if (!canApprove || !selectedMilestone) return;
    if (!walletAddress || !peraWallet) {
      await connectWallet();
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
      approveMilestone(selectedMilestone.id);
    } catch (err: any) {
      handleTxError(err, "Approval");
    } finally {
      setApproving(false);
    }
  };

  const handleRelease = async () => {
    if (!canRelease || !selectedMilestone) return;
    if (!walletAddress || !peraWallet) {
      await connectWallet();
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
      releaseMilestone(selectedMilestone.id);
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
  let approveLabel = "CONNECT WALLET";
  let releaseLabel = "CONNECT WALLET";
  if (walletAddress && isSponsor) {
    if (selectedMilestone?.status === "PAID") {
      approveLabel = "ALREADY PAID";
      releaseLabel = "ALREADY PAID";
    } else {
      approveLabel = approving ? "APPROVING..." : "APPROVE MILESTONE";
      releaseLabel = releasing ? "RELEASING..." : "RELEASE FUNDS";
    }
  } else if (walletAddress && !isSponsor) {
    approveLabel = "SPONSOR ONLY";
    releaseLabel = "SPONSOR ONLY";
  }

  const badge = selectedMilestone ? statusBadge[selectedMilestone.status] : statusBadge.PENDING;

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
        {/* Milestone selector */}
        <div className="flex flex-col gap-2">
          <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
            SELECT MILESTONE
          </span>
          <select
            value={selectedId}
            onChange={(e) => selectMilestone(Number(e.target.value))}
            className="w-full h-[40px] px-3 bg-[#1A1A1A] border border-[#333333] text-[#F5F5F0] font-ibm-mono text-[11px] tracking-[1px] outline-none focus:border-[#FFD600] transition-colors cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%23888' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            {milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} — {m.amount.toFixed(2)} ALGO — {m.status}
              </option>
            ))}
          </select>
        </div>

        {/* Selected milestone info */}
        {selectedMilestone && (
          <div className="flex flex-col gap-2 px-4 py-3 bg-[#111111] border border-[#1D1D1D]">
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
                MILESTONE
              </span>
              <span className="font-grotesk text-[12px] font-bold text-[#F5F5F0]">
                {selectedMilestone.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
                AMOUNT
              </span>
              <span className="font-ibm-mono text-[11px] text-[#FFD600] font-bold tracking-[1px]">
                {selectedMilestone.amount.toFixed(2)} ALGO
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
                STATUS
              </span>
              <div className={`flex items-center gap-2 h-[20px] px-2 ${badge.bg} border ${badge.border}`}>
                <span className={`w-[4px] h-[4px] rounded-full ${badge.dot}`} />
                <span className={`font-ibm-mono text-[8px] font-bold tracking-[1.5px] ${badge.text}`}>
                  {selectedMilestone.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApprove}
            disabled={!canApprove}
            className="flex items-center justify-center flex-1 h-[48px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[2px]">
              {approveLabel}
            </span>
          </button>
          <button
            onClick={handleRelease}
            disabled={!canRelease}
            className="flex items-center justify-center flex-1 h-[48px] bg-[#0A0A0A] border-2 border-[#4ADE80] hover:border-[#6EE7A0] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
