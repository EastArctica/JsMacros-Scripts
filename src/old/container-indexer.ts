JsMacros.assertEvent(event, 'Service');
let player = Player.getPlayer();
const interactionManager = Player.getInteractionManager();

const lastUpdated = new Map();

const blockUpdateListener = JsMacros.on('BlockUpdate', JavaWrapper.methodToJava((blockUpdate) => {
    return;
    let blockPos = blockUpdate.block.getBlockPos();
    let posStr = `${blockPos.getX()},${blockPos.getY()},${blockPos.getZ()}`;
    let isShulker = blockUpdate.block.getBlock().getTags().includes('minecraft:shulker_boxes');
    let isChest = blockUpdate.block.getId() == 'minecraft:chest' || blockUpdate.block.getId() == 'minecraft:trapped_chest';
    if (!isShulker && !isChest) {
        return;
    }

    if (lastUpdated.has(posStr) && Date.now() - lastUpdated.get(posStr) < 1000 * 60) {
        Chat.log(`Skipping ${blockUpdate.block.getId()} at ` + blockPos.getX() + ', ' + blockPos.getY() + ', ' + blockPos.getZ());
        return;
    }

    lastUpdated.set(posStr, Date.now());
    // Open shulker box or chest

    if (blockPos.distanceTo(player) < 31.5) {
        Chat.log(`Opening ${blockUpdate.block.getId()} at ` + blockPos.getX() + ', ' + blockPos.getY() + ', ' + blockPos.getZ());
        interactionManager.interactBlock(blockPos.getX(), blockPos.getY(), blockPos.getZ(), 0, false);
        // TODO: Only close the last one
        Hud.getOpenScreen()?.close();
    }
}));

const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    let scanner = World.getWorldScanner(JavaWrapper.methodToJava((blockHelper: BlockHelper) => {
        let id = blockHelper.getId();
        let tags = blockHelper.getTags();
        // Check if the item is a pushable by a piston
        return tags.includes('minecraft:shulker_boxes') || tags.includes('c:chests') || tags.includes('c:barrels') || id == 'minecraft:furnace';
    }), JavaWrapper.methodToJava(() => true))
        .scanReachable();
    
    for (let pos of scanner) {
        const block = World.getBlock(pos);
        const blockPos = block.getBlockPos();
        let posStr = `${blockPos.getX()},${blockPos.getY()},${blockPos.getZ()}`;
        
        if (lastUpdated.has(posStr) && Date.now() - lastUpdated.get(posStr) < 1000 * 60 * 24 * 30) {
            continue;
        }
    
        lastUpdated.set(posStr, Date.now());
        // Open shulker box or chest
    
        if (block.getBlockPos().distanceTo(player) < 31.5) {
            player.lookAt(block.getBlockPos().getX(), block.getBlockPos().getY(), block.getBlockPos().getZ());
            interactionManager.interactBlock(blockPos.getX(), blockPos.getY(), blockPos.getZ(), 0, false);
            JsMacros.waitForEvent('ContainerUpdate')
            let inv = Player.openInventory();
            inv.close();
        }
    }
}));

// const invListener = JsMacros.on('ContainerUpdate', JavaWrapper.methodToJava((inv) => {
//     Chat.log('Container updated');
// }));


event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(blockUpdateListener);
    JsMacros.off(tickListener);
});

export default event;
