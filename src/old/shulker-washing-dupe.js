const cauldronScanner = World.getWorldScanner().withStringBlockFilter().contains('cauldron').build();
const waterScanner = World.getWorldScanner().withStringBlockFilter().contains('water').build();

function dupe() {
    const inventory = Player.openInventory();

    const bucketSlot = inventory.findItem('minecraft:water_bucket')?.[0] || inventory.findItem('minecraft:bucket')?.[0];
    // Chat.log(bucketSlot);

    const hotbarBucketSlot =
        bucketSlot < 36 || bucketSlot > 44 ? inventory.findFreeHotbarSlot() - 36 || 0 : bucketSlot - 36;
    // Move if item is not in hotbar
    if (bucketSlot < 36 || bucketSlot > 44) {
        inventory.swapHotbar(bucketSlot, hotbarBucketSlot);
    }

    // Ensure player is holding shulkers to be duped
    let heldItem = inventory.getSlot(36 + inventory.getSelectedHotbarSlotIndex());
    if (
        !heldItem.getItemID().includes('shulker_box') ||
        heldItem.getItemID() == 'minecraft:shulker_box' ||
        heldItem.getCount() == 1
    ) {
        Chat.log('You must be holding 2 or more dyed shulkers to dupe');
        return;
    }

    // Save current hotbar slot
    const originalHotbarSlot = inventory.getSelectedHotbarSlotIndex();

    // Find the closest cauldron
    const cauldronPos = cauldronScanner.scanReachable()[0];
    if (!cauldronPos) {
        Chat.log('No cauldron found');
        return;
    }

    // const waterPos = waterScanner.scanReachable()[0];
    // if (!waterPos) {
    //     Chat.log('No water found');
    //     return;
    // }

    // Ensure cauldron has water
    let cauldronLevel = World.getBlock(cauldronPos)?.getBlockState()?.level || 0;
    if (cauldronLevel < 1) {
        inventory.setSelectedHotbarSlotIndex(hotbarBucketSlot);
        // If player is holding empty bucket, fill it with water
        heldItem = inventory.getSlot(36 + inventory.getSelectedHotbarSlotIndex());
        Player.getPlayer().interactItem(false); // Fixes ghost buckets sometimes
        if (heldItem.getItemID() == 'minecraft:bucket') {
            // Player.getPlayer().lookAt(713, 62, -3829)
            Player.getPlayer().interactItem(false);
        }

        // Fill cauldron
        Player.getPlayer().interactBlock(cauldronPos.x, cauldronPos.y, cauldronPos.z, 0, false);
        cauldronLevel = 3;
    }
    Client.waitTick(1);

    // Swap back to shulker boxes and dupe
    inventory.setSelectedHotbarSlotIndex(originalHotbarSlot);
    for (let i = 0; i < cauldronLevel; i++) {
        Player.getPlayer().interactBlock(cauldronPos.x, cauldronPos.y, cauldronPos.z, 0, false);
    }
}

for (let i = 0; i < 10; i++) dupe();
