JsMacros.assertEvent(event, 'Service');

const KEY_NAME = 'DONUTSMP_HOME_POSITIONS';
GlobalVars.putObject(KEY_NAME, {});

let lastHomeName = '';
const sendMessageListener = JsMacros.on(
    'SendMessage',
    JavaWrapper.methodToJava((msgEvent) => {
        const message = msgEvent.message;
        if (message.startsWith('/home')) {
            lastHomeName = message.split('/home ')[1];
        }
    })
);

const teleportListener = JsMacros.on(
    'RecvMessage',
    JavaWrapper.methodToJava((msgEvent) => {
        const message = msgEvent.text.getString();
        if (message.includes('You teleported to your home')) {
            // TODO: Whatever later add the proper packet teleport listener
            // For now just set the global variable when we see the teleport message
            const obj = GlobalVars.getObject(KEY_NAME);
            // Chat.log(
            //     `New home position for ${lastHomeName}: ${obj[lastHomeName]} -> ${Player.getPlayer().getBlockPos()}`
            // );
            obj[lastHomeName] = Player.getPlayer().getBlockPos();
            GlobalVars.putObject(KEY_NAME, obj);
        }
    })
);

const skipped = [
    'EntityAnimationS2CPacket',
    'EntityTrackerUpdateS2CPacket',
    'EntitySetHeadYawS2CPacket',
    'OverlayMessageS2CPacket',
    'EntityS2CPacket$MoveRelative',
    'WorldTimeUpdateS2CPacket',
    'EntityS2CPacket$Rotate',
    'EntityS2CPacket$RotateAndMoveRelative',
    'TeamS2CPacket',
    'KeepAliveS2CPacket',
    'EntityPositionS2CPacket',
    'PlayerListHeaderS2CPacket',
    'PlayerListS2CPacket',
    'PlayerRemoveS2CPacket',
    'CustomPayloadS2CPacket',
    'EntityVelocityUpdateS2CPacket',
    'EntitiesDestroyS2CPacket',
    'EntityAttributesS2CPacket',
    'EntityEquipmentUpdateS2CPacket',
    'PlaySoundS2CPacket',
    'BlockBreakingProgressS2CPacket',
    'ChunkDataS2CPacket',
    'ChunkRenderDistanceCenterS2CPacket',
    'UnloadChunkS2CPacket',
    'PlayerAbilitiesS2CPacket',
    'PlaySoundFromEntityS2CPacket',
    'HealthUpdateS2CPacket',
    'PlayerActionResponseS2CPacket',
    'ParticleS2CPacket',
    'CommandSuggestionsS2CPacket',
    'CommonPingS2CPacket',
    'InventoryS2CPacket',
    'ScreenHandlerSlotUpdateS2CPacket',
    'BlockEventS2CPacket',
    'BlockUpdateS2CPacket',
    'OpenScreenS2CPacket',
    'CloseScreenS2CPacket',
    'GameStateChangeS2CPacket',
];

// const teleportListenerr = JsMacros.on(
//     'RecvPacket',
//     JavaWrapper.methodToJava((evt) => {
//         if (skipped.includes(evt.type)) return;
//         Chat.log(evt.type);
//     })
// );

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off(sendMessageListener);
    JsMacros.off(teleportListener);
    // JsMacros.off(teleportListenerr);
});

export default event;
