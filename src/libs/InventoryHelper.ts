import ChatHelper from './ChatHelper';

const inv = Player.openInventory;

/**
 * Splits a stack in a given slot to achieve a target count in the target slot.
 * The split is done optimally using drag-click operations to distribute items.
 *
 * @param sourceSlot The slot containing the stack to split
 * @param targetSlot The slot to move items into (can be empty or contain items)
 * @param targetCount The desired count to achieve in the target slot
 * @returns An object containing the counts in both slots after splitting, or null on failure
 */
export function splitStack(
    sourceSlot: number,
    targetSlot: number,
    targetCount: number
): { sourceCount: number; targetCount: number } | null {
    try {
        const sourceItem = inv().getSlot(sourceSlot);
        const targetItem = inv().getSlot(targetSlot);

        const sourceCount = sourceItem.getCount();
        const currentTargetCount = targetItem.getCount();
        Chat.log(
            `Moving from slot ${sourceSlot} (${sourceCount}) to slot ${targetSlot} (${currentTargetCount}) to reach ${targetCount}`
        );

        // Validate that we can move items
        if (sourceCount === 0) {
            ChatHelper.error('Source slot is empty');
            return null;
        }

        // Check if target slot is empty or has the same item
        if (!targetItem.isEmpty() && targetItem.getItemId() !== sourceItem.getItemId()) {
            ChatHelper.error('Target slot contains a different item');
            return null;
        }

        // Calculate how many items we need to move
        const itemsToMove = targetCount - currentTargetCount;

        if (itemsToMove <= 0) {
            ChatHelper.log(`Target already has ${currentTargetCount} items (target: ${targetCount})`);
            return { sourceCount, targetCount: currentTargetCount };
        }

        if (itemsToMove > sourceCount) {
            ChatHelper.error(`Not enough items in source (need ${itemsToMove}, have ${sourceCount})`);
            return null;
        }

        // TODO: Optimize this with right clicks and drag clicks

        // Pick up the entire stack from source
        inv().click(sourceSlot);

        let remaining = itemsToMove;
        while (remaining > 0) {
            // Place single item with right-click
            inv().click(targetSlot, 1);
            remaining--;
        }

        // Place any remaining items back in source
        if (!inv().getHeld().isEmpty()) {
            inv().click(sourceSlot);
        }

        // Re-get inventory after operations to ensure fresh state
        const invAfterSplit = Player.openInventory();

        // Get the counts in both slots
        const finalSourceCount = invAfterSplit.getSlot(sourceSlot).getCount();
        const finalTargetCount = invAfterSplit.getSlot(targetSlot).getCount();

        ChatHelper.log(
            `Split stack: slot ${sourceSlot} (${finalSourceCount}), slot ${targetSlot} (${finalTargetCount})`
        );

        return { sourceCount: finalSourceCount, targetCount: finalTargetCount };
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
    } else if (smallestOverflowSlot !== -1) {
        // Find an empty slot to split into
        const emptySlot = inventory.findFreeInventorySlot();
        if (emptySlot === -1) {
            ChatHelper.error('No empty slot available for stack splitting');
            return -1;
        }

        // Split the stack - try to get maxCount items in the empty slot
        const splitResult = splitStack(smallestOverflowSlot, emptySlot, maxCount);
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
