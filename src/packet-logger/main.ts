JsMacros.assertEvent(event, 'Service');

const SKIPPED_S2C_PACKETS = new Set([
    'TeamS2CPacket',
    'KeepAliveS2CPacket',
    'CommonPingS2CPacket',
    'PlayerListHeaderS2CPacket',
    'PlayerListS2CPacket',
    'PlayerRemoveS2CPacket',
    'CustomPayloadS2CPacket',
    'WorldTimeUpdateS2CPacket',
    'BlockEventS2CPacket',
]);

const recvPacketListener = JsMacros.on(
    'RecvPacket',
    JavaWrapper.methodToJava((event) => {
        if (SKIPPED_S2C_PACKETS.has(event.type)) return;
        Chat.log(`S2C -> ${event.type}`);
    })
);

const SKIPPED_C2S_PACKETS = new Set([
    'CommonPongC2SPacket',
    'KeepAliveC2SPacket',
    'ServerboundClientTickEndPacket',
    'EntitySetHeadYawS2CPacket',
    'EntityS2CPacket$RotateAndMoveRelative',
    'EntityS2CPacket$MoveRelative',
    'EntityS2CPacket$Rotate',
    'EntityVelocityUpdateS2CPacket',
    'EntityStatusS2CPacket',
    'ClientboundEntityPositionSyncPacket',
    'ChunkDeltaUpdateS2CPacket',
    'PlayerMoveC2SPacket$PositionAndOnGround',
    'PlayerMoveC2SPacket$LookAndOnGround',
    'WorldTimeUpdateS2CPacket',
    'EntityTrackerUpdateS2CPacket',
    'BundleS2CPacket',
    'EntitiesDestroyS2CPacket',
    'EntityAttributesS2CPacket',
    'BlockUpdateS2CPacket',
    'EntityEquipmentUpdateS2CPacket',
    'HandSwingC2SPacket',
    'PlayerListS2CPacket',
]);

const sendPacketListener = JsMacros.on(
    'SendPacket',
    JavaWrapper.methodToJava((event) => {
        if (SKIPPED_C2S_PACKETS.has(event.type)) return;
        Chat.log(`C2S -> ${event.type}`);
    })
);

event.stopListener = JavaWrapper.methodToJava((_) => {
    JsMacros.off(recvPacketListener);
    JsMacros.off(sendPacketListener);
});

export default event;
