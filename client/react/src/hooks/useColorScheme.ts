import {useEffect, useState} from "react";

const prefersDarkMode = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * Produces the user's preferred color scheme.
 */
const useColorScheme = () => {

    const [colorScheme, setColorScheme] = useState<"light" | "dark">(
        prefersDarkMode() ? "dark" : "light"
    );

    useEffect(() => {

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => {
            setColorScheme(event.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);

    }, []);

    return colorScheme;

};

export default useColorScheme;
