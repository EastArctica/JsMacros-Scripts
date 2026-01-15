const inv = Player.openInventory;

function instantPress(keybind: string) {
    KeyBind.pressKeyBind(keybind);
    KeyBind.releaseKeyBind(keybind);
}

function findInInventory(itemId: string) {
    const invSlots = inv().getSlots('main', 'hotbar');
    const foundSlots = [];
    for (const slot of invSlots) {
        const item = inv().getSlot(slot);
        if (item != null && item.getItemId() === itemId) {
            foundSlots.push(slot);
        }
    }

    return foundSlots;
}

function getPebbleSlots() {
    const allItems = inv().getItemCount().entrySet().toArray();
    const pebbleSlots = allItems
        .filter(([id, _]) => id.startsWith('exdeorum:') && id.endsWith('_pebble'))
        .filter(([_, count]) => count >= 4);
    return pebbleSlots;
}

// Get pebbles
if (inv().getSlot(inv().getMap().hotbar[inv().getSelectedHotbarSlotIndex()]).getItemId() === 'minecraft:air') {
    Chat.log(`Getting ${64 * 128} pebbles`);
    KeyBind.pressKeyBind('key.sneak');
    Client.waitTick(1);
    for (let i = 0; i < 64 * 128; i++) {
        instantPress('key.use');
    }
    Client.waitTick(40);
}

// Try to craft everything in the inventory
inv().openGui();

let pebbleSlot;
while ((pebbleSlot = getPebbleSlots().shift())) {
    const [id, _] = pebbleSlot;

    while (inv().getItemCount().getOrDefault(id, 0) >= 4) {
        if (inv().getHeld().getItemId() !== 'minecraft:air') {
            Chat.log(`Dropping held item ${inv().getHeld().getItemId()}`);
            inv().click(-999);
        }
        // Clear the held item if it's stuck for some reason
        // if (inv().getSlot(inv.getSlotUnderMouse()) != null) {
        // inv().dropSlot(inv.getSlotUnderMouse(), true);
        // }

        const craftSlots = inv().getMap().crafting_in; // Array<number>
        // Clear crafting grid
        for (const slot of craftSlots) {
            const item = inv().getSlot(slot);
            if (item != null) {
                inv().dropSlot(slot, true);
            }
        }

        // Move items to crafting grid
        for (let j = 0; j < 4; j++) {
            const slot = findInInventory(id).shift();
            if (slot == null) {
                // Ran out of items, this just means we don't have another stack
                break;
            }
            inv().click(slot);
            inv().dragClick(craftSlots, 0);
        }
        // Take crafted item
        Client.waitTick(1);
        const craftOutSlot = inv().getMap().craft_out;
        let i = 0;
        while (inv().getSlot(craftOutSlot[0]) != null) {
            if (i++ > 65) {
                // This happens frequently and idrk why
                break;
            }
            inv().dropSlot(craftOutSlot[0]);
        }
        Client.waitTick(1);
    }
}

Client.waitTick(20);
KeyBind.releaseKeyBind('key.sneak');

export default event;
