if (GlobalVars.getBoolean('autofarm')) {
    GlobalVars.putBoolean('autofarm', false);
} else {
    GlobalVars.putBoolean('autofarm', true);
    KeyBind.pressKeyBind('key.use');
    KeyBind.pressKeyBind('key.ftbultimine');
    while (GlobalVars.getBoolean('autofarm')) {
        Client.waitTick(1);
        KeyBind.pressKeyBind('key.sneak');
        Client.waitTick(1);
        KeyBind.releaseKeyBind('key.sneak');
    }
    KeyBind.releaseKeyBind('key.use');
    KeyBind.releaseKeyBind('key.ftbultimine');
}

export default event;
