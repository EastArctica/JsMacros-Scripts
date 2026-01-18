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

/**
 * Determines whether or not the Minecraft world has been properly initialized.
 *
 * TODO: isClientInitialized isn't the best name for this function as the client
 * is always initialized, but the world and player may not be.
 *
 * @returns Whether or not the world has been properly initialized
 */
export function isClientInitialized(): boolean {
    try {
        const player = Player.getPlayer();
        if (!player) return false;

        // Check if we can get world data
        const dimension = World.getDimension();
        if (!dimension) return false;
    } catch (_) {
        return false;
    }

    return true;
}

export function shortNumber(num: number): string {
    num = Math.floor(num);

    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return num.toString();
}

export function distToMetric(pos: BlockPosHelper): string {
    const playerPos = Player.getPlayer().getBlockPos();
    const dx = pos.getX() - playerPos.getX();
    const dy = pos.getY() - playerPos.getY();
    const dz = pos.getZ() - playerPos.getZ();
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return `${shortNumber(distance)}m`;
}
