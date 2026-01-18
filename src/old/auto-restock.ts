JsMacros.assertEvent(event, 'Service');

// net.minecraft.util.Hand
const Hand = Java.type('net.minecraft.class_1268');
const MAIN_HAND = Hand.field_5808 as typeof Hand;
const OFF_HAND = Hand.field_5810 as typeof Hand;
const InventoryUtils = Java.type('fi.dy.masa.malilib.util.InventoryUtils') as {
    // player is EntityPlayer
    preRestockHand(player: any, hand: typeof Hand, threshold: number, allowHotbar: boolean): void;
};

JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((evt, ctx) => {
        ctx.releaseLock();
        const interactionManager = Player.getInteractionManager();
        if (!interactionManager || !World.isWorldLoaded()) return;

        InventoryUtils.preRestockHand(Player.getPlayer().getRaw(), OFF_HAND, 48, true);
    })
);

export default event;
