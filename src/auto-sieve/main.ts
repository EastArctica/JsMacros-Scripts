JsMacros.assertEvent(event, 'Service');

// Whether to assist with the current sieving, or to continue until no more items are left
const SHOULD_CONTINUE = true;

const sieveRegex = /(exdeorum|exnihilosequentia):[a-z]+_sieve/;

function getSieveProgress(blockPos: BlockPosHelper): number {
    const block = World.getBlock(blockPos);
    if (block == null) {
        return -1;
    }

    const progress = block.getNBT().get('progress');
    if (progress == null) {
        return -1;
    }

    return progress.asNumberHelper().asFloat();
}

// flag to run one extra time after sieving is done to place from our inventory
let flag = false;
function getSieveContents(blockPos: BlockPosHelper): string | null {
    const block = World.getBlock(blockPos);
    if (block == null) {
        if (!flag) flag = true;
        return null;
    }

    let contents = block.getNBT().get('contents');
    if (contents == null) {
        contents = block.getNBT().get('block');
        if (contents == null) {
            if (!flag) flag = true;
            return null;
        }
    }

    const str = contents.asCompoundHelper().get('id').asString();
    if (!str && !flag) flag = true;

    return str;
}

const d3d = Hud.createDraw3D();
d3d.register();

let currentlySieving = false;
let currentlySievingPos = null;
const interactListener = JsMacros.on(
    'InteractBlock',
    JavaWrapper.methodToJava((event) => {
        if (!sieveRegex.test(event.block.getId()) || currentlySieving) {
            return;
        }
        currentlySieving = true;
        Client.waitTick(2);

        const blockPos = event.block.getBlockPos();
        if (!blockPos.equals(currentlySievingPos)) {
            // Location has changed, wipe previous sphere and create new
            d3d.clear();

            // Draw a sphere around the sieve
            const pos1 = blockPos.toPos3D().sub(4.5, 4.5, 4.5);
            const pos2 = blockPos.toPos3D().add(4.5, 4.5, 4.5);
            d3d.addBox(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z, 0xff0000, 0x000000, false);
            currentlySievingPos = blockPos;
        }
        while (getSieveContents(blockPos) || (SHOULD_CONTINUE && flag)) {
            Player.interactions().interactBlock(blockPos.getX(), blockPos.getY(), blockPos.getZ(), 'up', false);
            Client.waitTick(2);
            flag = false;
        }

        currentlySieving = false;
    })
);

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off('InteractBlock', interactListener);
    d3d.unregister();
});

export default event;
