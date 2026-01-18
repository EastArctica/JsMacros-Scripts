JsMacros.assertEvent(event, 'Service');

function isBedMining(
    player: Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.ClientPlayerEntityHelper = Player.getPlayer()
) {
    // Check if we're in the nether around level 15
    return World.getDimension()?.toString() == 'minecraft:the_nether' && player.getY() < 20;
}

const blockUpdateListener = JsMacros.on(
    'BlockUpdate',
    JavaWrapper.methodToJava((blockUpdate) => {
        const player = Player.getPlayer();
        if (!isBedMining(player)) return;

        const interactionManager = Player.getInteractionManager();
        const blockPos = blockUpdate.block.getBlockPos();
        if (blockUpdate.block.getId() == 'minecraft:fire' && blockPos.distanceTo(player) < Player.getReach()) {
            interactionManager.attack(blockPos.getX(), blockPos.getY(), blockPos.getZ(), 0);
        }
    })
);

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_) => {
        const player = Player.getPlayer();
        if (!isBedMining(player)) return;

        const interactionManager = Player.getInteractionManager();
        const scanner = World.getWorldScanner()
            .withBlockFilter('getId')
            .is('EQUALS', 'minecraft:fire')
            .build()
            .scanReachable();
        for (const { x, y, z } of scanner) {
            interactionManager.attack(x, y, z, 0);
        }
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(blockUpdateListener);
    JsMacros.off(tickListener);
});

export default event;
