import { updateScript } from '../libs/Updater';
updateScript(file.getAbsolutePath(), 'EastArctica/JsMacros', './config/EastArctica-scripts.json');

JsMacros.assertEvent(event, 'Service');

let blocksToPlace: Array<{ x: number; y: number; z: number }> = [];
const sendPacketListener = JsMacros.on(
    'SendPacket',
    JsMacros.createEventFilterer('SendPacket').setType('PlayerActionC2SPacket'),
    false,
    JavaWrapper.methodToJava((event, ctx) => {
        ctx.releaseLock();

        let action = event.packet.method_12363();
        switch (action.toString()) {
            case 'ABORT_DESTROY_BLOCK':
                // event.cancel();
                break;
            case 'START_DESTROY_BLOCK':
            case 'STOP_DESTROY_BLOCK':
                const blockPos = event.packet.method_12362();
                // Vec3i.getX(), Vec3i.getY(), Vec3i.getZ()
                clearLavaAround(blockPos.method_10263(), blockPos.method_10264(), blockPos.method_10260());
                break;
            default:
                break;
        }
    })
);

function restockSlot(slot: number) {
    const inv = Player.openInventory;
    if (!inv()) return;

    // Make sure the slot contains a stackable item
    let stack = inv().getSlot(slot);
    if (stack.getMaxCount() == 1 || stack.getCount() == stack.getMaxCount()) return;

    // Find matching items
    let matchingSlots = inv()
        .findItem(stack.getItemId())
        .filter((s) => s !== slot);
    if (matchingSlots.length == 0) return;

    inv().click(matchingSlots[0]);
    inv().click(slot);
}

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((evt, ctx) => {
        ctx.releaseLock();
        const interactionManager = Player.getInteractionManager();
        if (!interactionManager || !World.isWorldLoaded() || blocksToPlace.length == 0) return;

        for (const pos of blocksToPlace) {
            restockSlot(Player.openInventory().getMap().offhand[0]);
            interactionManager.interactBlock(pos.x, pos.y, pos.z, 'up', true);
        }
        blocksToPlace = [];
    })
);

function clearLavaAround(x: number, y: number, z: number) {
    const interactionManager = Player.getInteractionManager();
    if (!interactionManager) {
        return;
    }

    // Define the positions to check
    let positions = [
        { x: x, y: y + 1, z: z }, // above
        { x: x, y: y - 1, z: z }, // below
        { x: x + 1, y: y, z: z }, // east
        { x: x - 1, y: y, z: z }, // west
        { x: x, y: y, z: z + 1 }, // south
        { x: x, y: y, z: z - 1 }, // north
    ];
    // Check each position for lava
    positions.forEach((pos) => {
        let block = World.getBlock(pos.x, pos.y, pos.z);
        if (!block) {
            return;
        }
        // Check if the block is within our range
        if (block.getBlockPos().distanceTo(Player.getPlayer()) > Player.getReach()) {
            return;
        }
        if (block.getId() == 'minecraft:lava' && block.getBlockStateHelper().getFluidState().isStill()) {
            // Place a block to remove the lava
            // Ensure the player has an instant mine block in their offhand
            let offhand = Player.getPlayer().getOffHand();
            // // let offhandId = offhand.getItemId();
            // if (offhand.getCount() < 64) {
            //     let inventory = Player.openInventory();
            //     inventory.grabAll(45);
            //     // Check if the cursor has anything in it still, if it does, put it back in the offhand
            //     if (inventory.getSlot(46).getItemId() == offhand.getItemId()) {
            //         inventory.click(45);
            //     }
            // }
            // Ensure offhand is a block
            if (offhand.getMaxCount() == 64) {
                blocksToPlace.push(pos);
            }
        }
    });
}

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off(sendPacketListener);
    JsMacros.off(tickListener);
});

export default event;
