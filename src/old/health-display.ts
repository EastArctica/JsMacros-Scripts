JsMacros.assertEvent(event, 'Service');

JsMacros.once('ProfileLoad', JavaWrapper.methodToJava((_) => {
    // Register commands
    Chat.log('load')
}));

const tickListener = JsMacros.on('Tick', JavaWrapper.methodToJava((_) => {
    if (!World.isWorldLoaded()) return;
    try {
        for (const entity of World.getEntities()) {
            const healthNbt = entity.getNBT().get('Health');
            if (!healthNbt) continue;
            const ent = entity.asLiving();
            const health = ent.getHealth();
            const maxHealth = ent.getMaxHealth();
            const healthPercentage = health / maxHealth * 100;
            ent.setCustomName(Chat.createTextHelperFromString(`§cHealth: §f${health}§c/§f${maxHealth} §c(${healthPercentage.toFixed(0)}%)`));
        }
    } catch(e) {}
}));

event.stopListener = JavaWrapper.methodToJava((_) => {
    // Unregister commands
    JsMacros.off(tickListener);
});

export default event;
