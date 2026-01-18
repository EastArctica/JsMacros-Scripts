JsMacros.assertEvent(event, 'Service');

const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('doggo-utils');

enum Mode {
    SIT,
    STAND,
    OFF,
}
let currentMode = Mode.OFF;

const builder = CommandManager.createCommandBuilder('doggo-utils')
    .literalArg('sit')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log('[doggo-utils] Sitting all nearby dogs');
            currentMode = Mode.SIT;
        })
    )
    .or()
    .literalArg('stand')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log('[doggo-utils] Standing all nearby dogs');
            currentMode = Mode.STAND;
        })
    )
    .or()
    .literalArg('stop')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log('[doggo-utils] Stopping');
            currentMode = Mode.OFF;
        })
    );

builder.register();

// TODO: Reset on server disconnect
let dogStates = new Map<string, [boolean, number]>();
JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava(() => {
        if (currentMode === Mode.OFF) {
            return;
        }
        let player = Player.getPlayer();

        let entities = World.getEntities();
        entities.forEach(
            JavaWrapper.methodToJava((entity) => {
                let rawEntity = entity.getRaw();

                if (entity.getType() === 'minecraft:wolf') {
                    let dogState = dogStates.get(entity.getUUID());
                    let isSitting = rawEntity.method_6172(); // TameableEntity.isInSittingPose()
                    let bodyArmor = rawEntity.method_56676(); // MobEntity.getBodyArmor()

                    // Ensure dog state is initialized
                    if (dogState === undefined) {
                        dogState = [isSitting, Date.now()];
                    }
                    // Check if dog state is too old
                    if (Date.now() - dogState[1] > 2_500) {
                        dogStates.set(entity.getUUID(), [isSitting, Date.now()]);
                    }

                    if (entity.distanceTo(player) > Player.getReach()) {
                        return;
                    }

                    if (isSitting && currentMode === Mode.STAND && (dogState === undefined || dogState[0] === true)) {
                        player.interactEntity(entity, false);
                        dogStates.set(entity.getUUID(), [false, Date.now()]);
                    }

                    if (!isSitting && currentMode === Mode.SIT && (dogState === undefined || dogState[0] === false)) {
                        player.interactEntity(entity, false);
                        dogStates.set(entity.getUUID(), [true, Date.now()]);
                    }

                    // Chat.log(bodyArmor);
                }
            })
        );
    })
);

export default event;
