import CommandBuilderWrapper from '../libs/CommandBuilderWrapper';
JsMacros.assertEvent(event, 'Service');
const inv = Player.openInventory;

function openShop() {
    // Close any open inventory
    if (Hud.isContainer()) {
        inv().close();
    }

    Chat.say('/shop');
    const openContainerEvent = JsMacros.waitForEvent('OpenContainer');
    // @ts-expect-error getTitleText claims to return a string instead of a TextComponent
    if (openContainerEvent.event.screen.getTitleText().getString() !== '              ѕʜᴏᴘ ᴍᴇɴᴜ') {
        Chat.log('Possibly failed to open shop menu.');
    }
}

function filterSlots(slots: number[], predicate: (item: ItemStackHelper) => boolean): number[] {
    return slots.filter(slot => {
        const item = inv().getSlot(slot);
        return predicate(item);
    });
}

function clickSlotWithName(name: string, diffIndex = 0) {
    const slot = filterSlots(inv().getMap().container, item => item.getName().getString() == name)[0];
    if (!slot) {
        const msg = `§4No "${name}" slot found, are we out of sync with the shop?\nFound Items:\n` +
            filterSlots(inv().getMap().container, _ => true)
                .map(slot => inv().getSlot(slot).getName().getString())
                .join('\n  - ') + `\nContainer name: ${inv().getContainerTitle()}`;
        Chat.log(msg);
        throw new Error(msg);
    }

    // Wait for inventory update
    JsMacros.waitForEvent('SlotUpdate', JavaWrapper.methodToJava((e) => true), JavaWrapper.methodToJava((u1, u2) => {
        inv().click(slot + diffIndex);
        return null;
    }));
    // Seems to need a slight delay
    Client.waitTick(3);
}

function purchaseGear() {
    openShop()
    Client.waitTick(5);
    clickSlotWithName('GEAR SHOP');

    clickSlotWithName('Ender Pearl');
    // Increase quantity, there's secretly a "Add 16" slot to the right of the add 10 button
    clickSlotWithName('ADD 10', 1);
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Obsidian');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('End Crystal');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Respawn Anchor');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Diamond Pickaxe');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Back');
    clickSlotWithName('FOOD SHOP');
    clickSlotWithName('Golden Apple');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Back');
    clickSlotWithName('GEAR SHOP');
    clickSlotWithName('Glowstone');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Totem of Undying');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Diamond Sword');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Ender Pearl');
    // Increase quantity, there's secretly a "Add 16" slot to the right of the add 10 button
    clickSlotWithName('ADD 10', 1);
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Totem of Undying');
    for (let i = 0; i < 6; i++) {
        clickSlotWithName('CONFIRM');
    }
    
    clickSlotWithName('CANCEL');
    clickSlotWithName('Bottle o\' Enchanting');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Ender Pearl');
    // Increase quantity, there's secretly a "Add 16" slot to the right of the add 10 button
    clickSlotWithName('ADD 10', 1);
    for (let i = 0; i < 2; i++) {
        clickSlotWithName('CONFIRM');
    }

    clickSlotWithName('CANCEL');
    clickSlotWithName('Totem of Undying');
    for (let i = 0; i < 6; i++) {
        clickSlotWithName('CONFIRM');
    }
    
    clickSlotWithName('CANCEL');
    clickSlotWithName('Bottle o\' Enchanting');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Ender Pearl');
    // Increase quantity, there's secretly a "Add 16" slot to the right of the add 10 button
    clickSlotWithName('ADD 10', 1);
    for (let i = 0; i < 2; i++) {
        clickSlotWithName('CONFIRM');
    }
    
    clickSlotWithName('CANCEL');
    clickSlotWithName('Obsidian');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');
    
    clickSlotWithName('CANCEL');
    clickSlotWithName('End Crystal');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Totem of Undying');
    for (let i = 0; i < 4; i++) {
        clickSlotWithName('CONFIRM');
    }
    
    clickSlotWithName('CANCEL');
    clickSlotWithName('Bottle o\' Enchanting');
    clickSlotWithName('ADD 64');
    clickSlotWithName('CONFIRM');

    clickSlotWithName('CANCEL');
    clickSlotWithName('Ender Pearl');
    // Increase quantity, there's secretly a "Add 16" slot to the right of the add 10 button
    clickSlotWithName('ADD 10', 1);
    clickSlotWithName('CONFIRM');

    inv().close();
}

function purchaseShulkers() {
    openShop();
    Client.waitTick(3);
    clickSlotWithName('END SHOP');
    Client.waitTick(3);

    clickSlotWithName('Shulker Box');
    Client.waitTick(3);
    for (let i = 0; i < 2; i++) {
        clickSlotWithName('CONFIRM');
        Client.waitTick(1);
    }

    inv().close();
}

function run() {
    purchaseGear();
    Client.waitTick(1);

    // Open first shulker box
    Player.getInteractionManager().interact();
    // JsMacros.waitForEvent('OpenContainer');
    Client.waitTick(3);

    // Move items from shulker to inventory
    // const mainSlots = inv().getMap().main;
    // for (const slot of mainSlots) {
    for (let slot = 27; slot < 54; slot++) {
        inv().quick(slot);
        Client.waitTick(1);
    }
    inv().close();

    // Before breaking anything switch off the held item incase it can take durability
    inv().setSelectedHotbarSlotIndex(0);
    Client.waitTick(1);

    // Break first shulker box
    Player.getInteractionManager().breakBlock();
    Client.waitTick(2);

    // Open new shulker box
    Player.getInteractionManager().interact();
    // JsMacros.waitForEvent('OpenContainer');
    Client.waitTick(3);

    // Move items from shulker to inventory
    // const hotbarSlots = inv().getMap().hotbar;
    // for (const slot of hotbarSlots) {
    for (let slot = 54; slot < 63; slot++) {
        inv().quick(slot);
        Client.waitTick(1);
    }
    inv().close();

    // Break second shulker box
    Player.getInteractionManager().breakBlock();
    Client.waitTick(2);

    // Purchase new shulker boxes
    purchaseShulkers();
    Client.waitTick(1);

    inv().setSelectedHotbarSlotIndex(0);
    Player.getInteractionManager().interact();
    // Start sneaking now
    KeyBind.keyBind("key.sneak", true);
    Client.waitTick(2);

    // Place second shulker box
    inv().setSelectedHotbarSlotIndex(1);
    Player.getInteractionManager().interact();
    Client.waitTick(3);

    // Stop sneaking
    KeyBind.keyBind("key.sneak", false);
    Client.waitTick(3);
}

const command = new CommandBuilderWrapper('auto-shulker');
command.processCommands([{
    longArg: 'quantity',
    executesAsync: async (ctx) => {
        const quantity: number = ctx.getArg('quantity');
        Chat.log(`Running auto shulker with quantity: ${quantity}`);

        try {
            for (let i = 0; i < quantity; i++) {
                run();
                Client.waitTick(10);
                Chat.log(`Completed run ${i + 1} successfully.`);
            }
        } catch (e) {
            Chat.log(`§4Failed to run auto shulker: ${e}`);
        }
    }
}]);
command.register();

event.stopListener = JavaWrapper.methodToJava((_) => {
    command.unregister();
});

export default event;
