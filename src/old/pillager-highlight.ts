World.getEntities()?.forEach(
    JavaWrapper.methodToJava((entity: PillagerEntityHelper) => {
        if (entity.getType() !== 'minecraft:pillager') return;
        if (entity.isCaptain()) {
            entity.setGlowing(true);
        }
    })
);

JsMacros.on(
    'EntityLoad',
    JavaWrapper.methodToJava((event) => {
        if (event.entity.getType() !== 'minecraft:pillager') return;
        if (event.entity.isCaptain()) {
            event.entity.setGlowing(true);
        }
    })
);

export default event;
