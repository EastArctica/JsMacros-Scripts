JsMacros.assertEvent(event, 'Service');

const Y = 135;
const START_X = 812;
const START_Z = -372;
const END_X = 1092;
const END_Z = -91;

function getHeldItem() {
    const inventory = Player.openInventory();
    return inventory.getSlot(inventory.getMap().hotbar[inventory.getSelectedHotbarSlotIndex()]);
}

function hasItem(item: ItemId) {
    const inventory = Player.openInventory();
    return inventory.findItem(item)[0] != -1;
}

const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
    const reach = Player.getReach();
    const player = Player.getPlayer();
    const inventory = Player.openInventory();
    const interactionManager = Player.getInteractionManager();

    // Check if the user is holding a piston
    if (!hasItem('minecraft:piston')) return;

    // Place pistons facing downwards in all blocks within reach between start and end
    for (let x = START_X; x <= END_X; x++) {
        for (let z = START_Z; z <= END_Z; z++) {
            if (player.distanceTo(x, Y, z) > reach) continue;

            const block = World.getBlock(x, Y, z);
            if (block.getId() == 'minecraft:air') {
                // Check if we have pistons and are holding one
                if (getHeldItem().getItemId() != 'minecraft:piston') {
                    const pistonSlot = inventory.findItem('minecraft:piston');
                    if (!pistonSlot[0]) {
                        return;
                    };

                    const currentHotbarSlot = inventory.getSelectedHotbarSlotIndex();
                    inventory.swapHotbar(pistonSlot[0], currentHotbarSlot as HotbarSlot);
                };

                // Check if the player is looking upwards
                const direction = player.getPitch();
                if (direction < -100 || direction > -80) {
                    continue;
                }

                interactionManager.interactBlock(x, Y, z, 'down', false);
            }
        }
    }
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(tickListener);
});