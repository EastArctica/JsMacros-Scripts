JsMacros.assertEvent(event, 'Service');
const draw3d = Reflection.createClassProxyBuilder(
    Java.type('xyz.wagyourtail.jsmacros.client.api.classes.render.Draw3D') as any
)
    .addMethod(
        'render',
        JavaWrapper.methodToJava((ref: any, args) => {
            draw3d.clear();
            drawTrajectory();
            ref.parent(args);
        })
    )
    .buildInstance([]) as any;
draw3d.register();

function drawTrajectory() {
    const player = Player.getPlayer();
    const inventory = Player.openInventory();
    const heldIdx = inventory.getSelectedHotbarSlotIndex();
    const held = inventory.getSlot(inventory.getMap().hotbar[heldIdx]);

    if (!['minecraft:ender_pearl', 'minecraft:snowball'].includes(held.getItemId())) {
        return;
    }

    // Initial position
    const startX = player.getX();
    const startY = player.getEyePos().getY();
    const startZ = player.getZ();

    // Initial velocity components
    const velocity = 1.5;
    const pitch = player.getPitch() * (Math.PI / 180);
    const yaw = player.getYaw() * (Math.PI / 180);

    // Initial motion
    let motionX = -Math.sin(yaw) * Math.cos(pitch) * velocity;
    let motionY = -Math.sin(pitch) * velocity;
    let motionZ = Math.cos(yaw) * Math.cos(pitch) * velocity;

    // Physics constants
    const gravity = 0.03;
    const airResistance = 0.99;

    let prevX = startX;
    let prevY = startY;
    let prevZ = startZ;

    let x = startX;
    let y = startY;
    let z = startZ;

    for (let i = 0; i < 500; i++) {
        // Apply physics effects to motion first
        motionX *= airResistance;
        motionY = (motionY - gravity) * airResistance;
        motionZ *= airResistance;

        // Update position
        x += motionX;
        y += motionY;
        z += motionZ;

        // Check for collision using rayTrace
        const blockData = World.rayTraceBlock(prevX, prevY, prevZ, x, y, z, false);

        // Draw line segment
        draw3d.addLine(prevX, prevY, prevZ, x, y, z, i % 2 == 0 ? 0xff0000 : 0x00ff00);

        prevX = x;
        prevY = y;
        prevZ = z;

        if (blockData) {
            const block = blockData.getBlock();
            if (block.getId() !== 'minecraft:air') {
                draw3d.addBox(x - 0.2, y - 0.2, z - 0.2, x + 0.2, y + 0.2, z + 0.2, 0xff0000, 0, false);
                break;
            }
        }
    }
}

event.stopListener = JavaWrapper.methodToJava(() => {
    draw3d.unregister();
});

export default event;
