JsMacros.assertEvent(event, "Service");


JsMacros.on("BlockUpdate", JavaWrapper.methodToJava((event) => {
    //Give "STATE" on placing & breaking
    if (event.updateType == 'STATE' && event.block.getId() == 'minecraft:air') {
        // Check for lava in all directions around the block
        let blockPos = event.block.getBlockPos();
        let x = blockPos.getX();
        let y = blockPos.getY();
        let z = blockPos.getZ();

        // Define the positions to check
        let positions = [
            { x: x, y: y + 1, z: z }, // above
            { x: x, y: y - 1, z: z }, // below
            { x: x + 1, y: y, z: z }, // east
            { x: x - 1, y: y, z: z }, // west
            { x: x, y: y, z: z + 1 }, // south
            { x: x, y: y, z: z - 1 }  // north
        ];

        // Check each position for lava
        positions.forEach(pos => {
            let block = World.getBlock(pos.x, pos.y, pos.z);
            if (!block) {
                return;
            }

            // Check if the block is within our range
            if (block.getBlockPos().distanceTo(Player.getPlayer()) > Player.getReach()) {
                return;
            }

            if (block.getId() == 'minecraft:lava') {
                // Place a block to remove the lava
                // Ensure the player has an instant mine block in their offhand
                let offhand = Player.getPlayer().getOffHand();
                // let offhandId = offhand.getItemId();

                if (offhand.getCount() < 64) {
                    // let inventory = Player.openInventory();
                    // inventory.grabAll(45);
                    // Check if the cursor has anything in it still, if it does, put it back in the offhand
                    // if (inventory.getSlot(46).getItemId() == offhandId) {
                    //     inventory.click(45);
                    // }
                }

                // Ensure offhand is a block
                if (offhand.getMaxCount() == 64) {
                    Player.getPlayer().interactBlock(pos.x, pos.y, pos.z, 1, true);
                }
            }
        });
    }
}));