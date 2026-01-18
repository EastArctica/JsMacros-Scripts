JsMacros.assertEvent(event, 'Service');

// Load GraalBridge m
// --- Configuration ---
const channelAndToken = FS.open('webhook_donjons.env').read();
const searchRadius = 30;
const attackRange = 2.5;
const huntTimeout = 3000; // Time in ms to wait for a clear shot before giving up.
const ignoreTargetDuration = 5000; // Time in ms to ignore a stuck target.
const teleportThreshold = 15; // Min distance moved in one tick to be considered a teleport.

// --- Panic Configuration ---
const whitelistedContainerTitles = [
    'Crafting',
    'Chest',
    'Large Chest',
    'Furnace',
    'Survival Inventory',
    'SWORD ENCHANTS',
];

// --- State Variables ---
let lockedTarget = null;
let hasAttackedLockedTarget = false;
let attackAttemptStartTime = 0;
let ignoredEntities = {};
let lastPlayerPos = null;
let isPanicking = false;

// --- Webhook ---
function SendWebhook(username, content) {
    try {
        const webhookURL = `https://discord.com/api/webhooks/${channelAndToken}`;
        const headers = JavaUtils.createHashMap();
        headers.put('Content-Type', 'application/json');
        headers.put('User-Agent', 'JsMacros');
        const payload = JSON.stringify({ username, content });
        Request.post(webhookURL, payload, headers);
    } catch (e) {
        Chat.getLogger().error('Failed to send webhook: ' + e);
    }
}

// --- Utility Functions ---
function log(message) {
    Chat.log(Chat.ampersandToSectionSymbol(`&e[AlexFighter] &r${message}`));
}

function interpolateAngle(current, target, factor) {
    let delta = (target - current) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return current + delta * factor;
}

function hasLineOfSight(entity) {
    const player = Player.getPlayer();
    if (!player || !entity) return false;
    return player.asLiving().canSeeEntity(entity);
}

// --- KeyBind Reimplementation ---
function keyBind(keyBindStr, keyState) {
    const KeyMapping = Java.type('net.minecraft.client.KeyMapping');
    const InputConstants = Java.type('net.minecraft.client.util.InputConstants');
    const KeyTracker = Java.type('net.minecraft.client.KeyTracker');

    const mc = Client.getMinecraft();
    for (const key of mc.options.keyMappings) {
        if (key.getName().equals(keyBindStr)) {
            key.setDown(keyState);
            if (keyState) {
                KeyMapping.click(InputConstants.getKey(key.saveString()));
            }

            // add to pressed keys list
            if (keyState) {
                KeyTracker.press(key);
            } else {
                KeyTracker.unpress(key);
            }
            return;
        }
    }
}

function pressKeyBind(keyBindStr) {
    keyBind(keyBindStr, true);
}

function releaseKeyBind(keyBindStr) {
    keyBind(keyBindStr, false);
}

// --- Panic System ---
function panic(reason) {
    if (isPanicking) return;
    isPanicking = true;

    log(`&cPANIC TRIGGERED: ${reason}`);
    SendWebhook('Hunter Panic', `Panic triggered: ${reason}`);

    releaseKeyBind('key.forward');
    releaseKeyBind('key.sprint');

    // Chat.say("/spawn");

    GlobalVars.putBoolean(file.getPath(), false);
}

function checkForPanicConditions() {
    if (Hud.isContainer()) {
        const inventory = Player.openInventory();
        if (inventory) {
            const title = inventory.getContainerTitle();
            const lowerCaseWhitelist = whitelistedContainerTitles.map((t) => t.toLowerCase());

            if (!lowerCaseWhitelist.includes(title.toLowerCase())) {
                panic(`Unexpected container opened: "${title}"`);
                return true;
            }
        }
    }

    return false;
}
// --- Core Logic Functions ---
function findBestTarget() {
    const player = Player.getPlayer();
    if (!player) return null;

    const now = Time.time();
    for (const uuid in ignoredEntities) {
        if (now - ignoredEntities[uuid] > ignoreTargetDuration) {
            delete ignoredEntities[uuid];
        }
    }

    const entities = Java.from(World.getEntities(searchRadius)).filter((entity) => {
        try {
            if (ignoredEntities[entity.getUUID()]) return false;

            const livingEntity = entity.asLiving();
            if (!livingEntity) return false;

            // FIX: Check if the block below the entity is solid, instead of isOnGround().
            const blockBelow = World.getBlock(livingEntity.getBlockPos().down());
            if (!blockBelow || !blockBelow.getBlockStateHelper().isSolid()) {
                return false;
            }

            const entityName = entity.getName().getString();
            return / (.+)❤$/.test(entityName) && !entityName.startsWith('[AFKMOB]') && !entityName.startsWith('Archer');
        } catch (e) {
            return false;
        }
    });

    if (entities.length === 0) return null;

    const getRarityPriority = (entityName) => {
        const lowerName = entityName.toLowerCase();
        if (lowerName.includes('boss')) return 1;
        if (lowerName.includes('legendary')) return 2;
        if (lowerName.includes('epic')) return 3;
        if (lowerName.includes('rare')) return 4;
        return 5;
    };

    return entities.reduce((best, current) => {
        if (!best) return current;
        const bestRarity = getRarityPriority(best.getName().getString());
        const currentRarity = getRarityPriority(current.getName().getString());
        if (currentRarity < bestRarity) return current;
        if (currentRarity > bestRarity) return best;
        return player.distanceTo(current) < player.distanceTo(best) ? current : best;
    }, null);
}

// --- Main Script ---
function main() {
    const on = GlobalVars.toggleBoolean(file.getPath());
    Chat.actionbar(Chat.ampersandToSectionSymbol(`&e[AlexFighter] &${on ? 'aON' : 'cOFF'}`));

    if (!on) {
        releaseKeyBind('key.forward');
        releaseKeyBind('key.sprint');
        return;
    }

    isPanicking = false;

    const entityUnloadListener = JsMacros.on(
        'EntityUnload',
        JavaWrapper.methodToJava((ev) => {
            if (lockedTarget && ev.entity.equals(lockedTarget)) {
                lockedTarget = null;
            }
        })
    );

    const panicListener = JsMacros.on(
        'RecvMessage',
        JavaWrapper.methodToJava((ev) => {
            const message = ev.text.getString();
            if (message.includes('WARNING: Admin online')) {
                panic('Admin detected via chat!');
            }
        })
    );

    lastPlayerPos = Player.getPlayer()?.getPos();

    while (GlobalVars.getBoolean(file.getPath())) {
        Client.waitTick(1);

        if (checkForPanicConditions()) {
            break;
        }

        const player = Player.getPlayer();
        if (!player) continue;

        const currentPlayerPos = player.getPos();
        if (lastPlayerPos && currentPlayerPos.toVector(lastPlayerPos).getMagnitude() > teleportThreshold) {
            log('&6Teleport detected! Resetting state.');
            lockedTarget = null;
            hasAttackedLockedTarget = false;
            attackAttemptStartTime = 0;
            releaseKeyBind('key.forward');
            releaseKeyBind('key.sprint');
        }
        lastPlayerPos = currentPlayerPos;

        if (lockedTarget) {
            if (!lockedTarget.isAlive()) {
                lockedTarget = null;
                continue;
            }

            if (hasAttackedLockedTarget) {
                continue;
            }

            const vector = lockedTarget.getEyePos().sub(0, 0.5, 0).toVector(player.getEyePos());
            const smoothFactor = 0.3;
            const newYaw = interpolateAngle(player.getYaw(), vector.getYaw(), smoothFactor);
            const newPitch = interpolateAngle(player.getPitch(), vector.getPitch(), smoothFactor);
            player.lookAt(newYaw, newPitch);

            if (player.distanceTo(lockedTarget) > attackRange) {
                pressKeyBind('key.forward');
                pressKeyBind('key.sprint');
                attackAttemptStartTime = 0;
            } else {
                releaseKeyBind('key.forward');
                releaseKeyBind('key.sprint');

                if (player.rayTraceEntity(4)?.equals(lockedTarget)) {
                    Player.interactions().attack(lockedTarget);
                    hasAttackedLockedTarget = true;
                    attackAttemptStartTime = 0;
                } else {
                    if (attackAttemptStartTime === 0) {
                        attackAttemptStartTime = Time.time();
                    }

                    if (Time.time() - attackAttemptStartTime > huntTimeout) {
                        log(
                            `&cImpossible de trouver un angle pour attaquer le mob... ${lockedTarget.getName().getString()} Retargeting.`
                        );
                        ignoredEntities[lockedTarget.getUUID()] = Time.time();
                        lockedTarget = null;
                    }
                }
            }
        } else {
            const newTarget = findBestTarget();
            if (newTarget) {
                lockedTarget = newTarget;
                hasAttackedLockedTarget = false;
                attackAttemptStartTime = 0;
            }
        }
    }

    // --- Cleanup ---
    releaseKeyBind('key.forward');
    releaseKeyBind('key.sprint');
    entityUnloadListener.off();
    panicListener.off();
    Chat.actionbar(Chat.ampersandToSectionSymbol(`&e[AlexFighter] &cOFF`));
}

main();

export default event;
