let player = Player.getPlayer();

for (let i = 0; i < 1; i++) {
    while (World.getBlock(-236, 101, -381).getId() != "minecraft:air") {
        Client.waitTick(1);
    }
    player.interactBlock(-237, 101, -382, 0, false);
    player.interactBlock(-236, 101, -382, 0, false);
    player.interactBlock(-236, 101, -380, 0, false);
    player.interactBlock(-235, 101, -382, 0, false);

    player.interactBlock(-237, 101, -380, 0, false);
    Client.waitTick(7);
}