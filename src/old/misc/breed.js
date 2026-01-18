const playerPos = Player.getPlayer().getPos();
const heldItem = Player.getPlayer().getMainHand();
const MinecraftClient = Client.getMinecraft();
const maxDistance = 4;
const rawPlayer = Player.getPlayer().getRaw();

//chat.log(heldItem.getItemID());

function handleBreeding(...animalsToBreed) {
    const entities = World.getEntities(maxDistance, animalsToBreed);
    const rawItem = heldItem.getRaw();
    const mainHand = rawPlayer.field_6266;
    let animalsArray = [];

    //filter entities in world
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].asLiving().isBaby()) continue;
        animalsArray.push(entities[i]);
    }

    //start breeding
    for (let i = 0; i < animalsArray.length; i++) {
        MinecraftClient.field_1761.method_2905(rawPlayer, animalsArray[i].getRaw(), mainHand); //.interactionManager.interact(player, entity, hand)
    }
}

switch (heldItem.getItemID()) {
    case 'minecraft:wheat':
        handleBreeding('minecraft:sheep', 'minecraft:cow');
        break;
    case 'minecraft:carrot':
        handleBreeding('minecraft:pig');
        break;
    case 'minecraft:wheat_seeds':
    case 'minecraft:pumpkin_seeds':
    case 'minecraft:melon_seeds':
    case 'minecraft:beetroot_seeds':
        handleBreeding('minecraft:chicken');
        break;
    default:
        //chat.log('not holding item for breeding');
        break;
}

export default event;
