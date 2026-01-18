JsMacros.assertEvent(event, 'Service');

let player = Player.getPlayer();

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_) => {
        let scanner = World.getWorldScanner()
            .withBlockFilter('getId')
            .is('EQUALS', 'minecraft:grass')
            .orBlockFilter('getId')
            .is('EQUALS', 'minecraft:tall_grass')
            .orBlockFilter('getId')
            .is('EQUALS', 'minecraft:fern')
            .orBlockFilter('getId')
            .is('EQUALS', 'minecraft:large_fern')
            .orBlockFilter('getId')
            .is('EQUALS', 'minecraft:short_grass')
            .build()
            .scanReachable();

        for (const { x, y, z } of scanner) {
            player.attack(x, y, z, 0);
        }
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(tickListener);
});

export default event;
