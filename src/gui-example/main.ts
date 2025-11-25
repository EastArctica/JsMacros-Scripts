import { updateScript } from '../libs/Updater';
updateScript(file.getAbsolutePath(), 'EastArctica/JsMacros', './config/EastArctica-scripts.json');

JsMacros.assertEvent(event, 'Service');

function getTextWidth(text: string): number {
    return Chat.createTextHelperFromString(text).getWidth();
}

const overlay = Hud.createDraw2D();
overlay.register();

const myTextBackground = overlay.addRect(5, 5, 15, 50, 0x1f1f1f);
const myText = overlay.addText("", 10, 10, 0xFFFFFF, true);

function setText(newText: string) {
    myText.setText(newText);
    const newWidth = getTextWidth(newText);
    myTextBackground.setSize(newWidth + 10, 17);
}

setText("Hello World! This is a test.");

// Example of updating text on an event
JsMacros.waitForEvent('AttackBlock');
setText("Yoooo you hit a block!");

event.stopListener = JavaWrapper.methodToJava((_) => {
    overlay.unregister();
});

export default event;
