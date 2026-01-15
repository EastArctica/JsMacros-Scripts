const world = Client.getMinecraft().field_1687;
const DISCARDED = Java.type('net.minecraft.class_1297').class_5529.field_26999; // Entity.RemovalReason.DISCARDED

const ShulkerEntityHelper = Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.specialized.mob.ShulkerEntityHelper;
const ShulkerEntity = Java.type('net.minecraft.class_1606'); // ShulkerEntity
const ShulkerEntityType = Java.type('net.minecraft.class_1299').field_6109; // EntityType.SHULKER

const BlockDisplayEntityHelper = Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.specialized.display.BlockDisplayEntityHelper;
const BlockDisplayEntity = Java.type('net.minecraft.class_8113').class_8115; // DisplayEntity.BlockDisplayEntity
const BlockDisplayEntityType = Java.type('net.minecraft.class_1299').field_42460; // EntityType.BLOCK_DISPLAY

export function glowBlock(x: number, y: number, z: number, color: number = 0xFFFFFF) {
    x = Math.floor(x) + 0.5;
    y = Math.floor(y);
    z = Math.floor(z) + 0.5;

    // const entity = new BlockDisplayEntity(EntityType.field_42460, world);
    // const entHelper = new BlockDisplayEntityHelper(entity);
    const entity = new ShulkerEntity(ShulkerEntityType, world);
    const entHelper = new ShulkerEntityHelper(entity);
    entHelper.setGlowing(true);
    entHelper.setGlowingColor(color);
    entity.method_5814(x, y, z); // Entity.setPosition
    entity.method_5648(true); // Entity.setInvisible
    entity.method_5684(true); // Entity.setInvulnerable
    entity.field_5960 = true; // Entity.noClip
    world.method_53875(entity); // World.addEntity

    const entUUID = entHelper.getUUID();
    return () => {
        if (!World.getEntities()) {
            Chat.log('World.getEntities() is not available');
            return false;
        }
        let ent = World.getEntities().find(ent => ent.getUUID() == entUUID);
        ent.getRaw().method_5650(DISCARDED);
        return true;
    }
}
