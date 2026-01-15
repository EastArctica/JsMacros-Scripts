JsMacros.assertEvent(event, 'Service');

const foodPoints = new Map([
    ["minecraft:apple", 4],
    ["minecraft:baked_potato", 5],
    ["minecraft:beef", 3],
    ["minecraft:beetroot", 1],
    ["minecraft:beetroot_soup", 6],
    ["minecraft:bread", 5],
    ["minecraft:cake_slice", 2],
    ["minecraft:carrot", 3],
    ["minecraft:chorus_fruit", 4],
    ["minecraft:cooked_beef", 8],
    ["minecraft:cooked_chicken", 6],
    ["minecraft:cooked_cod", 5],
    ["minecraft:cooked_mutton", 6],
    ["minecraft:cooked_porkchop", 8],
    ["minecraft:cooked_rabbit", 5],
    ["minecraft:cooked_salmon", 6],
    ["minecraft:cookie", 2],
    ["minecraft:dried_kelp", 1],
    ["minecraft:golden_apple", 4],
    ["minecraft:enchanted_golden_apple", 4],
    ["minecraft:golden_carrot", 6],
    ["minecraft:honey_bottle", 6],
    ["minecraft:melon_slice", 2],
    ["minecraft:mushroom_stew", 6],
    ["minecraft:porkchop", 3],
    ["minecraft:potato", 1],
    ["minecraft:pufferfish", 1],
    ["minecraft:pumpkin_pie", 8],
    ["minecraft:rabbit_stew", 10],
    ["minecraft:raw_chicken", 2],
    ["minecraft:raw_cod", 2],
    ["minecraft:raw_mutton", 2],
    ["minecraft:raw_porkchop", 3],
    ["minecraft:raw_rabbit", 3],
    ["minecraft:raw_salmon", 2],
    ["minecraft:rotten_flesh", 4],
    ["minecraft:spider_eye", 2],
    ["minecraft:suspicious_stew", 6],
    ["minecraft:sweet_berries", 2],
    ["minecraft:glow_berries", 2],
    ["minecraft:tropical_fish", 1]
]);
const bannedGamemodes = ['creative', 'spectator'];

const hungerListener = JsMacros.on('HungerChange', JavaWrapper.methodToJava((hungerEvt) => {
    Chat.log('HungerChange');
    Chat.log(hungerEvt.foodLevel);
}));

const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
    const player = Player.getPlayer();
    const inventory = Player.openInventory();
    if (!player || !inventory || bannedGamemodes.includes(Player.getGameMode())) return;

    const foodLevel = player.getFoodLevel();
    // Get the offhand item and determine its food value
    const offhand = inventory.getSlot(inventory.getMap().offhand[0]);
    const foodPoint = foodPoints.get(offhand.getItemId());

    if ((foodLevel - 20) > foodPoint) {
        Chat.log('Eating');
        Player.getInteractionManager().holdInteract(true);
        Client.waitTick(14 + (2 * foodPoint));
    }
    Player.getInteractionManager().holdInteract(false);
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(hungerListener);
    JsMacros.off(tickListener);
});

export default event;