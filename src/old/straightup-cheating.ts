const FORCE_REACH = 5;

JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava(() => {
        const interactionManager = Player.getInteractionManager();
        if (!interactionManager || !World.isWorldLoaded()) return;

        const c1 = Player.getPlayer().getPos().add(FORCE_REACH, 0, FORCE_REACH);
        c1.y = 16;
        const c2 = Player.getPlayer().getPos().add(-FORCE_REACH, 0, -FORCE_REACH);
        c2.y = 17;

        World.iterateBox(
            c1.toBlockPos(),
            c2.toBlockPos(),
            JavaWrapper.methodToJava((block) => {
                if (block.getId() == 'minecraft:netherrack') {
                    const blockPos = block.getBlockPos();
                    const x = blockPos.getX();
                    const y = blockPos.getY();
                    const z = blockPos.getZ();
                    interactionManager.breakBlock(x, y, z);
                }
            })
        );
    })
);
