JsMacros.assertEvent(event, 'Service');
const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('killaura');

let config = {
    killaura: {
        entities: [],
        // Default to blacklist mode, meaning only entities in the list will be targeted
        whitelist: false,
        enabled: true,
    },
};

if (FS.exists('./config/east-tweaks.json')) {
    let file = FS.open('./config/east-tweaks.json', 'utf-8');
    let readConfig = JSON.parse(file.read());

    config = {
        ...config,
        ...readConfig,
    };
}

const builder = CommandManager.createCommandBuilder('killaura');

builder
    .literalArg('add')
    .identifierArg('entity')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log(`[killaura] Adding ${context.getArg('entity')}`);
            config.killaura.entities.push(context.getArg('entity'));
        })
    )
    .or()
    .or()
    .literalArg('remove')
    .identifierArg('entity')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log(`[killaura] Removing ${context.getArg('entity')}`);
            config.killaura.entities = config.killaura.entities.filter((id) => id != context.getArg('entity'));
        })
    )
    .or()
    .or()
    .literalArg('list')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log(
                `[killaura] ${config.killaura.whitelist ? 'Whitelisted' : 'Blacklisted'} entities: ${config.killaura.entities.join(', ')}`
            );
        })
    );

builder.register();

const entityLoadListener = JsMacros.on(
    'EntityLoad',
    JavaWrapper.methodToJava((evt) => {
        if (!config.killaura.enabled) return;

        if (config.killaura.entities.includes(evt.entity.getName())) {
            Client.runOnMainThread(
                JavaWrapper.methodToJava(() => {
                    // Attack the entity
                    const interactionManager = Player.getInteractionManager();
                    interactionManager.attack(evt.entity);
                })
            );
        }
    })
);

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava(() => {
        if (!config.killaura.enabled) return;
        const player = Player.getPlayer();
        const reach = Player.getReach();

        const killauraEnts = World.getEntities()
            .filter((entity) => {
                return (
                    config.killaura.entities.includes(entity.getType()) == !config.killaura.whitelist &&
                    entity != player &&
                    entity.isAlive() &&
                    entity.distanceTo(player) <= reach
                );
            })
            .sort((a, b) => a.distanceTo(player) - b.distanceTo(player));

        for (const entity of killauraEnts) {
            Client.runOnMainThread(
                JavaWrapper.methodToJava(() => {
                    // Attack the entity
                    const interactionManager = Player.getInteractionManager();
                    interactionManager.attack(entity);
                })
            );
        }
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(entityLoadListener);
    JsMacros.off(tickListener);

    if (!FS.isDir('./config')) {
        FS.makeDir('./config');
    }

    const file = FS.open('./config/east-tweaks.json', 'utf-8');
    file.write(JSON.stringify(config));
});

export default event;
