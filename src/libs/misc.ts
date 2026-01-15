const inv = Player.openInventory;
const activeScreen = Hud.getOpenScreen;

export function isInventoryFull() {
    return inv().findFreeInventorySlot() === -1;
}

/**
 * @returns {string} The active JsMacros version, or "Unknown" if it cannot be determined. Eg '2.0.0'
 */
export function getJsMacrosVersion(): string {
    // Fabric
    try {
        // @ts-expect-error Missing fabricmc types
        const fabricLoader = Packages.net.fabricmc.loader.api.FabricLoader.getInstance();
        return fabricLoader
            .getModContainer('jsmacros')
            .or(() => fabricLoader.getModContainer('jsmacrosce'))
            .map((container) => container.getMetadata().getVersion().getFriendlyString())
            .orElse('Unknown Fabric');
    } catch (_e) {}

    // Forge
    try {
        // @ts-expect-error Missing forge types
        const ModList = Packages.net.minecraftforge.fml.ModList;
        return ModList.get()
            .getModContainerById('jsmacros')
            .or(() => ModList.getModContainerById('jsmacrosce'))
            .map((container) => container.getModInfo().getVersion().toString())
            .orElse('Unknown Forge');
    } catch (_e) {}

    return 'Unknown';
}

export function getActiveScreenTitle(): string | null {
    if (getJsMacrosVersion().startsWith('2.')) {
        return activeScreen()?.getTitleText()?.getString() ?? null;
    } else {
        return (activeScreen()?.getTitleText() as unknown as string) ?? null;
    }
}
