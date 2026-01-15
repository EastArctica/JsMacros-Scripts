import { interpolateColor } from './utils/color';
import { glowBlock } from './utils/glow_not_working';

// Clean all blocks under the bedrock layer
const player = Player.getPlayer();
const interactionManager = Player.getInteractionManager();

const blocks = [];
World.iterateSphere(player.getBlockPos(), Math.floor(Player.getReach()), true, JavaWrapper.methodToJava((data) => {
    if (data.getBlock().getHardness() == -1 || data.getY() > -60) return;
    if (data.getBlockStateHelper().getFluidState().getId() != 'minecraft:empty') return;

    // Only include blocks between -129, -1713 and -419, -2001 inclusive
    if ((data.getX() >= -419 && data.getX() <= -129) && (data.getZ() >= -2001 && data.getZ() <= -1713)) {
        blocks.push({
            x: Math.floor(data.getX()),
            y: Math.floor(data.getY()),
            z: Math.floor(data.getZ())
        });
    }
}));

Chat.log(`Spawning ${blocks.length} blocks...`);

let blockGlow = [];
for (let i = 0; i < blocks.length; i++) blockGlow.push(glowBlock(blocks[i].x, blocks[i].y, blocks[i].z, interpolateColor(0xFF0000, 0x00FF00, i / blocks.length)));

for (let i = 0; i < blocks.length; i++) {
    Player.interactions().setTarget(blocks[i].x, blocks[i].y, blocks[i].z);
    Player.interactions().breakBlock();
    blockGlow[i]();
}
Player.interactions().clearTargetOverride();
