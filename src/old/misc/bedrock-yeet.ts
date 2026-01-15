const player = Player.getPlayer();

for (let x = 0; x <= 16; x++) {
    for (let z = 14; z <= 18; z++) {
        for (let y = 1; y <= 5; y++) {
            const block = World.getBlock(x, y, z);
            if (block.getId() === 'minecraft:bedrock') {
                // /bedrockMiner task add x y z
                Chat.say(`/bedrockMiner task add ${x} ${y} ${z}`);
            }
        }
    }
}