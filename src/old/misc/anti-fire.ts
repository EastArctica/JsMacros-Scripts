JsMacros.assertEvent(event, 'Service');

let player = Player.getPlayer();

function isBedMining() {
    // Check if we're in the nether around level 15
    return World.getDimension()?.toString() == 'minecraft:the_nether' && player.getY() < 20;
}

const blockUpdateListener = JsMacros.on(
    'BlockUpdate',
    JavaWrapper.methodToJava((blockUpdate) => {
        if (!isBedMining()) return;

        let blockPos = blockUpdate.block.getBlockPos();
        if (blockUpdate.block.getId() == 'minecraft:fire' && blockPos.distanceTo(player) < Player.getReach()) {
            player.attack(blockPos.getX(), blockPos.getY(), blockPos.getZ(), 0);
        }
    })
);

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_) => {
        if (!isBedMining()) return;

        let scanner = World.getWorldScanner()
            .withBlockFilter('getId')
            .is('EQUALS', 'minecraft:fire')
            .build()
            .scanReachable();

        for (const { x, y, z } of scanner) {
            player.attack(x, y, z, 0);
        }
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(blockUpdateListener);
    JsMacros.off(tickListener);
});

export default event;
