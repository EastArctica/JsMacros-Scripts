import CommandBuilderWrapper from './utils/CommandBuilderWrapper';
import { glowBlock } from './utils/glow';

const BlockPosHelper = Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;

JsMacros.assertEvent(event, 'Service');

let config = {
    areaGlow: {
        color: 0xFFFFFF,
    }
};

if (FS.exists('./config/east-tweaks.json')) {
    let file = FS.open('./config/east-tweaks.json', 'utf-8');
    let readConfig = JSON.parse(file.read());

    config = {
        ...config,
        ...readConfig
    };
}

const areaGlows = [];

const wrapper = new CommandBuilderWrapper('eareaglow');
wrapper.processCommands([{
    literalArg: 'config',
    children: [{
        literalArg: 'color',
        executes: () => Chat.log(`Current color: ${config.areaGlow.color}`),
        children: [{
            intArg: 'color',
            executes: (ctx) => {
                Chat.log(`Changing color from ${config.areaGlow.color} to ${ctx.getArg('color')}`);
                config.areaGlow.color = ctx.getArg('color');
            }
        }]
    }]
},
{
    blockPosArg: 'from',
    suggest: (_, suggestionHelper) => {
        let targetPos = Player.rayTraceBlock(500, false).getBlockPos();
        return suggestionHelper.suggestMatching(`${targetPos.getX()} ${targetPos.getY()} ${targetPos.getZ()}`);
    },
    children: [{
        blockPosArg: 'to',
        suggest: (_, suggestionHelper) => {
            let targetPos = Player.rayTraceBlock(500, false).getBlockPos();
            return suggestionHelper.suggestMatching(`${targetPos.getX()} ${targetPos.getY()} ${targetPos.getZ()}`);
        },
        children: [{
            blockArg: 'block',
            executes: (ctx) => {
                const from = ctx.getArg('from') as BlockPosHelper;
                const to = ctx.getArg('to') as BlockPosHelper;
                const block = ctx.getArg('block') as BlockStateHelper;
                areaGlows.push({
                    from,
                    to,
                    id: block.getId()
                });
            }
        }]
    }]
}]);

let tick = 0;
const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    tick += 1;
    if (tick !== 10) {
        return;
    } else {
        tick = 0;
    }

    if (!World.isWorldLoaded()) return;

    for (const glow of areaGlows) {
        const minX = Math.min(glow.from.getX(), glow.to.getX());
        const maxX = Math.max(glow.from.getX(), glow.to.getX());
        const minZ = Math.min(glow.from.getZ(), glow.to.getZ());
        const maxZ = Math.max(glow.from.getZ(), glow.to.getZ());
        const minY = Math.min(glow.from.getY(), glow.to.getY());
        const maxY = Math.max(glow.from.getY(), glow.to.getY());
        const minBlockPos = new BlockPosHelper(minX, minY, minZ);
        const maxBlockPos = new BlockPosHelper(maxX, maxY, maxZ);

        const scanner = World.getWorldScanner().withBlockFilter("getId").is("EQUALS", glow.id).build();
        const locations = scanner.scanCubeAreaInclusive(minBlockPos, maxBlockPos);
        Client.runOnMainThread(JavaWrapper.methodToJava(() => {
            for (const location of locations) {
                glowBlock(location.getX(), location.getY(), location.getZ(), config.areaGlow.color);
            }
        }));
    }
}));

World.isWorldLoaded

wrapper.register();
JsMacros.once('ProfileLoad', JavaWrapper.methodToJava(() => {
    const CommandManager = Chat.getCommandManager();
    CommandManager.unregisterCommand('eareaglow');
    wrapper.register();
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(tickListener);
    wrapper.unregister();

    if (!FS.isDir('./config')) {
        FS.makeDir('./config');
    }

    const file = FS.open('./config/east-tweaks.json', 'utf-8');
    file.write(JSON.stringify(config));
});

export default event;
