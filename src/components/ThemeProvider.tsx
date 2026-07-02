"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

/**
 * Resolve the initial theme on the client.
 * Order of precedence:
 *   1. localStorage value ("light" | "dark")
 *   2. system preference via matchMedia
 *   3. fallback to "light"
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (private mode, etc.) — ignore
  }

  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

/**
 * Apply a theme to <html> by toggling the `.dark` class.
 * The `.dark` class is what the CSS in globals.css keys off of.
 */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to "light" for SSR; sync with the real value on mount.
  const [theme, setThemeState] = useState<Theme>("light");

  // On mount, read the real theme (localStorage / system preference)
  // and sync the <html> class with whatever the FOUC-prevention script
  // already applied.
  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore write failures
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Graceful fallback so components rendered outside the provider
    // (e.g. during isolated testing) don't crash.
    return {
      theme: "light",
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
}
