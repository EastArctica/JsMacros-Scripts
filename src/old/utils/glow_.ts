// Load mapping helper
const modLoader = Client.getModLoader();
const version = Client.mcVersion();
// https://maven.fabricmc.net/net/fabricmc/yarn/1.21.4%2Bbuild.8/yarn-1.21.4%2Bbuild.8-v2.jar

const mappings = Reflection.loadMappingHelper("https://maven.fabricmc.net/net/fabricmc/yarn/1.21.4%2Bbuild.8/yarn-1.21.4%2Bbuild.8-v2.jar");

const world = World.getRaw(); // ClientLevel
const remappedWorld = mappings.remapClass(world);
const DISCARDED = mappings.getClass("net.minecraft.entity.Entity$RemovalReason").getFieldValue("DISCARDED");

const ShulkerEntityHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.specialized.mob.ShulkerEntityHelper');
const ShulkerEntity = mappings.getClass("net.minecraft.entity.monster.Shulker").getRawClass();
const ShulkerEntityType = (Java.type('net.minecraft.entity.EntityType') as any).field_6109;

export function glowBlock(x: number, y: number, z: number, color: number = 0xFFFFFF) {
    x = Math.floor(x) + 0.5;
    y = Math.floor(y);
    z = Math.floor(z) + 0.5;

    const entity = new ShulkerEntity(ShulkerEntityType, world);
    Chat.log('Created Entity');
    const remappedEnt = mappings.remapClass(entity);
    const entHelper = new ShulkerEntityHelper(entity);
    entHelper.setGlowing(true);
    entHelper.setGlowingColor(color);
    Chat.log('Setup glow');
    remappedEnt.invokeMethod('m_20343_', x, y, z);
    // These were also having issues
    // remappedEnt.invokeMethod('m_6842_', true);
    // remappedEnt.invokeMethod('m_20331_', true);
    // remappedEnt.setFieldValue('f_19794_', true);
    Chat.log(world);
    Chat.log(remappedWorld);
    // Neither of these work
    Chat.log('Attempting all methods')

    // Either of these work
    remappedWorld.invokeMethod('m_104739_', [10000, entity]);
    // remappedWorld.invokeMethod('m_104739_', 10000, entity);

    // try { remappedWorld.invokeMethod('addEntity', [10000, entity]) } catch(e) { Chat.log('3: ' + e)}
    // try { remappedWorld.invokeMethodAsClass("net.minecraft.client.multiplayer.ClientLevel", "addEntity", [10000, entity]); } catch(e) { Chat.log('4: ' + e)}
    
    // try { remappedWorld.invokeMethod('addEntity', 10000, entity) } catch(e) { Chat.log('5: ' + e)}
    // try { remappedWorld.invokeMethodAsClass("net.minecraft.client.multiplayer.ClientLevel", "addEntity", 10000, entity); } catch(e) { Chat.log('6: ' + e)}

    Chat.log('Attempted all methods')
    return () => {
        Chat.log('Removing')
        // remappedEnt.invokeMethod('remove', DISCARDED);
    }
}
