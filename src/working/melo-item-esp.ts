JsMacros.assertEvent(event, 'Service');

const d2d = Hud.createDraw2D().register();
const d3d = Hud.createDraw3D().register();

/**
 * @param {EntityHelper} entity
 */
function check(entity) {
    if (!entity.is('item')) return;
    for (let i = 0; i < 10; i++) {
        if (!entity.getContainedItemStack().isEmpty()) break;
        Client.waitTick();
    }
    const item = entity.getContainedItemStack();
    if (item.isEmpty()) return;
    const d2de = Hud.createDraw2D();
    // @ts-expect-error Only exists in dynamic-draw (aMelonRind/JsMacros)
    d2d.addWorldPosWrapped(0, 0.5, 0, d2d.addDraw2D(d2de, 0, 0, 1, 1)).setFollowed(entity);
    const name = item.getName();
    d2de.addRect(7, -18, 10 + name.getWidth(), -6, 0x666666, 127);
    d2de.addText(name, 9, -16, 0xffffff, false);
    d2de.addLine(0, 0, 8, -7, 0xffffff, 99).setAlpha(0xbf);
    // @ts-expect-error Only exists in dynamic-draw (aMelonRind/JsMacros)
    d3d.addEntityFollower(d3d.addBox(-0.25, 0, -0.25, 0.25, 0.5, 0.25, 0x00ffff, 0, false), entity);
}

JsMacros.on(
    'EntityLoad',
    JavaWrapper.methodToJava((e) => check(e.entity))
);
World.getEntities('item')?.slice().forEach(check);

event.unregisterOnStop(true, d2d);

export default event;
