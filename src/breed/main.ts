JsMacros.assertEvent(event, 'Key');

const heldItem = Player.getPlayer().getMainHand();
const maxDistance = Player.getReach();

function handleBreeding(...animalsToBreed: string[]) {
    const entities = World.getEntities(maxDistance, ...animalsToBreed);
    const animalsArray: any[] = [];

    for (let i = 0; i < entities.length; i++) {
        if (entities[i].asLiving().isBaby()) continue;
        animalsArray.push(entities[i]);
    }

    for (let i = 0; i < animalsArray.length; i++) {
        Player.getInteractionManager().interactEntity(animalsArray[i], false);
    }
}

switch (heldItem.getItemId()) {
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
        Chat.log('not holding item for breeding');
        break;
}

export default event;
