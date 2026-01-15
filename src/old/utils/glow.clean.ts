const mapping = Reflection.loadMappingHelper("https://maven.fabricmc.net/net/fabricmc/yarn/1.21%2Bbuild.9/yarn-1.21%2Bbuild.9-v2.jar");
function autoProxy(target) {
    try {
        return new Proxy(target, {
            get(target, prop) {
                const remappedClass = target["getClass"] ? mapping.remapClass(target) : mapping.getClass(target.class.getName());
                if (remappedClass) {
                    try {
                        return autoProxy(remappedClass.getFieldValue(String(prop)));
                    }
                    catch (e) {
                        return function (...args) {
                            return autoProxy(remappedClass.invokeMethod(String(prop), args));
                        };
                    }
                }
                else {
                    return target[prop];
                }
            }
        });
    }
    catch (e) {
        return target;
    }
}

const BetterJava = new Proxy(Java, {
    get(target, prop, receiver) {
        if (prop == 'type') {
            return function (...args) {
                const typeName = mapping.getReversedMappings().get(args[0].replaceAll(".", "/"))?.name.replaceAll("/", ".") || args[0];
                return autoProxy(target.type.apply(target, [typeName]));
            };
        }
        return target[prop];
    }
});

const world = Client.getMinecraft().world; // needs to be proxied
const DISCARDED = (BetterJava.type('net.minecraft.entity.Entity$RemovalReason') as any).DISCARDED;
Chat.log(DISCARDED);

const ShulkerEntityHelper = Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.specialized.mob.ShulkerEntityHelper;
const ShulkerEntity = BetterJava.type('net.minecraft.entity.mob.ShulkerEntity') as any;
const ShulkerEntityType = (BetterJava.type('net.minecraft.entity.EntityType') as any).SHULKER;
Chat.log(ShulkerEntity);
Chat.log(ShulkerEntityType);

export function glowBlock(x: number, y: number, z: number, color: number = 0xFFFFFF) {
    x = Math.floor(x) + 0.5;
    y = Math.floor(y);
    z = Math.floor(z) + 0.5;

    const entity = new ShulkerEntity(ShulkerEntityType, world);
    const entHelper = new ShulkerEntityHelper(entity);
    entHelper.setGlowing(true);
    entHelper.setGlowingColor(color);
    entity.setPosition(x, y, z); // Entity.setPosition
    entity.setInvisible(true); // Entity.setInvisible
    entity.setInvulnerable(true); // Entity.setInvulnerable
    entity.noClip = true; // Entity.noClip
    world.addEntity(entity); // World.addEntity

    return () => {
        entity.method_5650(DISCARDED); // Entity.remove
    }
}
