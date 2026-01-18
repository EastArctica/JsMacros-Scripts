JsMacros.assertEvent(event, 'Service');
if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad');

const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('beacon-utils');

const builder = CommandManager.createCommandBuilder('beacon-utils')
    .intArg('size')
    .suggestMatching('3', '5', '9')
    .executes(
        JavaWrapper.methodToJava((context) => {
            const player = Player.getPlayer();
            const pos = player.getBlockPos();
            Chat.log(`[beacon-utils] ${placeBeacon(context.getArg('size'), pos)?.message}`);
        })
    )
    .blockPosArg('pos')
    .executes(
        JavaWrapper.methodToJava((context) => {
            const pos = context.getArg('pos');
            const size = context.getArg('size');
            Chat.log(`[beacon-utils] ${placeBeacon(size, pos)?.message}`);
        })
    );
builder.register();

function pyramidVolume(size: number) {
    let volume = 0;
    for (let i = size; i > 0; i -= 2) {
        volume += i * i;
    }
    return volume;
}

// Size in blocks (size x size)
function placeBeacon(size: number, pos: BlockPosHelper, baseBlock = 'minecraft:iron_block') {
    if (size % 2 == 0) {
        return { success: false, message: 'Size must be an odd number' };
    }

    // Check if this block is a solid block, if so the user *probably* wants to place the beacon on top of it
    if (World.getBlock(pos).getBlockStateHelper().isSolid()) {
        pos = pos.offset(0, 1, 0);
    }

    const player = Player.getPlayer();
    const x = pos.getX();
    const y = pos.getY();
    const z = pos.getZ();

    // Find beacon and iron_blocks in inventory
    const inventory = Player.openInventory();
    let origBeaconSlot = inventory.findItem('minecraft:beacon')?.[0];
    let origBaseBlockSlots = inventory.findItem(baseBlock);
    if (origBeaconSlot == undefined) {
        return { success: false, message: 'No beacon in inventory' };
    }
    if (origBaseBlockSlots.length == 0) {
        return { success: false, message: 'No base blocks in inventory' };
    }

    // Ensure enough base blocks
    let totalBaseBlocks = origBaseBlockSlots.reduce((acc, curr) => acc + inventory.getSlot(curr).getCount(), 0);
    if (totalBaseBlocks < pyramidVolume(size)) {
        return { success: false, message: 'Not enough base blocks' };
    }

    // Move slots to hotbar
    inventory.swapHotbar(origBeaconSlot, 0);
    inventory.swapHotbar(origBaseBlockSlots[0], 1);

    // Teleport to the center of the block (mc allows teleports up to 1 block)
    // TODO: Only teleport if the beacon is at our player location
    // player.setPos(Math.floor(x) + 0.5, y, Math.floor(z) + 0.5);

    // Place everything except the center blocks
    let halfSize = Math.floor(size / 2);
    let verticalOffset = 0;
    while (halfSize != 0) {
        for (let i = -halfSize; i <= halfSize; i++) {
            for (let j = -halfSize; j <= halfSize; j++) {
                inventory.setSelectedHotbarSlotIndex(1);
                if (inventory.getSlot(37).getCount() < 1) {
                    // Move more base blocks to hotbar
                    let baseBlockSlot = inventory.findItem(baseBlock);
                    if (baseBlockSlot.length == 0) {
                        return { success: false, message: 'Not enough base blocks' };
                    }
                    inventory.swapHotbar(baseBlockSlot[0], 1);
                }

                const block = World.getBlock(x + i, y + verticalOffset, z + j);
                if (!block.getBlockStateHelper().isAir()) {
                    continue;
                }

                player.interactBlock(x + i, y + verticalOffset, z + j, 0, false);
            }
        }

        halfSize -= 1;
        verticalOffset++;
        Chat.log(`offset: ${verticalOffset}, halfSize: ${halfSize}`);
    }

    // Swap moved slots back
    inventory.swapHotbar(origBeaconSlot, 0);
    inventory.swapHotbar(origBaseBlockSlots[0], 1);
}

export default event;
