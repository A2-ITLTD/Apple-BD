"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  refreshUser: () => {},
  loading: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.applebd.com";
  // Dedupe concurrent calls (e.g. StrictMode's double mount-effect) so auth is
  // fetched once and `loading` only flips through a single cycle — otherwise the
  // spinner flashes 2-3 times on entry.
  const inflight = useRef(null);

  // Stable identity: several components depend on `refreshUser` in their effect
  // deps (e.g. `[user, refreshUser]`). If it were recreated every render those
  // effects would re-fire on every render and hammer /api/auth/me into a 429
  // loop (spinner flicker). useCallback keeps the reference constant.
  const refreshUser = useCallback(async ({ force = false } = {}) => {
    // A login can complete while the initial /me request (started on app mount)
    // is still in flight. Reusing that older result would report `null` even
    // though the login response has just set the admin cookie.
    if (inflight.current) {
      if (!force) return inflight.current;
      await inflight.current;
    }
    const run = (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${API}/api/auth/me`, { credentials: "include" });
        const data = await r.json();
        setUser(data.user || null);
        return data.user || null;
      } catch (err) {
        setUser(null);
        return null;
      } finally {
        setLoading(false);
        inflight.current = null;
      }
    })();
    inflight.current = run;
    return run;
  }, [API]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
