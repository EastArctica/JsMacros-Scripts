// services start with minecraft, when enabled and are meant to be persistent scripts.
JsMacros.assertEvent(event, 'Service');

const d2d = Hud.createDraw2D();
let tpsmeter = null;

d2d.setOnInit(
    JavaWrapper.methodToJava(() => {
        let tps = World.getServerTPS();
        if (!tps) {
            return;
        }

        tpsmeter = d2d.addText(tps, 0, d2d.getHeight() - 10, 0xffffff, true);
    })
);

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava(() => {
        let tps = World.getServerTPS();
        if (!tps) {
            return;
        }

        tpsmeter?.setText(tps);
    })
);

d2d.register();

// this fires when the service is stopped
event.stopListener = JavaWrapper.methodToJava(() => {
    d2d.unregister();
    JsMacros.off(tickListener);
});
