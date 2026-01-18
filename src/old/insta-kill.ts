// Place ender chest, grab insta-kill shulker, place shulker, take all items, auto pot, insta break blocks, auto crystal
const Box = Java.type('net.minecraft.class_238');
const BlockPosHelper = Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;
const BlockState = Java.type('net.minecraft.class_2680');
const AirBlock = Java.type('net.minecraft.class_2189');

const MAX_REACH = 5; // 31 blocks

function getEntityBounds() {
    let bounds = [];
    World.getEntities().forEach(
        JavaWrapper.methodToJava((entity) => {
            // Get the size of the entity and determine the blocks it occupies
            const boundingBox = entity.getRaw().method_5829();
            bounds.push(boundingBox);
        })
    );

    return bounds;
}

function findChestLocation(
    maxDistance: number = Player.getReach(),
    matchEnderChest: boolean = false,
    nearPos: BlockPosHelper = null
) {
    const player = Player.getPlayer();
    const blacklistBoxes = getEntityBounds();

    let targetBlockX: number;
    let targetBlockY: number;
    let targetBlockZ: number;
    let foundBlock = false;
    let existingEnderChest = false;

    // If we're given a position, use that as the center and search around it, slowly expanding outwards
    if (nearPos) {
        let dist = 0;
        while (!foundBlock && dist < maxDistance) {
            World.iterateSphere(
                nearPos,
                dist,
                false,
                JavaWrapper.methodToJava((blockData) => {
                    if (foundBlock) return;

                    // If this position was already checked, skip it
                    let distance = blockData.getBlockPos().distanceTo(nearPos);
                    if (distance > dist - 1) return;

                    let aboveBlock = World.getBlock(blockData.getBlockPos().up(1));
                    if (
                        matchEnderChest &&
                        blockData.getId() == 'minecraft:ender_chest' &&
                        aboveBlock.getId() == 'minecraft:air'
                    ) {
                        foundBlock = true;
                        existingEnderChest = true;

                        let pos = blockData.getBlockPos();
                        targetBlockX = pos.getX();
                        targetBlockY = pos.getY();
                        targetBlockZ = pos.getZ();
                        return;
                    }

                    if (blockData.getId() == 'minecraft:air' && aboveBlock.getId() == 'minecraft:air') {
                        const blockBox = new Box(blockData.getBlockPos().getRaw());
                        if (blacklistBoxes.some((box) => box.method_994(blockBox))) {
                            // boolean Box.intersects( Box box)
                            return;
                        }

                        let pos = blockData.getBlockPos();
                        targetBlockX = pos.getX();
                        targetBlockY = pos.getY();
                        targetBlockZ = pos.getZ();
                        foundBlock = true;
                        return;
                    }
                })
            );
            dist += 1;
        }
    } else {
        World.iterateSphere(
            player.getBlockPos(),
            Math.floor(MAX_REACH),
            false,
            JavaWrapper.methodToJava((blockData) => {
                if (foundBlock) return;

                let aboveBlock = World.getBlock(blockData.getBlockPos().up(1));
                if (
                    matchEnderChest &&
                    blockData.getId() == 'minecraft:ender_chest' &&
                    aboveBlock.getId() == 'minecraft:air'
                ) {
                    foundBlock = true;
                    existingEnderChest = true;

                    let pos = blockData.getBlockPos();
                    targetBlockX = pos.getX();
                    targetBlockY = pos.getY();
                    targetBlockZ = pos.getZ();
                    return;
                }

                if (blockData.getId() == 'minecraft:air' && aboveBlock.getId() == 'minecraft:air') {
                    const blockBox = new Box(blockData.getBlockPos().getRaw());
                    if (blacklistBoxes.some((box) => box.method_994(blockBox))) {
                        // boolean Box.intersects( Box box)
                        return;
                    }

                    let pos = blockData.getBlockPos();
                    targetBlockX = pos.getX();
                    targetBlockY = pos.getY();
                    targetBlockZ = pos.getZ();
                    foundBlock = true;
                    return;
                }

                return;
            })
        );
    }

    if (!foundBlock) {
        return null;
    }

    return {
        pos: new BlockPosHelper(targetBlockX, targetBlockY, targetBlockZ),
        existingEnderChest: existingEnderChest,
    };
}

function findCrystalLocation(
    nearPos: BlockPosHelper = null,
    allowedBlocks: Array<string> = ['minecraft:obsidian', 'minecraft:air']
): BlockPosHelper {
    const MAX_DISTANCE = 5;
    const blacklistBoxes = getEntityBounds();

    let targetBlockX: number;
    let targetBlockY: number;
    let targetBlockZ: number;
    let foundBlock = false;

    // If we're given a position, use that as the center and search around it, slowly expanding outwards
    let dist = 0;
    while (!foundBlock && dist < MAX_DISTANCE) {
        World.iterateBox(
            nearPos.down(1).east(dist).south(dist),
            nearPos.down(1).west(dist).north(dist),
            false,
            JavaWrapper.methodToJava((blockData) => {
                if (foundBlock) return;

                // TODO: Prefer obsidian that already exists
                // TODO: Determine what block we can break the fastest

                // Skip already checked blocks
                let distance = blockData.getBlockPos().distanceTo(nearPos);
                if (distance > dist - 1) return;

                let aboveBlock = World.getBlock(blockData.getBlockPos().up(1));

                if (allowedBlocks.includes(blockData.getId()) && aboveBlock.getId() == 'minecraft:air') {
                    const blockBox = new Box(blockData.getBlockPos().getRaw()).method_1009(0, 2, 0);
                    if (blacklistBoxes.some((box) => box.method_994(blockBox))) {
                        // boolean Box.intersects( Box box)
                        return;
                    }

                    let pos = blockData.getBlockPos();
                    targetBlockX = pos.getX();
                    targetBlockY = pos.getY();
                    targetBlockZ = pos.getZ();
                    foundBlock = true;
                    return;
                }
            })
        );
        dist += 1;
    }

    if (!foundBlock) {
        if (allowedBlocks.length == 1 && allowedBlocks[0] == 'minecraft:stone') {
            return null;
        }

        return findCrystalLocation(nearPos, ['minecraft:stone']);
    }

    return new BlockPosHelper(targetBlockX, targetBlockY, targetBlockZ);
}

function getTargetPlayer(): PlayerEntityHelper | null {
    const player = Player.getPlayer();

    // Get the nearest player to the crosshair
    let nearestPlayer: PlayerEntityHelper = null;
    let nearestAngle = 180;
    for (const entity of World.getEntities()) {
        if (entity.getType() !== 'minecraft:player') continue;
        if (entity.getName().toString() === player.getName().toString()) continue;

        // Ensure they are within reach
        const distance = player.getBlockPos().distanceTo(entity.getPos());
        if (distance > MAX_REACH) continue;

        // Calculate angle to each player
        const angle = Math.atan2(entity.getX() - player.getX(), entity.getZ() - player.getZ());
        const angleDiff = Math.abs(player.getYaw() - angle);
        if (angleDiff < nearestAngle) {
            nearestAngle = angleDiff;
            nearestPlayer = entity.asPlayer();
        }
    }

    return nearestPlayer;
}

function main() {
    const player = Player.getPlayer();
    const inv = Player.openInventory;
    const interactionManger = Player.getInteractionManager();
    const targetPlayer = getTargetPlayer();

    Chat.log(`player: ${player} ${targetPlayer}`);
    if (!player || !targetPlayer) return;
    Chat.log(`[insta-kill] Target: ${targetPlayer.getName().toString()}`);

    // Break the block under us until we're 1 block below the target and teleport into it
    for (let i = 0; i < targetPlayer.getBlockPos().getY() - player.getBlockPos().getY() + 1; i++) {
        inv().swapHotbar(
            inv().findItem('minecraft:netherite_pickaxe')[0],
            inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot
        );
        interactionManger.breakBlock(
            player.getBlockPos().getX(),
            player.getBlockPos().getY() - i - 1,
            player.getBlockPos().getZ()
        );
    }

    let pos = player
        .getBlockPos()
        .toPos3D()
        .add(0.5, targetPlayer.getBlockPos().getY() - player.getBlockPos().getY() - 1, 0.5);
    player.setPos(pos);

    // Find ender chest
    const enderChest = inv().findItem('minecraft:ender_chest');
    if (enderChest.length == 0) {
        Chat.log('[insta-kill] No ender chest found in inventory');
        return;
    }

    // TODO: If an ender chest is already in our hotbar, switch to it instead
    inv().swapHotbar(enderChest[0], inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot);

    // Find closest block and place ender chest
    const { pos: enderChestPos, existingEnderChest } = findChestLocation(MAX_REACH, true);
    Chat.log(`[insta-kill] Ender Chest: ${enderChestPos}`);

    // Place ender chest
    if (!existingEnderChest) {
        Chat.log('[insta-kill] Placing ender chest');
        interactionManger.interactBlock(enderChestPos.getX(), enderChestPos.getY(), enderChestPos.getZ(), 'up', false);
    }

    // Open ender chest
    JsMacros.waitForEvent(
        'ContainerUpdate',
        JavaWrapper.methodToJava((e) => true),
        JavaWrapper.methodToJava((str: any, o1: any) => {
            interactionManger.interactBlock(
                enderChestPos.getX(),
                enderChestPos.getY(),
                enderChestPos.getZ(),
                'up',
                false
            );
            return null;
        })
    );
    Chat.log('[insta-kill] Ender chest opened');
    const enderChestSlots = inv().getMap().container;

    // Currently we just assume we have space
    for (const slotId of enderChestSlots) {
        const slot = inv().getSlot(slotId);
        if (slot.getItemId().match(/minecraft:[a-z]*_?shulker_box/g) == null) continue;

        if (
            slot
                .getName()
                .toString()
                .match(/.*Toys.*/g)
        ) {
            inv().swapHotbar(slotId, inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot);
            break;
        }
    }
    inv().close();
    Client.waitTick(1);

    const { pos: shulkerTarget } = findChestLocation(MAX_REACH, false);
    // Place shulker
    interactionManger.interactBlock(shulkerTarget.getX(), shulkerTarget.getY(), shulkerTarget.getZ(), 'up', false);

    JsMacros.waitForEvent(
        'ContainerUpdate',
        JavaWrapper.methodToJava((e) => true),
        JavaWrapper.methodToJava((str: any, o1: any) => {
            interactionManger.interactBlock(
                shulkerTarget.getX(),
                shulkerTarget.getY(),
                shulkerTarget.getZ(),
                'up',
                false
            );
            return null;
        })
    );
    Chat.log('[insta-kill] Shulker placed');

    // Take all items
    const shulkerSlots = inv().getMap().container;
    for (const slotId of shulkerSlots) {
        inv().quickAll(slotId);
    }
    inv().close();

    let pot: number;
    while ((pot = inv().findItem('minecraft:splash_potion')[0])) {
        inv().swapHotbar(pot, inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot);
        player.lookAt('down');
        interactionManger.interactItem(false);
        Client.waitTick(1);
    }

    // Find spot for crystal, absolute max for damage is 12 blocks, this would be awful to use though
    let targetEyePos = targetPlayer.getEyePos();
    player.lookAt(targetEyePos.getX(), targetEyePos.getY(), targetEyePos.getZ());
    while (targetPlayer.isAlive()) {
        let crystalPos = findCrystalLocation(targetPlayer.getBlockPos());
        Chat.log(`[insta-kill] Health ${targetPlayer.getHealth()}/${targetPlayer.getMaxHealth()}`);
        let crystalSlot = inv().findItem('minecraft:end_crystal')[0];
        let obsidianSlot = inv().findItem('minecraft:obsidian')[0];

        // Place obsidian
        const targetBlock = World.getBlock(crystalPos);
        if (targetBlock.getId() !== 'minecraft:obsidian') {
            if (targetBlock.getId() !== 'minecraft:air') {
                inv().swapHotbar(
                    inv().findItem('minecraft:netherite_pickaxe')[0],
                    inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot
                );
                interactionManger.breakBlock(crystalPos.getX(), crystalPos.getY(), crystalPos.getZ());
                Client.waitTick(2);
            }

            inv().swapHotbar(obsidianSlot, inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot);
            Client.waitTick(2);
            interactionManger.interactBlock(crystalPos.getX(), crystalPos.getY(), crystalPos.getZ(), 'down', false);
            Client.waitTick(1);
        }

        // Place crystal
        inv().swapHotbar(crystalSlot, inv().getSelectedHotbarSlotIndex() as HotbarSwapSlot);
        Client.waitTick(1);
        interactionManger.interactBlock(crystalPos.getX(), crystalPos.getY(), crystalPos.getZ(), 'up', false);

        // Wait 1 tick
        Client.waitTick(1);

        // explode the crystal
        const crystal = World.getEntities().find(
            (entity) => entity.getType() === 'minecraft:end_crystal' && entity.getBlockPos().distanceTo(crystalPos) < 2
        );
        if (crystal) {
            interactionManger.attack(crystal);
        }

        // Wait 10 ticks before our next crystal
        Client.waitTick(10);
    }
}
main();
