import { useState, useEffect } from "react";

export function useSharedState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(initialValue);

    // Read from localStorage on mount (client-side only) to prevent hydration mismatches
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setState(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
    }, [key]);

    // Update state and localStorage
    const setSharedState = (newValue: T | ((prev: T) => T)) => {
        setState((prev) => {
            const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
            try {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
            return valueToStore;
        });
    };

    // Listen to changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setState(JSON.parse(e.newValue));
                } catch (error) {
                    console.warn(`Error parsing storage event for key "${key}":`, error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return [state, setSharedState] as const;
}
