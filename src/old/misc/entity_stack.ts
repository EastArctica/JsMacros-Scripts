JsMacros.assertEvent(event, 'Service');

const d3d = Hud.createDraw3D();

// const tickListener = JsMacros.on("Tick", JavaWrapper.methodToJava(() => {

// Entities within 10 blocks
let ents = World.getEntities(10);
let entLocs: Map<string, number> = new Map();
for (const ent of ents) {
    let pos = ent.getBlockPos();
    let posStr = `${pos.getX()},${pos.getY()},${pos.getZ()}`;
    entLocs.set(posStr, entLocs.has(posStr) ? entLocs.get(posStr) + 1 : 1);
}

for (const [pos, count] of entLocs) {
    let splitPos = pos.split(',');
    let [x, y, z] = [+splitPos[0], +splitPos[1], +splitPos[2]].map((n) => n + 0.5);

    // TODO: Aim towards eye
    let surface = d3d.addDraw2D(x, y, z);
    surface.addText('Test: ' + count, 0, 0, 0xffffff, true);
}
// }));

d3d.register();

// this fires when the service is stopped
event.stopListener = JavaWrapper.methodToJava(() => {
    d3d.unregister();
    // JsMacros.off(tickListener);
});
