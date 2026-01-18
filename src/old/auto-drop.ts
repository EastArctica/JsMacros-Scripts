JsMacros.assertEvent(event, 'Service');
const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('auto-drop');

let config = {
    autoDrop: {
        bannedIDs: ['minecraft:rotten_flesh'],
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

const builder = CommandManager.createCommandBuilder('auto-drop');

builder
    .literalArg('add')
    .itemArg('item')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log(`[auto-drop] Banning ${context.getArg('item').getItemId()}`);
            config.autoDrop.bannedIDs.push(context.getArg('item').getItemId());
        })
    )
    .or()
    .or()
    .literalArg('remove')
    .itemArg('item')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log(`[auto-drop] Unbanning ${context.getArg('item').getItemId()}`);
            config.autoDrop.bannedIDs = config.autoDrop.bannedIDs.filter(
                (id) => id != context.getArg('item').getItemId()
            );
        })
    )
    .or()
    .or()
    .literalArg('list')
    .executes(
        JavaWrapper.methodToJava((context) => {
            Chat.log(`[auto-drop] Banned items: ${config.autoDrop.bannedIDs.join(', ')}`);
        })
    );

builder.register();

const itemPickupListener = JsMacros.on(
    'ItemPickup',
    JavaWrapper.methodToJava((evt) => {
        if (config.autoDrop.bannedIDs.includes(evt.item.getItemId())) {
            // Get slot from item
            const inv = Player.openInventory();
            const slots = inv.findItem(evt.item);
            if (slots == undefined || slots.length == 0) {
                Chat.log(`Could not find slot for ${evt.item}`);
                return;
            }

            // Find the slot that matches what what we picked up (must have at least as many items)
            let slot = slots[0];
            for (let i = 0; i < slots.length; i++) {
                if (inv.getSlot(slots[i]).getCount() >= evt.item.getCount()) {
                    slot = slots[i];
                    break;
                }
            }

            Client.runOnMainThread(
                JavaWrapper.methodToJava(() => {
                    for (let i = 0; i < evt.item.getCount(); i++) {
                        if (inv.getSlot(slot).getItemId() != evt.item.getItemId()) {
                            return;
                        }
                        inv.dropSlot(slot);
                    }
                })
            );
        }
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(itemPickupListener);

    if (!FS.isDir('./config')) {
        FS.makeDir('./config');
    }

    const file = FS.open('./config/east-tweaks.json', 'utf-8');
    file.write(JSON.stringify(config));
});

export default event;
