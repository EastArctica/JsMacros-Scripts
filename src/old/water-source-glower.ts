JsMacros.assertEvent(event, 'Service');
let player = Player.getPlayer();

let ticks = 0;
const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    if (ticks++ % 5 != 0) {
        return;
    }

    let scanner = World.getWorldScanner()
        .withBlockFilter('getId').is('EQUALS', 'minecraft:water')
        .build()
        .scanSphereArea(player.getPos(), 10);

    for (const pos of scanner) {
        const block = World.getBlock(pos);
        if (block.getBlockStateHelper().getFluidState().isStill()) {
            Chat.log(`Glowing water at ${pos.x}, ${pos.y}, ${pos.z}`);
            Chat.say(`/cglow block ${pos.x} ${pos.y} ${pos.z} 1 color green`);
        }
    }
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(tickListener);
});

export default event;
