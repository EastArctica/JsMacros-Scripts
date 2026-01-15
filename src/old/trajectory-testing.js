// Register an event listener for the tick event
JsMacros.on("Tick", () => {
    // Get the player's held item
    const mainHand = Player.getPlayer().getMainHand();
    
    // Check if the player is holding an ender pearl
    if (mainHand.getItemId() === "minecraft:ender_pearl") {
        // Calculate trajectory points
        const points = calculateTrajectory();
        
        // Draw the trajectory path
        drawTrajectoryPath(points);
    }
});

function calculateTrajectory() {
    const points = [];
    const player = Player.getPlayer();
    
    // Initial position (player's eye position)
    let x = player.getX();
    let y = player.getEyeY();
    let z = player.getZ();
    
    // Initial velocity components
    // Ender pearls are thrown with a velocity of about 1.5
    const velocity = 1.5;
    const pitch = player.getPitch() * (Math.PI / 180);
    const yaw = player.getYaw() * (Math.PI / 180);
    
    let velX = -Math.sin(yaw) * Math.cos(pitch) * velocity;
    let velY = -Math.sin(pitch) * velocity;
    let velZ = Math.cos(yaw) * Math.cos(pitch) * velocity;
    
    // Gravity effect on ender pearls
    const gravity = 0.03;
    // Air resistance
    const drag = 0.99;
    
    // Calculate points along the trajectory
    for (let i = 0; i < 100; i++) {
        points.push([x, y, z]);
        
        // Update position
        x += velX;
        y += velY;
        z += velZ;
        
        // Apply gravity and drag
        velX *= drag;
        velY = (velY - gravity) * drag;
        velZ *= drag;
        
        // Check for collision with blocks
        if (World.getBlock(Math.floor(x), Math.floor(y), Math.floor(z)).getId() !== "minecraft:air") {
            break;
        }
    }
    
    return points;
}

function drawTrajectoryPath(points) {
    // Draw lines between points using World.drawLine()
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        
        // Draw line segments with a color that fades from green to red
        const alpha = 1 - (i / points.length);
        const color = Chat.createColor(
            Math.floor(255 * (1 - alpha)), // Red component increases
            Math.floor(255 * alpha),       // Green component decreases
            0,                             // Blue component
            255                            // Alpha (opacity)
        );
        
        World.drawLine(
            p1[0], p1[1], p1[2],  // Start point
            p2[0], p2[1], p2[2],  // End point
            color,                 // Color
            1,                     // Line width
            true                   // Through walls
        );
    }
}