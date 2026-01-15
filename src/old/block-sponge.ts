import CommandBuilderWrapper from './utils/CommandBuilderWrapper';

JsMacros.assertEvent(event, 'Service');

const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('pave');

let config = {
    blockSponge: {
        block: 'minecraft:stone',
        range: 5,
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

let continous = false;
let liquid = '';
const wrapper = new CommandBuilderWrapper('block-sponge');
wrapper.processCommands([{
    literalArg: 'config',
    children: [{
        literalArg: 'range',
        executes: (ctx) => Chat.log(`Current range: ${config.blockSponge.range}`),
        children: [{
            intArg: 'range',
            executes: (ctx) => {
                Chat.log(`Moving range from ${config.blockSponge.range} to ${ctx.getArg('range')}`);
                config.blockSponge.range = ctx.getArg('range');
            }
        }]
    }]
}, {
    literalArg: 'remove',
    children: [{
        blockArg: 'liquid',
        executes: (ctx) => {
            let liquid = ctx.getArg('liquid');
            let count = 0;
            World.iterateSphere(Player.getPlayer().getBlockPos(), config.blockSponge.range, false, JavaWrapper.methodToJava((block) => {
                if (block.getId() == liquid.getId() && block.getBlockStateHelper()?.getFluidState()?.isStill()) {
                    count++;
                    Player.getInteractionManager().interactBlock(block.getBlockPos().getX(), block.getBlockPos().getY(), block.getBlockPos().getZ(), 0, true);
                }
            }));
            Chat.log(`Removed ${count} ${liquid.getId()} blocks`);
        }
    }]
}, {
    literalArg: 'continuous',
    children: [{
        blockArg: 'liquid',
        executes: (ctx) => {
            liquid = ctx.getArg('liquid').getId();
            continous = true;
        }
    }]
}]);
wrapper.register();

JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    if (!continous) return;

    World.iterateSphere(Player.getPlayer().getBlockPos(), config.blockSponge.range, false, JavaWrapper.methodToJava((block) => {
        if (block.getId() == liquid && block.getBlockStateHelper()?.getFluidState()?.isStill()) {
            Player.getInteractionManager().interactBlock(block.getBlockPos().getX(), block.getBlockPos().getY(), block.getBlockPos().getZ(), 0, true);
        }
    }));
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    wrapper.unregister();

    if (!FS.isDir('./config')) {
        FS.makeDir('./config');
    }

    const file = FS.open('./config/east-tweaks.json', 'utf-8');
    file.write(JSON.stringify(config));
});

export default event;
