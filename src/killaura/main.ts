import CommandBuilderWrapper from '../libs/CommandBuilderWrapper';
import Config from '../libs/Config';
const PhantomEntityHelper =
    Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.specialized.mob.PhantomEntityHelper;
// @ts-expect-error from Etheradon/GraalBridge
Graal.loadMappings('mojmap');

JsMacros.assertEvent(event, 'Service');

const config = Config.readConfig(
    './config/eastarctica.json',
    {
        enabled: false,
        range: 4.5,
        fov: 360,
        throughWalls: false,
        attackDelay: 0,
        autoSwitch: false,
        targetMode: 'Closest',
    },
    'killaura'
);

const wrapper = new CommandBuilderWrapper('killaura')
    .processCommands([
        {
            literalArg: 'toggle',
            executes: (ctx) => {
                config.enabled = !config.enabled;
                Chat.log(`Killaura ${config.enabled ? 'enabled' : 'disabled'}.`);
            },
        },
        {
            literalArg: 'set',
            children: [
                {
                    literalArg: 'range',
                    doubleArg: { name: 'value', min: 1.0, max: 10.0 },
                    executes: (ctx) => {
                        const value = ctx.getArg('value');
                        config.range = value;
                        Chat.log(`Killaura range set to ${value}.`);
                    },
                },
                {
                    literalArg: 'fov',
                    intArg: { name: 'value', min: 30, max: 360 },
                    executes: (ctx) => {
                        const value = ctx.getArg('value');
                        config.fov = value;
                        Chat.log(`Killaura FOV set to ${value}.`);
                    },
                },
                {
                    literalArg: 'throughWalls',
                    booleanArg: 'value',
                    executes: (ctx) => {
                        const value = ctx.getArg('value');
                        config.throughWalls = value;
                        Chat.log(`Killaura throughWalls set to ${value}.`);
                    },
                },
                {
                    literalArg: 'attackDelay',
                    intArg: { name: 'value', min: 0, max: 20 },
                    executes: (ctx) => {
                        const value = ctx.getArg('value');
                        config.attackDelay = value;
                        Chat.log(`Killaura attackDelay set to ${value}.`);
                    },
                },
                {
                    literalArg: 'autoSwitch',
                    booleanArg: 'value',
                    executes: (ctx) => {
                        const value = ctx.getArg('value');
                        config.autoSwitch = value;
                        Chat.log(`Killaura autoSwitch set to ${value}.`);
                    },
                },
                {
                    literalArg: 'targetMode',
                    wordArg: 'value',
                    executes: (ctx) => {
                        const value = ctx.getArg('value');
                        config.targetMode = value;
                        Chat.log(`Killaura targetMode set to ${value}.`);
                    },
                },
            ],
        },
    ])
    .register();

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava(() => {
        if (!config.enabled) return;

        // get nearby enemies
        const allEntities = World.getEntities()
            .toArray()
            .filter((entity) => {
                return entity.getType() === 'minecraft:phantom';
            });

        for (const entity of allEntities) {
            // TODO: Calculate from eyes
            if (entity.distanceTo(Player.getPlayer()) <= config.range) {
                // Attack the entity
                Player.interactions().attack(entity);
            }
        }
    })
);

event.stopListener = JavaWrapper.methodToJava((_) => {
    wrapper.unregister();
    JsMacros.off('Tick', tickListener);
});

export default event;
