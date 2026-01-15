export function interpolateColor(from: number, to: number, ratio: number): number {
    // Ensure ratio is between 0 and 1
    ratio = Math.max(0, Math.min(1, ratio));

    // Extract RGB components from the colors
    const r1 = (from >> 16) & 0xFF;
    const g1 = (from >> 8) & 0xFF;
    const b1 = from & 0xFF;

    const r2 = (to >> 16) & 0xFF;
    const g2 = (to >> 8) & 0xFF;
    const b2 = to & 0xFF;

    // Interpolate each color component
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    // Combine the components back into a single color value
    return (r << 16) | (g << 8) | b;
}
