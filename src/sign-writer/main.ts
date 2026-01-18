JsMacros.assertEvent(event, 'Service');

const openScreenListener = JsMacros.on(
    'OpenScreen',
    JavaWrapper.methodToJava((evt) => {
        if (evt.screenName === 'Edit Sign Message') {
            // TODO: I have no idea if these waits are necessary
            Client.waitTick(1);
            Player.writeSign('Line 1', 'Line 2', 'Line 3', 'Line 4');
            Client.waitTick(1);
            // idk there might be a better way here? This is to close the ui
            Player.openInventory().close();
        }
    })
);

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off(openScreenListener);
});

export default event;
