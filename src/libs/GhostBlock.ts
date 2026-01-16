export const reg = Client.getRegistryManager();

/**
 * @param {BlockPosHelper} pos
 * @param {BlockStateHelper | CanOmitNamespace<BlockId>} state
 */
export function setGhost(pos: BlockPosHelper, state: BlockStateHelper | CanOmitNamespace<BlockId>) {
    if (typeof state === 'string') state = reg.getBlockState(state);
    return setGhostRaw(pos.getRaw(), state.getRaw());
}

/**
 * @param {BlockPosHelper} pos
 * @param {{}} state BlockState
 */
export function setGhostRawState(pos: BlockPosHelper, state: any) {
    return setGhostRaw(pos.getRaw(), state);
}

/**
 * @param {{}} pos BlockPos
 * @param {{}} state BlockState
 */
export function setGhostRaw(pos: any, state: any) {
    if (World.isWorldLoaded()) {
        Client.runOnMainThread(JavaWrapper.methodToJava(() => setGhostRawOnThread(pos, state)));
    }
}

/**
 * @param {{}} pos BlockPos
 * @param {{}} state BlockState
 */
export function setGhostRawOnThread(pos: any, state: any) {
    const world = World.getRaw();
    if (!world?.method_22340(pos) || !world.method_24794(pos)) return false; // .isPosLoaded() .isInBuildLimit()
    return world.method_8652(pos, state, 18); // .setBlockState
}
