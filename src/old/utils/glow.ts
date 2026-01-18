const RenderQueue = Java.type('net.earthcomputer.clientcommands.render.RenderQueue');
const Box = Java.type('net.minecraft.class_238'); // I hate this reliance
Chat.log(RenderQueue);

const DISCARDED = Java.type('net.minecraft.class_1297').class_5529.field_26999; // Entity.RemovalReason.DISCARDED

export function glowBlock(x: number, y: number, z: number, color: number = 0xffffff) {
    const world = Client.getMinecraft().field_1687;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);

    const block = World.getBlock(x, y, z);
    if (!block) return () => false;
    const blockPos = block.getBlockPos();
    const rawBlockPos = blockPos.getRaw();

    const state = block.getBlockStateHelper().getRaw();
    let shapes = state.method_26218(world, rawBlockPos).method_1090(); // BlockState.getOutlineShape().getBoundingBoxes()
    if (shapes.length == 0) {
        shapes.push(new Box(rawBlockPos));
    } else {
        shapes = shapes.map((shape) => shape.method_60314(blockPos.toPos3D().toVector().toMojangFloatVector())); // Box.offset
    }

    for (const cubiod of shapes) {
        // @ts-ignore gay
        RenderQueue.addCuboid(RenderQueue.Layer.ON_TOP, cubiod, cubiod, color, 20);
    }

    return () => {
        return true;
    };
}
