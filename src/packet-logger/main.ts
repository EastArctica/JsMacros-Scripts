JsMacros.assertEvent(event, 'Service');

const SKIPPED_S2C_PACKETS = new Set([
    'TeamS2CPacket',
    'KeepAliveS2CPacket',
    'CommonPingS2CPacket',
    'PlayerListHeaderS2CPacket',
    'CustomPayloadS2CPacket',
    'PlayerRemoveS2CPacket',
    'WorldTimeUpdateS2CPacket',
    'PlayerListS2CPacket',
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
    'PlayerMoveC2SPacket$PositionAndOnGround',
    'PlayerMoveC2SPacket$LookAndOnGround',
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
