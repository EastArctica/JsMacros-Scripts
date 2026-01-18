import CommandBuilderWrapper from './utils/CommandBuilderWrapper';

JsMacros.assertEvent(event, 'Service');

const CommandManager = Chat.getCommandManager();
CommandManager.unregisterCommand('pave');

let config = {
    highwayPaver: {
        highways: [],
        // Y value of base floor obsidian
        height: 119,
        width: 5,
        blacklistRange: 10,
        breakBlocks: true,
        enabled: true,
    },
};

if (FS.exists('./config/east-tweaks.json')) {
    let file = FS.open('./config/east-tweaks.json', 'utf-8');
    let readConfig = JSON.parse(file.read());

    config = {
        ...config,
        ...readConfig,
    };
}

const wrapper = new CommandBuilderWrapper('pave');
wrapper.processCommands([
    {
        literalArg: 'config',
        children: [
            {
                literalArg: 'height',
                executes: (ctx) => Chat.log(`Current height: ${config.highwayPaver.height}`),
                children: [
                    {
                        intArg: 'height',
                        executes: (ctx) => {
                            Chat.log(`Moving height from ${config.highwayPaver.height} to ${ctx.getArg('height')}`);
                            config.highwayPaver.height = ctx.getArg('height');
                        },
                    },
                ],
            },
            {
                literalArg: 'width',
                executes: (ctx) => Chat.log(`Current width: ${config.highwayPaver.width}`),
                children: [
                    {
                        intArg: 'width',
                        executes: (ctx) => {
                            Chat.log(`Moving width from ${config.highwayPaver.width} to ${ctx.getArg('width')}`);
                            config.highwayPaver.width = ctx.getArg('width');
                        },
                    },
                ],
            },
            {
                literalArg: 'break-blocks',
                executes: (ctx) => Chat.log(`Current break blocks: ${config.highwayPaver.breakBlocks}`),
                children: [
                    {
                        booleanArg: 'breakBlocks',
                        executes: (ctx) => {
                            Chat.log(
                                `Moving break blocks from ${config.highwayPaver.breakBlocks} to ${ctx.getArg('breakBlocks')}`
                            );
                            config.highwayPaver.breakBlocks = ctx.getArg('breakBlocks');
                        },
                    },
                ],
            },
            {
                literalArg: 'status',
                executes: (ctx) => {
                    let status = '';
                    status += `Enabled: ${config.highwayPaver.enabled}\n`;
                    status += `Height: ${config.highwayPaver.height}\n`;
                    status += `Width: ${config.highwayPaver.width}\n`;
                    status += `Break blocks: ${config.highwayPaver.breakBlocks}\n`;
                    status += `Total highways: ${config.highwayPaver.highways.length}\n`;
                    Chat.log(status);
                },
            },
            {
                literalArg: 'enable',
                executes: (ctx) => {
                    Chat.log('Enabling highway paver');
                    config.highwayPaver.enabled = true;
                },
            },
            {
                literalArg: 'disable',
                executes: (ctx) => {
                    Chat.log('Disabling highway paver');
                    config.highwayPaver.enabled = false;
                },
            },
            {
                literalArg: 'list',
                executes: (ctx) => {
                    if (config.highwayPaver.highways.length == 0) {
                        Chat.log('No highways');
                        return;
                    }

                    let highways = '';
                    for (const highway of config.highwayPaver.highways) {
                        highways += `${highway.direction}`;
                        if (highway.center !== undefined) highways += ` at center ${highway.center}`;
                        if (highway.radius !== undefined) highways += ` at radius ${highway.radius}`;
                        highways += '\n';
                    }
                    Chat.log(highways);
                },
            },
            {
                literalArg: 'clear',
                executes: (ctx) => {
                    Chat.log('Clearing highways');
                    config.highwayPaver.highways = [];
                },
            },
        ],
    },
    {
        literalArg: 'cardinal',
        children: [
            {
                literalArg: 'north',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'north', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => addHighway({ direction: 'north', center: ctx.getArg('center') }),
                            },
                        ],
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'north', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => removeHighway({ direction: 'north', center: ctx.getArg('center') }),
                                suggest: (ctx, suggestionHelper) =>
                                    suggestionHelper.suggestMatching(
                                        config.highwayPaver.highways
                                            .filter((h) => h.direction === 'north')
                                            .map((h) => h.center.toString())
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                literalArg: 'south',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'south', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => addHighway({ direction: 'south', center: ctx.getArg('center') }),
                            },
                        ],
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'south', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => removeHighway({ direction: 'south', center: ctx.getArg('center') }),
                                suggest: (ctx, suggestionHelper) =>
                                    suggestionHelper.suggestMatching(
                                        config.highwayPaver.highways
                                            .filter((h) => h.direction === 'south')
                                            .map((h) => h.center.toString())
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                literalArg: 'east',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'east', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => addHighway({ direction: 'east', center: ctx.getArg('center') }),
                            },
                        ],
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'east', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => removeHighway({ direction: 'east', center: ctx.getArg('center') }),
                                suggest: (ctx, suggestionHelper) =>
                                    suggestionHelper.suggestMatching(
                                        config.highwayPaver.highways
                                            .filter((h) => h.direction === 'east')
                                            .map((h) => h.center.toString())
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                literalArg: 'west',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'west', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => addHighway({ direction: 'west', center: ctx.getArg('center') }),
                            },
                        ],
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'west', center: 0 }),
                        children: [
                            {
                                intArg: 'center',
                                executes: (ctx) => removeHighway({ direction: 'west', center: ctx.getArg('center') }),
                                suggest: (ctx, suggestionHelper) =>
                                    suggestionHelper.suggestMatching(
                                        config.highwayPaver.highways
                                            .filter((h) => h.direction === 'west')
                                            .map((h) => h.center.toString())
                                    ),
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        literalArg: 'orbital',
        children: [
            {
                literalArg: 'add',
                children: [
                    {
                        intArg: 'radius',
                        executes: (ctx) => addHighway({ direction: 'orbital', radius: ctx.getArg('radius') }),
                    },
                ],
            },
            {
                literalArg: 'remove',
                children: [
                    {
                        intArg: 'radius',
                        executes: (ctx) => removeHighway({ direction: 'orbital', radius: ctx.getArg('radius') }),
                        suggest: (ctx, suggestionHelper) =>
                            suggestionHelper.suggestMatching(
                                config.highwayPaver.highways
                                    .filter((h) => h.direction === 'orbital')
                                    .map((h) => h.radius.toString())
                            ),
                    },
                ],
            },
        ],
    },
    {
        literalArg: 'diagonal',
        children: [
            {
                literalArg: 'northwest',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'northwest' }),
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'northwest' }),
                    },
                ],
            },
            {
                literalArg: 'northeast',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'northeast' }),
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'northeast' }),
                    },
                ],
            },
            {
                literalArg: 'southwest',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'southwest' }),
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'southwest' }),
                    },
                ],
            },
            {
                literalArg: 'southeast',
                children: [
                    {
                        literalArg: 'add',
                        executes: (ctx) => addHighway({ direction: 'southeast' }),
                    },
                    {
                        literalArg: 'remove',
                        executes: (ctx) => removeHighway({ direction: 'southeast' }),
                    },
                ],
            },
        ],
    },
]);
wrapper.register();

function removeHighway({
    direction,
    center,
    radius,
}: {
    direction: 'north' | 'south' | 'east' | 'west' | 'northwest' | 'northeast' | 'southwest' | 'southeast' | 'orbital';
    center?: number;
    radius?: number;
}) {
    let highway = config.highwayPaver.highways.find(
        (h) => h.direction === direction && (center ? h.center === center : h.radius === radius)
    );
    if (!highway) {
        Chat.log(`No ${direction} highway at ${center}`);
        return;
    }

    config.highwayPaver.highways.splice(config.highwayPaver.highways.indexOf(highway), 1);
    let msg = `Removed ${direction} highway`;
    if (center !== undefined) msg += ` at center ${center}`;
    if (radius !== undefined) msg += ` at radius ${radius}`;
    Chat.log(msg);
}

function addHighway({
    direction,
    center,
    radius,
}: {
    direction: 'north' | 'south' | 'east' | 'west' | 'northwest' | 'northeast' | 'southwest' | 'southeast' | 'orbital';
    center?: number;
    radius?: number;
}) {
    if (
        config.highwayPaver.highways.find(
            (h) => h.direction === direction && (center ? h.center === center : h.radius === radius)
        )
    ) {
        Chat.log(`Highway already exists`);
        return;
    }

    config.highwayPaver.highways.push({ direction, center, radius });
    let msg = `Added ${direction} highway`;
    if (center !== undefined) msg += ` at center ${center}`;
    if (radius !== undefined) msg += ` at radius ${radius}`;
    Chat.log(msg);
}

function isWithinRadius(x, z, boundary, radius) {
    // Check if x is within the radius of the boundary and z is within the square
    const xInRadius = Math.abs(x) >= boundary - radius && Math.abs(x) <= boundary + radius;
    const zInSquare = Math.abs(z) <= boundary;

    // Check if z is within the radius of the boundary and x is within the square
    const zInRadius = Math.abs(z) >= boundary - radius && Math.abs(z) <= boundary + radius;
    const xInSquare = Math.abs(x) <= boundary;

    // Return true if either condition is satisfied
    return (xInRadius && zInSquare) || (zInRadius && xInSquare);
}

function canInstaMine_borked(block: BlockStateHelper) {
    if (Player.getGameMode() == 'creative') return true;

    const player = Player.getPlayer();
    const inventory = Player.openInventory();
    const held = inventory.getHeld();
    let toolSpeed = held ? held.getRaw().method_7924(block.getRaw()) : 1; // ItemStack.getMiningSpeedMultiplier

    if (toolSpeed > 1) {
        const efficiencyLevel = held.getEnchantment('minecraft:efficiency')?.getLevel() || 0;
        toolSpeed += efficiencyLevel * efficiencyLevel + 1;
    }

    const hasteLevel =
        player
            .getStatusEffects()
            .find((e) => e.getId() == 'minecraft:haste')
            ?.getStrength() || 0;
    toolSpeed *= 1 + (hasteLevel + 1) * 0.2;

    // const fatigueLevel = player.getStatusEffects().find(e => e.getId() == 'minecraft:mining_fatigue')?.getStrength() || 0;
    // switch (fatigueLevel) {
    //     case 0: toolSpeed *= 0.4; break;
    //     case 1: toolSpeed *= 0.09; break;
    //     case 2: toolSpeed *= 0.0027; break;
    //     default: toolSpeed *= 0.00081; break;
    // }

    // TODO: player.getAttributeValue(EntityAttributes.PLAYER_BLOCK_BREAK_SPEED)
    // TODO: player.isSubmergedIn(FluidTags.WATER)

    if (!player.isOnGround()) {
        toolSpeed /= 5;
    }

    Chat.log(toolSpeed + ' ' + block.getHardness() * 30);
    return toolSpeed > block.getHardness() * 30;
}

function canInstaMine(block: BlockDataHelper) {
    const instaMineWhitelist = ['minecraft:netherrack', 'minecraft:slime_block'];
    const instaMineWhitelistHaste = ['minecraft:basalt', 'minecraft:blackstone'];

    return (
        !Player.isBreakingBlock() &&
        block.getBlockStateHelper().getHardness() > 0 &&
        (instaMineWhitelist.includes(block.getId()) ||
            (Player.getPlayer().hasStatusEffect('minecraft:haste') && instaMineWhitelistHaste.includes(block.getId())))
    );
}

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((_) => {
        if (config.highwayPaver.highways.length == 0 || !config.highwayPaver.enabled) return;

        const interactionManager = Player.getInteractionManager();
        const inventory = Player.openInventory();
        const player = Player.getPlayer();
        const playerPos = player.getPos().toBlockPos();
        const reach = Player.getReach();
        const flooredReach = Math.floor(reach);
        if (!interactionManager || !inventory || !player) return;

        World.iterateBox(
            playerPos.offset(-flooredReach, -3, -flooredReach),
            playerPos.offset(flooredReach, 3, flooredReach),
            false,
            JavaWrapper.methodToJava((block) => {
                let { x, y, z } = block.getBlockPos().toPos3D();
                if (block.getBlockPos().distanceTo(player) > reach) return;
                if (
                    Math.abs(x) <= config.highwayPaver.blacklistRange &&
                    Math.abs(z) <= config.highwayPaver.blacklistRange
                )
                    return;

                let isHighway = false;
                let floorWidth = Math.floor(config.highwayPaver.width / 2);
                highwayLoop: for (const highway of config.highwayPaver.highways) {
                    switch (highway.direction) {
                        case 'north':
                        case 'south':
                        case 'east':
                        case 'west':
                            let axis = highway.direction === 'north' || highway.direction === 'south' ? x : z;
                            if (highway.direction === 'north' && z > 0) continue highwayLoop;
                            if (highway.direction === 'south' && z < 0) continue highwayLoop;
                            if (highway.direction === 'east' && x < 0) continue highwayLoop;
                            if (highway.direction === 'west' && x > 0) continue highwayLoop;

                            // Floor
                            if (
                                Math.abs(Math.abs(axis) - highway.center) <= floorWidth &&
                                y == config.highwayPaver.height
                            ) {
                                isHighway = true;
                                break highwayLoop;
                            }

                            // Guardrails
                            if (
                                Math.abs(Math.abs(axis) - highway.center) == floorWidth + 1 &&
                                y == config.highwayPaver.height + 1
                            ) {
                                isHighway = true;
                                break highwayLoop;
                            }

                            // Break blocks
                            if (config.highwayPaver.breakBlocks && canInstaMine(World.getBlock(x, y, z))) {
                                if (
                                    Math.abs(Math.abs(axis) - highway.center) <= floorWidth &&
                                    y >= config.highwayPaver.height + 1 &&
                                    y <= config.highwayPaver.height + 3
                                ) {
                                    interactionManager.breakBlock(x, y, z);
                                }

                                if (
                                    Math.abs(Math.abs(axis) - highway.center) == floorWidth + 1 &&
                                    y >= config.highwayPaver.height + 1 &&
                                    y <= config.highwayPaver.height + 3
                                ) {
                                    interactionManager.breakBlock(x, y, z);
                                }
                            }
                            break;
                        case 'orbital':
                            if (isWithinRadius(x, z, highway.radius, floorWidth)) {
                                if (y >= config.highwayPaver.height && y <= config.highwayPaver.height + 3) {
                                    if (canInstaMine(World.getBlock(x, y, z))) {
                                        interactionManager.breakBlock(x, y, z);
                                    }
                                }

                                if (y == config.highwayPaver.height) {
                                    isHighway = true;
                                    break highwayLoop;
                                }
                            } else if (isWithinRadius(x, z, highway.radius, floorWidth + 1)) {
                                if (y >= config.highwayPaver.height + 1 && y <= config.highwayPaver.height + 3) {
                                    if (canInstaMine(World.getBlock(x, y, z))) {
                                        interactionManager.breakBlock(x, y, z);
                                    }
                                }

                                if (y == config.highwayPaver.height + 1) {
                                    isHighway = true;
                                    break highwayLoop;
                                }
                            }
                            break;
                        case 'northwest':
                        case 'northeast':
                        case 'southwest':
                        case 'southeast':
                            if (highway.direction === 'northwest' && x > 0 && z > 0) continue highwayLoop;
                            if (highway.direction === 'northeast' && x < 0 && z > 0) continue highwayLoop;
                            if (highway.direction === 'southwest' && x > 0 && z < 0) continue highwayLoop;
                            if (highway.direction === 'southeast' && x < 0 && z < 0) continue highwayLoop;

                            if (
                                Math.abs(Math.abs(x) - Math.abs(z)) <= config.highwayPaver.width - 1 &&
                                y == config.highwayPaver.height
                            ) {
                                if (canInstaMine(World.getBlock(x, y, z))) {
                                    interactionManager.breakBlock(x, y, z);
                                }

                                isHighway = true;
                                break highwayLoop;
                            }

                            if (
                                Math.abs(Math.abs(x) - Math.abs(z)) == config.highwayPaver.width &&
                                y == config.highwayPaver.height + 1
                            ) {
                                if (canInstaMine(World.getBlock(x, y, z))) {
                                    interactionManager.breakBlock(x, y, z);
                                }

                                isHighway = true;
                                break highwayLoop;
                            }

                            if (config.highwayPaver.breakBlocks && canInstaMine(World.getBlock(x, y, z))) {
                                if (
                                    Math.abs(Math.abs(x) - Math.abs(z)) <= config.highwayPaver.width &&
                                    y >= config.highwayPaver.height + 1 &&
                                    y <= config.highwayPaver.height + 3
                                ) {
                                    interactionManager.breakBlock(x, y, z);
                                }
                            }
                            break;
                    }

                    if (isHighway) break;
                }

                if (!isHighway) return;
                if (block.getId() !== 'minecraft:air' && block.getId() !== 'minecraft:cave_air') return;
                if (World.getBlock(x, y - 1, z).getId() == 'minecraft:obsidian') return;

                if (inventory.getSlot(45).getCount() < 1) {
                    let obsidianSlot = inventory.findItem('minecraft:obsidian');
                    if (obsidianSlot.length == 0) {
                        Chat.actionbar('Not enough obsidian');
                        return;
                    }
                    inventory.swapHotbar(obsidianSlot[0], 40);
                }
                interactionManager.interactBlock(x, y, z, 0, true);
            })
        );
    })
);

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(tickListener);
    wrapper.unregister();

    if (!FS.isDir('./config')) {
        FS.makeDir('./config');
    }

    const file = FS.open('./config/east-tweaks.json', 'utf-8');
    file.write(JSON.stringify(config));
});

export default event;
