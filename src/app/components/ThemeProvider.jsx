"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light"); // Light mode default
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check localStorage only - default to light
        const stored = localStorage.getItem("drift-theme");
        if (stored) {
            setTheme(stored);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            // Set data-theme for our custom CSS
            document.documentElement.setAttribute("data-theme", theme);

            // Also toggle .dark class for shadcn/ui compatibility
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            localStorage.setItem("drift-theme", theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
