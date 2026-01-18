JsMacros.assertEvent(event, 'Service');
let player = Player.getPlayer();

const blockUpdateListener = JsMacros.on(
    'BlockUpdate',
    JavaWrapper.methodToJava((blockUpdate) => {
        let blockPos = blockUpdate.block.getBlockPos();
        if (
            (blockUpdate.block.getId() == 'minecraft:kelp' || blockUpdate.block.getId() == 'minecraft:kelp_plant') &&
            blockPos.distanceTo(player) < Player.getReach()
        ) {
            player.attack(blockPos.getX(), blockPos.getY(), blockPos.getZ(), 0);
        }
    })
);
const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_) => {
        let scanner = World.getWorldScanner()
            .withBlockFilter('getId')
            .is('EQUALS', 'minecraft:kelp')
            .orBlockFilter('getId')
            .is('EQUALS', 'minecraft:kelp_plant')
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
