// typescript likes this
JsMacros.assertEvent(event, "Service");

// register draw3d for block outlines
const d3d = Hud.createDraw3D();
d3d.register();

// draw if not yet drawn :dddd
JsMacros.on("RecvPacket", JsMacros.createEventFilterer("RecvPacket").setType("ParticleS2CPacket"), JavaWrapper.methodToJava(ev => {
    const x = Math.floor(ev.packet.method_11544());
    const y = Math.floor(ev.packet.method_11547());
    const z = Math.floor(ev.packet.method_11546());
    const block = World.getBlock(Math.floor(x), Math.floor(y), Math.floor(z));
    const blockId = block.getId();

    // second part of the if checks if not already drawn
    if (blockId === "minecraft:ancient_debris" && !d3d.getBoxes().some(box => box.pos.getStart().equals(block.getBlockPos().toPos3D()))) {
        // everything checked, draw the outline
        d3d.boxBuilder(block.getBlockPos()).color(0x00FF00).buildAndAdd();
    }
}));

// remove the box for this block since it was broken
JsMacros.on("BlockUpdate", JavaWrapper.methodToJava(ev => {
    const box = d3d.getBoxes().find(box => box.pos.getStart().equals(ev.block.getBlockPos().toPos3D()));

    if (box) {
        // bye useless box
        d3d.removeBox(box);
    }
}));

// bye draw3d
event.unregisterOnStop(true, d3d);