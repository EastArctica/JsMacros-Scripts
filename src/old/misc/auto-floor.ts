JsMacros.assertEvent(event, 'Service');

JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_) => {
        let player = Player.getPlayer();

        // check the area below the player (3x3) for any blocks that are air and replace them with the netherack
        let playerPos = player.getBlockPos();
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                let block = World.getBlock(playerPos.getX() + x, playerPos.getY() - 1, playerPos.getZ() + z);
                if (block.getId() == 'minecraft:air') {
                    let offhand = Player.getPlayer().getOffHand();

                    // Ensure offhand is a block
                    if (offhand.getMaxCount() == 64) {
                        Player.getPlayer().interactBlock(
                            playerPos.getX() + x,
                            playerPos.getY() - 1,
                            playerPos.getZ() + z,
                            1,
                            true
                        );
                    }
                }
            }
        }
    })
);
