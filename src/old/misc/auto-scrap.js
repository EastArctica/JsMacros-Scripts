let player = Player.getPlayer();
Client.runOnMainThread(JavaWrapper.methodToJava(() => {}));
for (let i = 0; i < 10000; i++) {
    let tablePos = World.getWorldScanner()
        .withBlockFilter('getId')
        .is('EQUALS', 'minecraft:crafting_table')
        .build()
        .scanClosestReachable();
    if (tablePos == null) {
        throw new Error('No crafting table found nearby');
    }
    let stellarCorePos = World.getWorldScanner()
        .withBlockFilter('getId')
        .is('EQUALS', 'minecraft:blast_furnace')
        .build()
        .scanClosestReachable();
    if (stellarCorePos == null) {
        throw new Error('No blast furnace (stellar core) found nearby');
    }

    // Sometimes we magically have iron boots in our inventory already, so we can skip crafting them
    let inv = Player.openInventory();
    if (inv.getItemCount().get('minecraft:iron_boots') == null) {
        // Open crafting table
        player.interactBlock(tablePos.x, tablePos.y, tablePos.z, 0, false);
        inv = Player.openInventory();
        while (!inv.is('Crafting Table')) {
            Time.sleep(10);
            inv = Player.openInventory();
        }
        // Wait for our inventory to have iron in it
        while (inv.getItemCount().get('minecraft:iron_ingot') < 4) {
            Time.sleep(10);
        }
        Time.sleep(100);
        inv.getCraftableRecipes()
            .find((r) => r.getOutput().getName().getString() == 'Iron Boots')
            .craft(true);

        // Take item from output
        inv.quick(0);
        inv.close();
    }

    // Open blast furnace
    player.interactBlock(stellarCorePos.x, stellarCorePos.y, stellarCorePos.z, 0, false);
    inv = Player.openInventory();
    while (inv.getContainerTitle() !== 'Stellar Core') {
        Time.sleep(10);
        inv = Player.openInventory();
    }

    var inventoryMap = inv.getMap();
    for (const key in inventoryMap) {
        const slots = inventoryMap[key];
        for (const slot of slots) {
            if (inv.getSlot(slot).getName().getString() == 'Iron Boots') {
                inv.quickAll(slot);

                // Wait for the center stellar core slot to be empty
                while (inv.getSlot(4).getCount() > 0) {
                    // Drop item on ground if it's not iron boots, sometimes the game bugs out and scraps into that slot
                    if (inv.getSlot(4).getName().getString() == 'Iron Ingot') {
                        Client.runOnMainThread(
                            JavaWrapper.methodToJava(() => {
                                inv.dropSlot(4, true);
                            })
                        );
                        Client.waitTick(1);
                    }
                    Time.sleep(5);
                }
            }
        }
    }
    inv.close();

    // Give the game a little bit of time to process the items
    Time.sleep(100);
}

export default event;
