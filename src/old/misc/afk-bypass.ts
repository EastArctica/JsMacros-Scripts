JsMacros.assertEvent(event, "Service");

let player = Player.getPlayer();
let lastYaw = player.getYaw();

let tick = 0;
JsMacros.on("Tick", JavaWrapper.methodToJava((tickEvent) => {
    player = Player.getPlayer();
    let yaw = player.getRaw().method_36454(); // net/minecraft/entity/Entity.getYaw()
    let playerBlockPos = player.getBlockPos();
    
    // If the yaw is far from the last yaw, the player is likely being controlled by a player
    // and we should update the last yaw and pitch
    if (Math.abs(yaw - lastYaw) > 0.1) {
        lastYaw = yaw;
    }

    if (tick % 5 == 0) {
        // Snap current direction to the nearest 90 degrees
        let newYaw = lastYaw; // Math.round(initialYaw / 90) * 90;
        // Add a random amount from -0.1 to 0.1 to the yaw
        newYaw += (Math.random() - 0.5) * 0.2;

        player.getRaw().method_36456(Math.fround(newYaw)); // net/minecraft/entity/Entity.setYaw()
    }
    
    // Send a slot update packet every 5 minutes
    if (tick % 6000 == 0) {
        // UpdateSelectedSlotC2SPacket
        const UpdateSelectedSlotC2SPacket = Reflection.getClass("net.minecraft.class_2868");
        let packet = new UpdateSelectedSlotC2SPacket(Player.openInventory().getSelectedHotbarSlotIndex());
        Client.sendPacket(packet);
    }

    // Attack the block directly below us every 5 minutes
    if (tick % 6000 == 0) {
        player.attack(playerBlockPos.getX(), playerBlockPos.getY(), playerBlockPos.getZ(), 0);
    }

    // Interact with the block directly below us every 5 minutes
    if (tick % 6000 == 0) {
        player.interactBlock(playerBlockPos.getX(), playerBlockPos.getY(), playerBlockPos.getZ(), 0, false);
    }

    tick++;
}));
