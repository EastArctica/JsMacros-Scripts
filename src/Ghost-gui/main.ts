const settings = {
    Prefix: '/',
};

const alignmentMapping = {
    left: 'leftOnleft',
    center: 'centerOncenter',
    right: 'rightOnright',
    leftSide: 'rightOnleft',
    rightSide: 'leftOnright',
    top: 'topOntop',
    bottom: 'bottomOnbottom',
    under: 'topOnbottom',
    above: 'bottomOntop',
};

function alignToParent(
    object: Text | TextFieldWidgetHelper,
    parent: Rect | TextFieldWidgetHelper,
    xAlignment?: 'left' | 'center' | 'right' | 'leftSide' | 'rightSide',
    xOffset?: number,
    yAlignment?: 'top' | 'bottom' | 'above' | 'under',
    yOffset?: number
): boolean {
    if (!parent) {
        Chat.log('§dParent is nil');
        return false;
    }
    if (!object) {
        Chat.log('§dObject is nil');
        return false;
    }

    try {
        if (xAlignment) {
            object.alignHorizontally(parent, alignmentMapping[xAlignment] ?? xAlignment, xOffset ?? 0);
        }

        if (yAlignment) {
            object.alignVertically(parent, alignmentMapping[yAlignment] ?? yAlignment, yOffset ?? 0);
        }
    } catch {
        Chat.log('§dFailed to align object to parent');
        return false;
    }

    return true;
}

function buildSettings(): void {
    Hud.openScreen(null);

    const screen = Hud.createScreen('', false);
    Hud.openScreen(screen);
    Client.waitTick();

    const background = screen
        .addRect(0, 0, 350, 350, 0x333333, 100)
        .alignHorizontally('center')
        .alignVertically('center');

    const tile = screen.addText('Settings', 0, 0, 0x00ff00, -1, false, 1, 0);
    alignToParent(tile, background, 'center', 0, 'above', -10);

    screen.setOnClose(
        JavaWrapper.methodToJavaAsync(() => {
            // Do nothing?
        })
    );

    const element = {
        prefix: {
            textinput: screen
                .addTextInput(
                    0,
                    0,
                    30,
                    20,
                    '',
                    JavaWrapper.methodToJavaAsync((text: string) => {
                        settings.Prefix = text;
                    })
                )
                .setMaxLength(3)
                .setText(settings.Prefix),

            text: screen.addText('Command Prefix', 0, 0, 0xffffff, -1, false, 1, 0),
        },
    };

    alignToParent(element.prefix.textinput, background, 'left', 5, 'top', 5);
    alignToParent(element.prefix.text, element.prefix.textinput, 'rightSide', 5, 'center', 0);
}

buildSettings();
