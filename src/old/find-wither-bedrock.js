let bedrocks = World.findBlocksMatching('minecraft:bedrock', 2);
// Filter bedrocks to only container roof bedrock
bedrocks = bedrocks.filter((pos) => pos.y == 127);

for (const pos of bedrocks) {
    // Check if all blocks in a 3x3x3 area below are bedrock
    let validStructure = true;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
            for (let dy = 0; dy >= -2; dy--) {
                // Check three layers down
                const block = World.getBlock(pos.getX() + dx, pos.getY() + dy, pos.getZ() + dz);

                if (!block || block.getId() !== 'minecraft:bedrock') {
                    validStructure = false;
                    break;
                }
            }
            if (!validStructure) break;
        }
        if (!validStructure) break;
    }

    if (validStructure) {
        Chat.log(`${pos.getX()} ${pos.getY()} ${pos.getZ()}`);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                for (let dy = 0; dy >= -2; dy--) {
                    // Check three layers down
                    Chat.say(`/cglow block ${pos.getX() + dx} ${pos.getY() + dy} ${pos.getZ() + dz} 10`);
                }
                if (!validStructure) break;
            }
            if (!validStructure) break;
        }
    }
}

Chat.log('done');

export default event;
