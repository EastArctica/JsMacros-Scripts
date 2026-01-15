JsMacros.assertEvent(event, 'Service');

const blocks = [
    [1686, 65, -2224],
    [1687, 65, -2224],
    [1688, 65, -2224],
    [1689, 65, -2224]
];

const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    const player = Player.getPlayer();
    const interactionManager = Player.getInteractionManager();
    if (!player || !interactionManager || !World.isWorldLoaded()) return;

    for (const pos of blocks) {
        if (World.getBlock(pos[0], pos[1], pos[2]).getId() == 'minecraft:air') {
            // get offhand item
            const offhandSlots = Player.openInventory().getMap().offhand;
            if (!offhandSlots || !offhandSlots[0]) {
                Chat.actionbar('Offhand slot dead');
                return;
            }

            const offhandItem = Player.openInventory().getSlot(offhandSlots[0]);
            if (offhandItem.getItemId() != 'minecraft:coarse_dirt' || offhandItem.getCount() < 5) {
                // Move dirt from inventory to offhand
                const dirtSlots = Player.openInventory().findItem('minecraft:coarse_dirt');
                if (!dirtSlots || dirtSlots.length < 2) {
                    Chat.actionbar('No dirt found in inventory');
                    return;
                }
                const dirtSlot = dirtSlots[0] == offhandSlots[0] ? dirtSlots[1] : dirtSlots[0];
                Player.openInventory().swap(dirtSlot, offhandSlots[0]);
            }

            // Place dirt
            interactionManager.interactBlock(pos[0], pos[1] - 1, pos[2], "up", true);

            // Check durability of main hand
            const mainHandSlot = Player.openInventory().getMap().hotbar[Player.openInventory().getSelectedHotbarSlotIndex()];
                if (!mainHandSlot) {
                Chat.actionbar('Main hand slot dead');
                return;
            }

            const mainHandItem = Player.openInventory().getSlot(mainHandSlot);
            if (mainHandItem.getDurability() < 25) {
                Chat.actionbar('Low durability');
                // Look for another item to use
                const toolSlots = Player.openInventory().findItem(mainHandItem.getItemId()).filter(slot => slot != mainHandSlot);
                for (const slot of toolSlots) {
                    const item = Player.openInventory().getSlot(slot);
                    if (item.getDurability() > 25) {
                        Player.openInventory().swap(slot, mainHandSlot);
                        break;
                    }
                }
                
                if (Player.openInventory().getSlot(mainHandSlot).getDurability() < 25) {
                    Chat.actionbar('No tools with durability');
                    return;
                }
            }

            // Till dirt
            interactionManager.interactBlock(pos[0], pos[1], pos[2], "up", false);
        }
    }
    Client.waitTick(1);
}));

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off(tickListener);
});

export default event;
