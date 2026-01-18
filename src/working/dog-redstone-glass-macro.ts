//------------variable----------------
let speed = 500;
//amount of wait time between every block place in milliseconds.

let ReloadTime = 50;
//amount of wait time for an item to get transfered from a slot

let wait = 100;
//------------------------------------

function triggerBind(bind, ticksPressed, waitTime) {
    KeyBind.keyBind(bind, true);
    Client.waitTick(ticksPressed);
    KeyBind.keyBind(bind, false);
    if (waitTime !== undefined) {
        Time.sleep(waitTime);
    }
}

//------------Setup-------------------
Player.getPlayer().lookAt(90, 0);
KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
//------------------------------------

function place(item) {
    if (!item) {
        Chat.log('No item specified for place function!');
        return;
    }

    const inv = Player.openInventory();
    const redstoneSlot = inv.findItem(item).filter((slot) => inv.getLocation(slot) === 'hotbar');
    if (redstoneSlot.length === 0) {
        Chat.log('No redstone found in hotbar!');
        return;
    }

    inv.setSelectedHotbarSlotIndex(inv.getMap().hotbar[redstoneSlot[0]]);
    triggerBind('key.use', 1, speed);
}

// laag 1-15
for (let i = 0; i < 15; i++) {
    //redstone
    Player.openInventory().setSelectedHotbarSlotIndex(0);
    Player.getPlayer().lookAt(-93.3, 39.4);
    place('minecraft:redstone');

    Player.getPlayer().lookAt(-98.7, 58);
    place('minecraft:redstone');

    Player.getPlayer().lookAt(-0.6, 90);
    place('minecraft:redstone');

    Player.getPlayer().lookAt(92.7, 55.9);
    place('minecraft:redstone');

    Player.getPlayer().lookAt(94.8, 37.6);
    place('minecraft:redstone');

    Player.getPlayer().lookAt(0, 0);

    triggerBind('key.jump', 1, 50);

    triggerBind('key.forward', 10, wait);

    //block
    Player.openInventory().setSelectedHotbarSlotIndex(3);
    Player.getPlayer().lookAt(-125.2, 48.8);
    place('minecraft:glass');

    Player.getPlayer().lookAt(-142.6, 57.7);
    place('minecraft:glass');

    Player.getPlayer().lookAt(121.1, 46.6);
    place('minecraft:glass');

    Player.getPlayer().lookAt(142.3, 57);
    place('minecraft:glass');

    Player.getPlayer().lookAt(178.9, 64);
    place('minecraft:glass');
}

// This one is slightly different, it uses different angles so I kept it separate.

//------------laag 16----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(1);
Player.getPlayer().lookAt(-98.2, 38.4);
place('minecraft:redstone');

Player.getPlayer().lookAt(-101.3, 58.9);
place('minecraft:redstone');

Player.getPlayer().lookAt(171, 79);
place('minecraft:redstone');

Player.getPlayer().lookAt(103.8, 55.2);
place('minecraft:redstone');

Player.getPlayer().lookAt(96.6, 38.2);
place('minecraft:redstone');

Player.getPlayer().lookAt(-180, 0);

KeyBind.keyBind('key.forward', true);
Client.waitTick(1);
KeyBind.keyBind('key.forward', false);

triggerBind('key.jump', 1, wait);

triggerBind('key.forward', 5, wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(4);
Player.getPlayer().lookAt(-65.3, 48.9);
place('minecraft:glass');

Player.getPlayer().lookAt(-48.9, 60.7);
place('minecraft:glass');

Player.getPlayer().lookAt(65.1, 49);
place('minecraft:glass');

Player.getPlayer().lookAt(45.7, 62.7);
place('minecraft:glass');

Player.getPlayer().lookAt(0, 68.8);
place('minecraft:glass');
//------------------------------------
//------------retour------------------
Player.getPlayer().lookAt(180, 45);
triggerBind('key.forward', 1, 100);

triggerBind('key.forward', 57, 150);

Player.getPlayer().lookAt(-80, 0);
KeyBind.keyBind('key.forward', true);
Client.waitTick(15);
KeyBind.keyBind('key.forward', false);
//------------------------------------
