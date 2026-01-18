import { flip } from 'lodash';

JsMacros.assertEvent(event, 'Service');

const inv = Player.openInventory;

const openScreenListener = JsMacros.on(
    'OpenScreen',
    JavaWrapper.methodToJava((evt) => {
        if (evt.screenName != 'Survival Inventory') return;
        const slotText = evt.screen.addText('', 0, 0, 0xffffff, true);

        let flipX = false;
        let flipY = false;
        let x = 0;
        let y = 0;

        const tickListener = JsMacros.on(
            'Tick',
            JavaWrapper.methodToJava((_) => {
                const slot = inv().getSlotUnderMouse();
                if (slot == -999) {
                    slotText.setText('');
                    return;
                }

                const item = inv().getSlot(slot);
                const pos = inv().getSlotPos(slot);
                slotText.setText(`Slot: ${slot}\nItem: ${item.getName()}\nCount: ${item.getCount()}`);
                // Test rendering by moving around
                x += flipX ? -1 : 1;
                y += flipY ? -1 : 1;
                if (x > 1920) flipX = true;
                if (x < 0) flipX = false;
                if (y > 1080) flipY = true;
                if (y < 0) flipY = false;
                slotText.setPos(x, y);

                Chat.log(x + ', ' + y);
            })
        );

        evt.screen.setOnClose(
            JavaWrapper.methodToJava(() => {
                JsMacros.off('Tick', tickListener);
            })
        );
    })
);

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off('OpenScreen', openScreenListener);
});

export default event;
