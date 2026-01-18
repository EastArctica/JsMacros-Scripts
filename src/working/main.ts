// Get all spawners within 1 chunk
const spawnerPositions = World.findBlocksMatching('minecraft:spawner', 1);
// Find which spawners are visible
const playerPos = Player.getPlayer().getBlockPos();
const playerReach = Player.getReach() - 0.5;
const visibleSpawners = spawnerPositions
    .filter((pos3d) => Player.getPlayer().tryFindAngles(pos3d.toBlockPos()) !== null)
    .filter((pos3d) => pos3d.toBlockPos().distanceTo(playerPos) <= playerReach);
