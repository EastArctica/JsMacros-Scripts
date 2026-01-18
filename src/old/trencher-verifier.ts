JsMacros.assertEvent(event, 'Service');
const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('verify-trencher');

// Get nearby chunks and check whether they have any 7 or higher gravity black stacks
// If so, print the chunk coordinates and the number of such stacks

const builder = CommandManager.createCommandBuilder('verify-trencher')
    .blockPosArg('from')
    .suggest(
        JavaWrapper.methodToJava((context, builder) => {
            let targetPos = Player.rayTraceBlock(500, false).getBlockPos();
            return builder.suggestMatching(`${targetPos.getX()} ${targetPos.getY()} ${targetPos.getZ()}`);
        })
    )
    .blockPosArg('to')
    .suggest(
        JavaWrapper.methodToJava((context, builder) => {
            let targetPos = Player.rayTraceBlock(500, false).getBlockPos();
            return builder.suggestMatching(`${targetPos.getX()} ${targetPos.getY()} ${targetPos.getZ()}`);
        })
    )
    .executes(
        JavaWrapper.methodToJava((context) => {
            verifyTrencher(context.getArg('from'), context.getArg('to'));
        })
    );
builder.register();

let scanner = World.getWorldScanner()
    .withBlockFilter('getId')
    .is(
        'MATCHES',
        '^minecraft:(sand|red_sand|gravel|anvil|chipped_anvil|damaged_anvil|dragon_egg|(?:[a-z_]+_)?concrete_powder)$'
    )
    .build();

function verifyTrencher(from, to) {
    // get high and low x and z values
    const minX = Math.min(from.getX(), to.getX());
    const maxX = Math.max(from.getX(), to.getX());
    const minZ = Math.min(from.getZ(), to.getZ());
    const maxZ = Math.max(from.getZ(), to.getZ());

    // const blocks = World.findBlocksMatching([ 'minecraft:sand', 'minecraft:gravel' ], 10);
    Chat.log('Searching for blocks');
    const blocks = scanner.scanCubeAreaInclusive(from, to);

    Chat.log('Found blocks');
    // Map<string, Array<number>> of XZ block coords to y values
    const blocks2D = new Map();
    for (const block of blocks) {
        // Skip blocks outside the specified range
        if (block.x < minX || block.x > maxX || block.z < minZ || block.z > maxZ) {
            continue;
        }

        const pos2D = `${block.x},${block.z}`;
        if (!blocks2D.has(pos2D)) {
            blocks2D.set(pos2D, []);
        }
        blocks2D.get(pos2D).push(block.y);
    }

    for (const block2D of blocks2D) {
        const pos2D = block2D[0].split(',').map(Number);
        const yValues = block2D[1];
        let currentHigh = 0;

        for (let i = 1; i < yValues.length; i++) {
            if (yValues[i - 1] + 1 === yValues[i]) {
                currentHigh++;
            } else {
                currentHigh = 0;
            }

            if (currentHigh >= 7) {
                Chat.log(`Block (${pos2D[0]}, ${pos2D[1]}) has ${currentHigh + 1} high stack around (${yValues[i]})`);
            }
        }
    }
    Chat.log(`Checked ${blocks.length} blocks and found ${blocks2D.size} unique 2D positions`);
}

export default event;
