// import { updateScript } from '../libs/Updater';
// updateScript(file.getAbsolutePath(), 'EastArctica/JsMacros', './config/EastArctica-scripts.json');
import { IconType, type PlannerData } from './types';

Chat.log('Loading Graal Mappings...');
// @ts-expect-error GraalBridge types are missing
Graal.loadMappings('mojmap');

const data: PlannerData = {
    schemaVersion: 1,
    pack: {
        id: 'atm10',
        name: 'All The Mods 10',
        version: '1.7',
        exportedAt: new Date().toISOString(),
    },
    items: [],
    tags: [],
    recipes: [],
    machines: [],
    metadata: {},
};

const mc = Client.getMinecraft();
const regItems = Client.getRegisteredItems();
let i = 0;
for (const item of regItems) {
    if (i++ >= 100) break;
    // Here be dragons, calling mojmap methods directly
    const rawDefaultStack = item.getDefaultStack().getRaw();
    const itemModel = mc.getItemRenderer().getItemModelShaper().getItemModel(rawDefaultStack);
    Chat.log(itemModel.getParticleIcon()?.getAtlasId?.());

    data.items.push({
        id: item.getId(),
        name: item.getName(),
        namespace: item.getId().split(':')[0],
        maxStackSize: item.getDefaultStack().getMaxCount(),
        icon: {
            type: IconType.Texture,
            ref: '',
        },
        modName: 'Example Mod',
    });
}

// Write to disk
const jsonString = JSON.stringify(data, null, 2);
const file = FS.open(`${data.pack.id}-${data.pack.version}-planner-data.json`);
file.write(jsonString);

export default event;
