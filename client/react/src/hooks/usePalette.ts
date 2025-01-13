import useColorScheme from "@/hooks/useColorScheme.ts";

/**
 * Options for the color palette passed to {@link usePalette}.
 *
 * Each key is a color name, and each value is a tuple of two colors: the light color and the
 * dark color, respectively.
 */
interface PaletteOpts {
    [key: string]: [string, string];
}

/**
 * A color palette resolved by {@link usePalette}.
 */
interface Palette {
    [key: string]: string;
}

/**
 * Returns the appropriate color palette based on the current color scheme.
 * @param palette The color palette options.
 */
export default function usePalette(palette: PaletteOpts): Palette {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    return Object.entries(palette).reduce((acc: Palette, [key, [light, dark]]) => {
        acc[key] = isDark ? dark : light;
        return acc;
    }, {});
}
