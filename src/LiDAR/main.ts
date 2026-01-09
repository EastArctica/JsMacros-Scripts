const ClipContext = Java.type('net.minecraft.world.level.ClipContext');

const DEBUG = false;
const RANDOM_OFFSET = DEBUG ? 0 : 5;
const MAX_DISTANCE = DEBUG ? 20 : 10;
const AMOUNT_PER_TICK = 1;
const BASE_MAX_TRACES = 10;

const debug = DEBUG ? Chat.log : (_) => {};

JsMacros.assertEvent(event, 'Service');

// Add mutable distance and offset variables
let currentMaxDistance = MAX_DISTANCE;
let currentRandomOffset = RANDOM_OFFSET;
let currentAmountPerTick = AMOUNT_PER_TICK;

function getTextureColor(blockState, blockPos, hitVec, direction) {
    try {
        const mc = Client.getMinecraft();
        const blockRenderDispatcher = mc.getBlockRenderer();
        const model = blockRenderDispatcher.getBlockModel(blockState);

        // Get all model parts using the level's random source
        const parts = model.collectParts(mc.level.random);

        if (parts.isEmpty()) {
            // Fallback to block color
            return getBlockColorFallback(blockState, blockPos);
        }

        // Get the first part
        const part = parts.get(0);

        // Get quads from the part for the hit face direction
        const quads = part.getQuads(direction);

        if (quads.isEmpty()) {
            // Fallback to block color
            return getBlockColorFallback(blockState, blockPos);
        }

        // Get the first quad
        const quad = quads.get(0);
        const sprite = quad.sprite(); // Access as a record component

        // Calculate UV coordinates based on hit position
        const localX = hitVec.x - blockPos.getX();
        const localY = hitVec.y - blockPos.getY();
        const localZ = hitVec.z - blockPos.getZ();

        // Map to UV based on face direction
        let u, v;
        switch (direction.toString()) {
            case 'up':
                u = localX;
                v = 1 - localZ;
                break;
            case 'down':
                u = localX;
                v = localZ;
                break;
            case 'north':
                u = 1 - localX;
                v = 1 - localY;
                break;
            case 'south':
                u = localX;
                v = 1 - localY;
                break;
            case 'east':
                u = 1 - localZ;
                v = 1 - localY;
                break;
            case 'west':
                u = localZ;
                v = 1 - localY;
                break;
            default:
                u = 0.5;
                v = 0.5;
        }

        debug(
            `Direction: ${direction.toString()}, Local: (${localX.toFixed(2)}, ${localY.toFixed(2)}, ${localZ.toFixed(2)})`
        );
        debug(`UV before clamp: (${u.toFixed(2)}, ${v.toFixed(2)})`);

        // Clamp UV to 0-1
        u = Math.max(0, Math.min(1, u));
        v = Math.max(0, Math.min(1, v));

        debug(`UV after clamp: (${u.toFixed(2)}, ${v.toFixed(2)})`);

        // Get the NativeImage from the sprite contents
        const contents = sprite.contents();
        const nativeImage = contents.byMipLevel[0]; // Get the first mip level (full resolution)

        if (!nativeImage) {
            // Fallback to block color
            return getBlockColorFallback(blockState, blockPos);
        }

        // Calculate pixel coordinates
        const width = nativeImage.getWidth();
        const height = nativeImage.getHeight();
        const texU = Math.floor(u * (width - 1));
        const texV = Math.floor(v * (height - 1));

        debug(`Texture size: ${width}x${height}, Pixel coords: (${texU}, ${texV})`);

        // Sample the pixel color
        const pixelColor = nativeImage.getPixel(texU, texV);

        debug(`Raw pixel color: 0x${pixelColor.toString(16)}`);

        // Convert ABGR to RGB (NativeImage uses ABGR format)
        const r = (pixelColor >> 16) & 0xff;
        const g = (pixelColor >> 8) & 0xff;
        const b = pixelColor & 0xff;

        const finalColor = (r << 16) | (g << 8) | b;
        debug(`Final RGB: 0x${finalColor.toString(16).padStart(6, '0')}\n`);

        return finalColor;
    } catch (e) {
        debug(`Error getting texture color: ${e}`);
        // Fallback to block color
        return getBlockColorFallback(blockState, blockPos);
    }
}

function getBlockColorFallback(blockState, blockPos) {
    try {
        const mc = Client.getMinecraft();
        const blockColors = mc.getBlockColors();

        // Get the tint color for the block (this handles grass, leaves, water, etc.)
        const tintColor = blockColors.getColor(blockState, Player.getPlayer().getRaw().level(), blockPos, 0);

        if (tintColor !== -1) {
            // Convert signed int to unsigned by using & 0xFFFFFF
            return tintColor & 0xffffff;
        }

        // Fall back to map color if no tint color is available
        const mapColor = blockState.getMapColor(Player.getPlayer().getRaw().level(), blockPos);
        return mapColor.col & 0xffffff;
    } catch (e) {
        // If all else fails, return white
        return 0xffffff;
    }
}

function getPseudoRandomTrace(randomOffset: number, maxDistance: number, hitFluids: boolean, avoidPos: unknown[]) {
    for (let attempt = 0; attempt < 10; attempt++) {
        const trace = rayTraceBlock(randomOffset, maxDistance, hitFluids);
        // Try to find a hit that isn't close to avoidPos
        if (trace.getType().toString() === 'MISS') continue;

        const hitVec = trace.getLocation();

        let tooClose = false;
        for (const avoid of avoidPos) {
            if (hitVec.distanceTo(avoid) < 0.2) {
                tooClose = true;
                break;
            }
        }

        if (!tooClose) {
            return trace;
        }
    }

    // If all attempts failed, return the last trace
    return null;
}

function rayTraceBlock(randomOffset: number, maxDistance: number, hitFluids: boolean) {
    const rawPlayer = Player.getPlayer().getRaw();
    const from = rawPlayer.getEyePosition(0);
    const viewVector = rawPlayer.getViewVector(0);
    let to = from.add(viewVector.x * maxDistance, viewVector.y * maxDistance, viewVector.z * maxDistance);
    // Introduce some randomness to the ray trace direction
    to = to.add(
        (Math.random() - 0.5) * randomOffset,
        (Math.random() - 0.5) * randomOffset,
        (Math.random() - 0.5) * randomOffset
    );

    return rawPlayer
        .level()
        .clip(
            new ClipContext(
                from,
                to,
                Java.type('net.minecraft.world.level.ClipContext$Block').OUTLINE,
                hitFluids
                    ? Java.type('net.minecraft.world.level.ClipContext$Fluid').ANY
                    : Java.type('net.minecraft.world.level.ClipContext$Fluid').NONE,
                rawPlayer
            )
        );
}

const traces = [];
const d3d = Hud.createDraw3D();
d3d.register();
let originalGamma: number | null = null;

const scrollListener = JsMacros.on(
    'MouseScroll',
    JavaWrapper.methodToJava((scrollEvent) => {
        const presssedKeys = KeyBind.getPressedKeys();
        const deltaY = scrollEvent.deltaY;
        const isAltPressed =
            presssedKeys.contains('key.keyboard.left.alt') || presssedKeys.contains('key.keyboard.right.alt');
        const isCtrlPressed =
            presssedKeys.contains('key.keyboard.left.control') || presssedKeys.contains('key.keyboard.right.control');
        const isShiftPressed =
            presssedKeys.contains('key.keyboard.left.shift') || presssedKeys.contains('key.keyboard.right.shift');

        if (isAltPressed) {
            // Alt + Scroll: Adjust max distance
            currentMaxDistance = Math.max(1, currentMaxDistance + deltaY);
            Chat.log(`Max Distance: ${currentMaxDistance.toFixed(1)}`);
            scrollEvent.cancel();
        } else if (isCtrlPressed) {
            // Ctrl + Scroll: Adjust random offset
            currentRandomOffset = Math.max(0, currentRandomOffset + deltaY * 0.5);
            Chat.log(`Random Offset: ${currentRandomOffset.toFixed(1)}`);
            scrollEvent.cancel();
        } else if (isShiftPressed) {
            // Shift + Scroll: Adjust amount per tick
            currentAmountPerTick = Math.max(1, currentAmountPerTick + Math.sign(deltaY));
            Chat.log(`Amount Per Tick: ${currentAmountPerTick}`);
            scrollEvent.cancel();
        }
    })
);

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_event) => {
        Client.runOnMainThread(
            JavaWrapper.methodToJava(() => {
                const options = Client.getGameOptions();

                // Store original gamma if not already stored
                if (originalGamma === null) {
                    options.getVideoOptions().setGamma(0); // Set to maximum brightness
                    originalGamma = options.getVideoOptions().getGamma();
                }

                // Trace multiple rays per tick based on currentAmountPerTick
                for (let i = 0; i < currentAmountPerTick; i++) {
                    const hitFluids = Math.random() < 0.5;

                    // const trace = rayTraceBlock(currentRandomOffset, currentMaxDistance, hitFluids);
                    const trace = getPseudoRandomTrace(
                        currentRandomOffset,
                        currentMaxDistance,
                        hitFluids,
                        traces.map((t) => t.hitVec)
                    );
                    if (!trace || trace.getType().toString() === 'MISS') continue;

                    const hitVec = trace.getLocation();
                    const pos3d = PositionCommon.createPos(hitVec.x, hitVec.y, hitVec.z);
                    const blockPos = trace.getBlockPos();
                    const block = World.getBlock(blockPos.getX(), blockPos.getY(), blockPos.getZ());
                    const blockState = block.getRawBlockState();
                    const direction = trace.getDirection();

                    const color = getTextureColor(blockState, blockPos, hitVec, direction);
                    traces.push({
                        hitVec,
                        pos3d,
                        color,
                    });
                }

                // Keep only the last N traces (scales with amount per tick)
                const maxTraces = BASE_MAX_TRACES * currentAmountPerTick;
                while (traces.length > maxTraces) {
                    traces.shift();
                }

                d3d.clear();

                for (const trace of traces) {
                    d3d.addPoint(trace.pos3d, 0.1, trace.color);
                }
            })
        );
    })
);

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off('Tick', tickListener);
    JsMacros.off('MouseScroll', scrollListener);
    d3d.unregister();

    // Restore original gamma
    if (originalGamma !== null) {
        const options = Client.getGameOptions();
        options.getVideoOptions().setGamma(originalGamma);
        originalGamma = null;
    }
});

export default event;
