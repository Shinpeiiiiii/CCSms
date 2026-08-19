import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'auth-storage';
const AUTH_BROADCAST_CHANNEL = 'auth-sync';

const useAuthStore = create(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,

            login: (data) => {
                set({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: data.user,
                });

                // Notify other tabs about the login via BroadcastChannel
                try {
                    const bc = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
                    bc.postMessage({ type: 'AUTH_CHANGE' });
                    bc.close();
                } catch (_) {
                    // BroadcastChannel not supported, storage event will still work
                }
            },

            logout: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                });

                useAuthStore.persist.clearStorage(); // Clear persisted state
                // Notify other tabs about the logout via BroadcastChannel
                try {
                    const bc = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
                    bc.postMessage({ type: 'AUTH_CHANGE' });
                    bc.close();
                } catch (_) {
                    // BroadcastChannel not supported, storage event will still work
                }
            },
        }),
        {
            name: AUTH_STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);

/*
=============================================================
Cross-Tab Auth Synchronization

Zustand's persist middleware does NOT sync state across tabs.
Each tab loads persisted state on mount, then works from its
own in-memory copy. When another tab writes to localStorage,
this tab's Zustand state becomes stale.

We fix this with two complementary mechanisms:

1. 'storage' event — fires in OTHER tabs when localStorage
   is modified. Covers most cases (login/logout in Tab A
   automatically updates Tab B).

2. BroadcastChannel — explicitly notifies OTHER tabs. This
   is a belt-and-suspenders approach for edge cases where
   the storage event may not fire reliably.
=============================================================
*/

// Helper: read persisted auth state from localStorage
const readPersistedAuth = () => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return { accessToken: null, refreshToken: null, user: null };

        const parsed = JSON.parse(raw);
        // Zustand persist stores data under a "state" key
        return {
            accessToken: parsed?.state?.accessToken ?? null,
            user: parsed?.state?.user ?? null,
        };
    } catch (_) {
        return { accessToken: null, refreshToken: null ,user: null };
    }
};

// Sync Zustand state from what's currently in localStorage
const syncFromStorage = () => {
    const persisted = readPersistedAuth();
    const current = useAuthStore.getState();

    // Only update if the auth identity actually changed
    const persistedToken = persisted.accessToken;
    const currentToken = current.accessToken;

    if (persistedToken !== currentToken) {
        if (persistedToken === null) {
            // Another tab logged out → log out this tab too
            useAuthStore.setState({ accessToken: null, refreshToken: null ,user: null });
        } else {
            // Another tab logged in (or switched accounts)
            useAuthStore.setState({
                accessToken: persisted.accessToken,
                refreshToken: persisted.refreshToken,
                user: persisted.user,
            });
        }
    }
};

// 1. Listen for 'storage' events (fires in OTHER tabs)
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === AUTH_STORAGE_KEY) {
            syncFromStorage();
        }
    });

    // 2. Listen for BroadcastChannel messages (fires in OTHER tabs)
    try {
        const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
        channel.addEventListener('message', (event) => {
            if (event.data?.type === 'AUTH_CHANGE') {
                syncFromStorage();
            }
        });
    } catch (_) {
        // BroadcastChannel not supported — storage event alone is sufficient
    }
}

export default useAuthStore;