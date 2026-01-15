import ChatHelper from './ChatHelper';

/**
 * Splits a stack in a given slot into two slots.
 * The split is done by picking up the stack and using the split operation.
 *
 * @param sourceSlot The slot containing the stack to split
 * @param targetSlot The empty slot to split into (can be an empty slot or the original slot)
 * @returns An object containing the counts in both slots after splitting, or null on failure
 */
export function splitStack(
    sourceSlot: number,
    targetSlot: number
): { sourceCount: number; targetCount: number } | null {
    const inventory = Player.openInventory();

    try {
        // Pick up the stack
        inventory.click(sourceSlot);
        // Wait a tick for pickup
        Client.waitTick();

        // Split into target slot and back to source slot
        inventory.split(targetSlot, sourceSlot);
        Client.waitTick();

        // Re-get inventory after split to ensure fresh state
        const invAfterSplit = Player.openInventory();

        // Get the counts in both slots
        const sourceCount = invAfterSplit.getSlot(sourceSlot).getCount();
        const targetCount = invAfterSplit.getSlot(targetSlot).getCount();

        ChatHelper.log(`Split stack: slot ${sourceSlot} (${sourceCount}), slot ${targetSlot} (${targetCount})`);

        return { sourceCount, targetCount };
    } catch (error) {
        ChatHelper.error(`Failed to split stack: ${error}`);
        return null;
    }
}

/**
 * Prepares an item for use by finding the optimal stack and moving it to the hotbar.
 * Will automatically split stacks if needed to fit within maxCount.
 *
 * @param itemId The item ID to prepare (e.g., 'minecraft:spawner')
 * @param maxCount Maximum count to select (will prefer largest stack that doesn't exceed this)
 * @param hotbarSlot Target hotbar slot to move the item to (0-8), defaults to 1
 * @returns The hotbar slot index where the item was placed, or -1 on failure
 */
export function prepareItemInHotbar(itemId: string, maxCount: number, hotbarSlot: number = 1): number {
    const inventory = Player.openInventory();

    // Find all slots with the item
    const itemSlots = inventory.findItem(itemId);
    if (itemSlots.length === 0) {
        ChatHelper.error(`No ${itemId} found in inventory`);
        return -1;
    }

    let targetSlot = -1;

    // Find the optimal stack: largest that doesn't exceed maxCount
    let bestFitSlot = -1;
    let bestFitCount = 0;
    let smallestOverflowSlot = -1;
    let smallestOverflowCount = Infinity;

    for (const slot of itemSlots) {
        const slotItem = inventory.getSlot(slot);
        const count = slotItem.getCount();

        if (count <= maxCount) {
            // Stack fits within maxCount
            if (count > bestFitCount) {
                bestFitCount = count;
                bestFitSlot = slot;
            }
        } else {
            // Stack is too large
            if (count < smallestOverflowCount) {
                smallestOverflowCount = count;
                smallestOverflowSlot = slot;
            }
        }
    }

    // Prefer best fit, otherwise use smallest overflow and split it
    if (bestFitSlot !== -1) {
        targetSlot = bestFitSlot;
        ChatHelper.log(`Selected stack of ${bestFitCount} ${itemId} from slot ${bestFitSlot}`);
    } else if (smallestOverflowSlot !== -1) {
        // Need to split the stack
        ChatHelper.log(`Stack of ${smallestOverflowCount} is too large for max ${maxCount}, splitting...`);

        // Find an empty slot to split into
        const emptySlot = inventory.findFreeInventorySlot();
        if (emptySlot === -1) {
            ChatHelper.error('No empty slot available for stack splitting');
            return -1;
        }

        // Split the stack
        const splitResult = splitStack(smallestOverflowSlot, emptySlot);
        if (splitResult === null) {
            return -1;
        }

        // Choose which slot to use based on which fits best
        if (splitResult.sourceCount <= maxCount && splitResult.sourceCount > 0) {
            targetSlot = smallestOverflowSlot;
        } else if (splitResult.targetCount <= maxCount && splitResult.targetCount > 0) {
            targetSlot = emptySlot;
        } else {
            // If neither fits exactly (edge case), use the smaller one
            targetSlot = splitResult.sourceCount <= splitResult.targetCount ? smallestOverflowSlot : emptySlot;
        }

        ChatHelper.log(`Using slot ${targetSlot} after split`);
    } else {
        ChatHelper.error(`No valid ${itemId} stack found`);
        return -1;
    }

    // Re-get inventory to ensure fresh state before hotbar operations
    const invForHotbar = Player.openInventory();

    // Ensure target slot is in hotbar
    const hotbarSlots = invForHotbar.getMap().hotbar;
    if (hotbarSlots === undefined) {
        ChatHelper.error('Hotbar not found in inventory map');
        return -1;
    }

    if (!hotbarSlots.includes(targetSlot)) {
        invForHotbar.swapHotbar(targetSlot, hotbarSlot as HotbarSwapSlot);
        targetSlot = hotbarSlots[hotbarSlot];
    }

    // Select the hotbar slot
    const hotbarIndex = hotbarSlots.indexOf(targetSlot);
    if (hotbarIndex === -1) {
        ChatHelper.error('Failed to find item in hotbar after swap');
        return -1;
    }

    invForHotbar.setSelectedHotbarSlotIndex(hotbarIndex);

    // Verify we have the correct item in hand
    const invForVerify = Player.openInventory();
    const selectedIndex = invForVerify.getSelectedHotbarSlotIndex();
    const heldItem = invForVerify.getSlot(hotbarSlots[selectedIndex]);

    if (heldItem.getItemId() !== itemId) {
        ChatHelper.error(`Failed to get ${itemId} in hand, got ${heldItem.getItemId()} instead`);
        return -1;
    }

    return selectedIndex;
}
