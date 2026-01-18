JsMacros.assertEvent(event, 'Service');
import { glowBlock } from './utils/glow.clean';
import CommandBuilderWrapper from './utils/CommandBuilderWrapper';

const player = Player.getPlayer();
const playerPos = player.getPos();
let ungloww = glowBlock(playerPos.x, playerPos.y, playerPos.z, 0x00ff00);
Chat.log(`Glowed player at ${playerPos.x}, ${playerPos.y}, ${playerPos.z}`);

// Clean all blocks under the bedrock layer
const xrayBlocks: string[] = [];

// Register command to add blocks to xray list
const xrayCommand = new CommandBuilderWrapper('xray');
xrayCommand.processCommands([
    {
        literalArg: 'add',
        children: [
            {
                greedyStringArg: 'glob',
                executes: (ctx) => {
                    const glob = ctx.getArg('glob');
                    xrayBlocks.push(glob);
                    Chat.log(`Added glob ${glob} to xray list`);
                },
            },
            {
                blockArg: 'block',
                executes: (ctx) => {
                    const block = ctx.getArg('block');
                    xrayBlocks.push(block);
                    Chat.log(`Added block ${block} to xray list`);
                },
            },
        ],
    },
    {
        literalArg: 'remove',
        children: [
            {
                greedyStringArg: 'glob',
                executes: (ctx) => {
                    const glob = ctx.getArg('glob');
                    const index = xrayBlocks.indexOf(glob);
                    if (index !== -1) {
                        xrayBlocks.splice(index, 1);
                        Chat.log(`Removed glob ${glob} from xray list`);
                    }
                },
            },
            {
                blockArg: 'block',
                executes: (ctx) => {
                    const block = ctx.getArg('block');
                    const index = xrayBlocks.indexOf(block);
                    if (index !== -1) {
                        xrayBlocks.splice(index, 1);
                        Chat.log(`Removed block ${block} from xray list`);
                    }
                },
            },
        ],
    },
    {
        literalArg: 'list',
        executes: () => {
            Chat.log(`Xray blocks: ${xrayBlocks.join(', ')}`);
        },
    },
    {
        literalArg: 'clear',
        executes: () => {
            xrayBlocks.length = 0;
            Chat.log('Cleared xray list');
        },
    },
]);
xrayCommand.register();

const glowMap: Map<string, () => void> = new Map();
// On chunk load or block update, check if block is in xray list
const chunkLoadListener = JsMacros.on(
    'ChunkLoad',
    JavaWrapper.methodToJava((event) => {
        return;
        let worldScanner = World.getWorldScanner().withBlockFilter('getId').is('MATCHES', xrayBlocks[0]);

        for (let i = 1; i < xrayBlocks.length; i++)
            worldScanner = worldScanner.orBlockFilter('getId').is('MATCHES', xrayBlocks[i]);

        // Scan chunk
        let results = worldScanner.build().scanChunkRange(event.x, event.z, 0);
        Chat.log('Found ' + results.size() + ' xray blocks');

        // Glow blocks
        for (const block of results) {
            let unglow = glowBlock(block.getX(), block.getY(), block.getZ(), 0xff0000);
            glowMap.set(`${block.getX()}_${block.getY()}_${block.getZ()}`, unglow);
        }
    })
);

const blockUpdateListener = JsMacros.on(
    'BlockUpdate',
    JavaWrapper.methodToJava((event) => {
        // Chat.log(event.block.getId());
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    xrayCommand.unregister();
    JsMacros.off(chunkLoadListener);
    JsMacros.off(blockUpdateListener);

    ungloww();
    for (const unglow of glowMap.values()) unglow();
});
export default event;
