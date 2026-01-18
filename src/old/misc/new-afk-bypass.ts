JsMacros.assertEvent(event, 'Service');

enum CaptchaType {
    NAME = 'NAME',
    TEXTURE = 'TEXTURE',
}

let waiting = false;
function handleCaptcha(inventory: Inventory<any>) {
    let title = inventory.getContainerTitle();
    if (title !== 'AFK Captcha') return;

    // Chat.log('Opened container: ' + title);

    // Currently in the captcha, find the item to look for
    let items = inventory.getItems();
    let captchaItem: ItemStackHelper = null;
    let captchaType: CaptchaType = null;
    for (const item of items) {
        if (!item) continue;

        if (item.getName().toString().includes('Click the item NAMED after this item.')) {
            captchaItem = item;
            captchaType = CaptchaType.NAME;
            break;
        }
        if (item.getName().toString().includes('Click the item that LOOKS like this item.')) {
            captchaItem = item;
            captchaType = CaptchaType.TEXTURE;
            break;
        }
    }

    if (!captchaItem) {
        // Chat.log('Failed to find captcha item');
        return;
    }
    // Chat.log(`Captcha item: ${captchaType === CaptchaType.NAME ? captchaItem.getDefaultName() : captchaItem.getItemId()}, type: ${captchaType}`);

    // Find the slot of the captcha item and click it
    for (const item of items) {
        if (!item) continue;
        if (item.getName().toString().includes('AFK Captcha')) continue;

        if (item.getDefaultName() == captchaItem.getDefaultName() && item !== captchaItem) {
            // Chat.log('Found captcha item by name: ' + item.getName());
            let slot = inventory.findItem(item);
            inventory.click(slot[0]);
            break;
        }

        if (captchaType == CaptchaType.TEXTURE && item.getItemId() == captchaItem.getItemId() && item !== captchaItem) {
            // Chat.log('Found captcha item by texture: ' + item.getName());
            let slot = inventory.findItem(item);
            inventory.click(slot[0]);
            break;
        }
    }
}

JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava((tickEvent) => {
        let player = Player.getPlayer();
        if (!player) return;
        if (!Hud.isContainer()) return;

        handleCaptcha(Player.openInventory());
    })
);

export default event;
