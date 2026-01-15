JsMacros.assertEvent(event, 'Service');
const CommandManager = Chat.getCommandManager();

// Get nearby chunks and check whether they have any 7 or higher gravity black stacks
// If so, print the chunk coordinates and the number of such stacks

CommandManager.unregisterCommand('kille');
const builder = CommandManager.createCommandBuilder('kille')
                              .identifierArg('type')
                              .suggestIdentifier([...new Set(World.getEntities().map(e => e.getType().toString()))])
                              .executes(JavaWrapper.methodToJava((a) => {
                                Chat.say(`/kill @e[type=${a.getArg('type')}]`);
                              }));
builder.register();

event.stopListener = JavaWrapper.methodToJava(() => {
    builder.unregister();

    // if (!FS.isDir('./config')) {
    //     FS.makeDir('./config');
    // }

    // const file = FS.open('./config/east-tweaks.json', 'utf-8');
    // file.write(JSON.stringify(config));
});

export default event;
