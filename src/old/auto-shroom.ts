JsMacros.assertEvent(event, 'Service');
let player = Player.getPlayer();
const interactionManager = Player.getInteractionManager();

const blockUpdateListener = JsMacros.on('BlockUpdate', JavaWrapper.methodToJava((blockUpdate) => {
    let blockPos = blockUpdate.block.getBlockPos();
    if ((blockUpdate.block.getId() == 'minecraft:mushroom_stem' ||
        blockUpdate.block.getId() == 'minecraft:brown_mushroom_block' ||
        blockUpdate.block.getId() == 'minecraft:red_mushroom_block') &&
        blockPos.distanceTo(player) < Player.getReach()) {
        Chat.log(`Breaking ${blockUpdate.block.getId()} at ` + blockPos.getX() + ', ' + blockPos.getY() + ', ' + blockPos.getZ());
        interactionManager.breakBlock(blockPos.getX(), blockPos.getY(), blockPos.getZ());
    }
}));

const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    let scanner = World.getWorldScanner()
        .withBlockFilter('getId').is('EQUALS', 'minecraft:mushroom_stem')
        .orBlockFilter('getId').is('EQUALS', 'minecraft:brown_mushroom_block')
        .orBlockFilter('getId').is('EQUALS', 'minecraft:red_mushroom_block')
        .build()
        .scanReachable();

    for (const block of scanner) {
        Chat.log(`Breaking ${World.getBlock(block).getId()} at ` + block.x + ', ' + block.y + ', ' + block.z);
        interactionManager.breakBlock(block.x, block.y, block.z);
    }
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(blockUpdateListener);
    JsMacros.off(tickListener);
});

export default event;
