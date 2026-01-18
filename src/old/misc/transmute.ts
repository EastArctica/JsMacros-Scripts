const reagents = [
    {
        id: 'minecraft:gunpowder',
        count: 17,
    },
    {
        id: 'minecraft:redstone',
        count: 17,
    },
];
const input = {
    id: 'minecraft:coal',
    count: 12,
};

const output = {
    id: 'minecraft:diamond',
    count: 1,
};

function findItem(id: string) {
    // TODO: Check item in inventory as well as the 3 shulkers located at (-284, 116, -496), (-280, 116, -500), (-276, 116, -496)
}

function dropItemsAtAngle(id: string, count: number, pitch: number, yaw: number) {
    let player = Player.getPlayer();
    player.lookAt(pitch, yaw);
    // Wait because it takes a bit for the player to look
    Time.sleep(75);

    let inventory = Player.openInventory();
    let foundItems = inventory.findItem(id);
    if (foundItems.length === 0) {
        throw `Item ${id} not found`;
    }

    for (let i = 0; i < count; i++) {
        inventory.dropSlot(foundItems[0], false);
    }
}

for (let i = 0; i < 25; i++) {
    // drop the input item at (180, 8)
    dropItemsAtAngle(reagents[0].id, reagents[0].count, -90, 8);
    Time.sleep(10);
    dropItemsAtAngle(reagents[1].id, reagents[1].count, 90, 8);
    Time.sleep(10);
    dropItemsAtAngle(input.id, input.count, 180, 8);
    Time.sleep(10);
}
