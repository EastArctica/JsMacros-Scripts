import { getActiveScreenTitle, isInventoryFull } from '../libs/misc';

// Time in between general actions like opening the shop or navigating
const SPEED = 5;
// How long to wait before re-opening the shop after selling
const OPEN_DELAY = 10;
// How long to wait after purchasing before selling
const SELL_DELAY = 10;
const TOGGLE_VAR_NAME = 'Free Money';

// ѕʜᴏᴘ
const SHOP_STR = [1109, 668, 7439, 7448].map((c) => String.fromCharCode(c)).join('');
// ɢᴇᴀʀ
const GEAR_STR = [610, 7431, 7424, 640].map((c) => String.fromCharCode(c)).join('');
// ѕᴇʟʟ
const SELL_STR = [1109, 7431, 671, 671].map((c) => String.fromCharCode(c)).join('');
// ʙᴜʏɪɴɢ
const BUYING_STR = [665, 7452, 655, 618, 628, 610].map((c) => String.fromCharCode(c)).join('');
const EPEARL_STR = `${BUYING_STR} Ender Pearl`;

// Global helpers
const inv = Player.openInventory;

let instanceId = GlobalVars.getAndIncrementInt(TOGGLE_VAR_NAME) + 1;
// I don't quite know why, but getAndIncrementInt seems to return null initially
if (instanceId === null) {
    instanceId = 0;
    GlobalVars.putInt(TOGGLE_VAR_NAME, 0);
}

// Since we're using ints as a boolean, make even = on, odd = off
const scriptEnabled = instanceId % 2 === 0;
if (scriptEnabled) {
    Chat.log(`[Shop Seller] Enabled (Instance ID: ${instanceId})`);
} else {
    Chat.log(`[Shop Seller] Disabled (Instance ID: ${instanceId})`);
}

while (scriptEnabled && GlobalVars.getInt(TOGGLE_VAR_NAME) === instanceId) {
    try {
        // Open shop
        if (Hud.getOpenScreenName() === null && !isInventoryFull()) {
            Client.waitTick(OPEN_DELAY);
            if (GlobalVars.getInt(TOGGLE_VAR_NAME) !== instanceId) {
                break;
            }

            Chat.log('[Shop Seller] Running /shop');
            Chat.say('/shop');
            Client.waitTick(SPEED);
        }

        // Navigate to gear shop
        if (getActiveScreenTitle()?.includes(SHOP_STR)) {
            inv().quick(13);
            Client.waitTick(SPEED);
        }

        // Navigate to e-pearl shop
        if (getActiveScreenTitle()?.includes(GEAR_STR)) {
            // I have no idea why, but the devs forgot to allow shift clicking here
            inv().click(14);
            Client.waitTick(SPEED);
        }

        // Buy e-pearls until inventory is full
        if (getActiveScreenTitle()?.includes(EPEARL_STR)) {
            const container = inv().getMap().container;
            if (!container) throw new Error('No container found');
            const ePearlSlot = container
                .map((slot) => inv().getSlot(slot))
                .find((slot) => slot.getItemId() === 'minecraft:ender_pearl');

            // Ensure we have a stack of e-pearls in the center
            if (ePearlSlot.getCount() < 16) {
                inv().click(17); // +16
                // Needs a little extra time to properly update
                Client.waitTick(SPEED * 3);
            }

            // Fill inventory
            while (!isInventoryFull() && getActiveScreenTitle()?.includes(EPEARL_STR)) {
                inv().quick(23);
                Client.waitTick(SPEED);
            }

            Client.waitTick(SPEED);
        }

        // Move to sell shop if inventory is full
        if (isInventoryFull() && !getActiveScreenTitle()?.includes(SELL_STR)) {
            // Close shop only if open
            if (getActiveScreenTitle()?.includes(EPEARL_STR)) {
                // This probably isn't necessary but nesting screens can be weird and detectable
                inv().close();
                Client.waitTick(SELL_DELAY);
            }

            Chat.log('[Shop Seller] Running /sell');
            Chat.say('/sell');
            Client.waitTick(SPEED);
        }

        if (getActiveScreenTitle()?.includes(SELL_STR)) {
            // Sell all ender pearls
            const slot = inv()
                .findItem('minecraft:ender_pearl')
                .filter((slot) => {
                    const location = inv().getLocation(slot);
                    return location === 'main' || location === 'hotbar';
                });
            if (slot.length > 0) {
                inv().quickAll(slot[0]);
                Client.waitTick(SPEED * 5);
                inv().close();
            }

            Client.waitTick(SPEED);
        }
    } catch (e) {}
}

/*
Chat.log(
    JSON.stringify(activeScreen
            ?.getTitleText()
            ?.getString()
            ?.split('')
            ?.map((s) => s.charCodeAt(0)))
);
*/
