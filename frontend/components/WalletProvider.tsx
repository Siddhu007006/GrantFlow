"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    type ReactNode,
} from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { SPONSOR_ADDRESS } from "@/lib/constants";

type PeraWallet = InstanceType<typeof PeraWalletConnect>;

interface WalletContextType {
    walletAddress: string | null;
    isConnecting: boolean;
    isSponsor: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    resetConnection: () => Promise<void>;
    peraWallet: PeraWallet | null;
    activeRole: "sponsor" | "student";
    setActiveRole: (role: "sponsor" | "student") => void;
}

const WalletContext = createContext<WalletContextType>({
    walletAddress: null,
    isConnecting: false,
    isSponsor: false,
    connectWallet: async () => { },
    disconnectWallet: () => { },
    resetConnection: async () => { },
    peraWallet: null,
    activeRole: "sponsor",
    setActiveRole: () => { },
});

export function useWallet() {
    return useContext(WalletContext);
}

function createPeraWallet() {
    return new PeraWalletConnect({
        chainId: 416002,
        shouldShowSignTxnToast: true,
    });
}

export function WalletProvider({ children }: { children: ReactNode }) {
    const storageKey = "grantflow_wallet";
    const [activeRole, setActiveRoleState] = useState<"sponsor" | "student">("sponsor");

    // Persist role across reloads
    useEffect(() => {
        const savedRole = localStorage.getItem("grantflow_role") as "sponsor" | "student";
        if (savedRole) {
            setActiveRoleState(savedRole);
        }
    }, []);

    const setActiveRole = useCallback((role: "sponsor" | "student") => {
        setActiveRoleState(role);
        localStorage.setItem("grantflow_role", role);
    }, []);

    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const peraRef = useRef<PeraWallet | null>(null);
    const [peraState, setPeraState] = useState<PeraWallet | null>(null);

    const isSponsor = walletAddress === SPONSOR_ADDRESS;

    // We maintain a pseudo-separation using localStorage so reloading respects the page
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setWalletAddress(saved);
        }
    }, [storageKey]);

    // Create and set pera instance
    const initPera = useCallback(() => {
        const pw = createPeraWallet();
        peraRef.current = pw;
        setPeraState(pw);
        return pw;
    }, []);

    useEffect(() => {
        const pw = initPera();
        pw
            .reconnectSession()
            .then((accounts) => {
                if (accounts.length > 0) {
                    // Only apply session if it matches our saved separated state to prevent cross-bleeding
                    const saved = localStorage.getItem(storageKey);
                    if (saved === accounts[0] || !saved) {
                        setWalletAddress(accounts[0]);
                        localStorage.setItem(storageKey, accounts[0]);
                    } else if (saved !== accounts[0]) {
                        // Allow taking over explicitly if reconnecting a new wallet
                        setWalletAddress(accounts[0]);
                        localStorage.setItem(storageKey, accounts[0]);
                    }
                }
            })
            .catch(() => { });
    }, [initPera, storageKey]);

    const connectWallet = useCallback(async () => {
        let pw = peraRef.current;
        if (!pw) pw = initPera();
        setIsConnecting(true);
        try {
            const accounts = await pw.connect();
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                localStorage.setItem(storageKey, accounts[0]);
            }
        } catch (error: any) {
            if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                console.error("Wallet connect error:", error);
            }
        } finally {
            setIsConnecting(false);
        }
    }, [initPera, storageKey]);

    const disconnectWallet = useCallback(() => {
        try {
            peraRef.current?.disconnect();
        } catch (e) {
            // ignore disconnect errors
        }
        setWalletAddress(null);
        localStorage.removeItem(storageKey);
    }, [storageKey]);

    // Reset: destroy old instance, create fresh one, reconnect
    const resetConnection = useCallback(async () => {
        console.log("[Wallet] Resetting Pera connection...");
        try {
            peraRef.current?.disconnect();
        } catch (e) {
            // ignore
        }
        // Create a completely fresh instance to clear any pending state
        const pw = initPera();
        // Try to reconnect if there's a session
        try {
            const accounts = await pw.reconnectSession();
            if (accounts.length > 0) {
                const saved = localStorage.getItem(storageKey);
                if (saved === accounts[0] || !saved) {
                    setWalletAddress(accounts[0]);
                    localStorage.setItem(storageKey, accounts[0]);
                    console.log("[Wallet] Reconnected:", accounts[0]);
                } else if (saved !== accounts[0]) {
                    setWalletAddress(accounts[0]);
                    localStorage.setItem(storageKey, accounts[0]);
                }
            }
        } catch (e) {
            console.log("[Wallet] No existing session after reset");
        }
    }, [initPera, storageKey]);

    return (
        <WalletContext.Provider
            value={{
                walletAddress,
                isConnecting,
                isSponsor,
                connectWallet,
                disconnectWallet,
                resetConnection,
                peraWallet: peraState,
                activeRole,
                setActiveRole,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
