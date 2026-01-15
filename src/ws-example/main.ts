JsMacros.assertEvent(event, 'Service');

Chat.log("§a=== WEBSOCKET CLIENT ===");

const Thread = Java.type('java.lang.Thread');

const WS_URL = "ws://localhost:8080";
const ws = Request.createWS(WS_URL);

ws.onConnect = JavaWrapper.methodToJava(function (webSocket, headers) {
    Chat.log("§a[WS] ✓ Connected to server!");
    Chat.log("§7[WS] Ready to receive commands");
});

ws.onDisconnect = JavaWrapper.methodToJava(function (webSocket, disconnected) {
    Chat.log("§c[WS] ✗ Disconnected");
    Chat.log("§7[WS] Reconnecting in 5 seconds...");

    new Thread(JavaWrapper.methodToJava(function () {
        Thread.sleep(5000); // 5 sekundės
        Chat.log("§7[WS] Attempting to reconnect...");
        ws.connect();
    })).start();
});

ws.onError = JavaWrapper.methodToJava(function (webSocket, error) {
    Chat.log("§c[WS] Error: " + error.getMessage());
});

ws.connect();
Chat.log("§7[WS] Connecting to: " + WS_URL);
ws.onTextMessage = JavaWrapper.methodToJava(function (webSocket, message) {
    Chat.log("§e[WS] Message received: " + message);
});

// unused?
function checkConnection() {
    if (ws.getWs() && ws.getWs().isOpen()) {
        return "Connected to " + WS_URL;
    }
    return "Not connected";
};

function sendMessage(message) {
    if (ws.getWs() && ws.getWs().isOpen()) {
        ws.sendText(message);
        return "Message sent";
    }
    return "Not connected";
};

// unused?
function reconnect() {
    try {
        ws.close();
        new Thread(JavaWrapper.methodToJava(function () {
            Thread.sleep(1000);
            ws.connect();
        })).start();
        return "Reconnecting...";
    } catch (e) {
        return "Error: " + e;
    }
};

const connectionCheckThread = new Thread(JavaWrapper.methodToJava(function () {
    Thread.sleep(3000);

    if (ws.getWs() && ws.getWs().isOpen()) {
        Chat.log("§a✓ Connection successful!");
        sendMessage("Hello from JsMacros WebSocket client!");
    } else {
        Chat.log("§c✗ Not connected to server");
    }
}));
connectionCheckThread.start();

event.stopListener = JavaWrapper.methodToJava((_) => {
    // Kill threads
    if (connectionCheckThread.isAlive()) {
        connectionCheckThread.interrupt();
    }
    // Close websocket
    if (ws.getWs() && ws.getWs().isOpen()) {
        ws.close();
        Chat.log("§7[WS] WebSocket closed");
    }
});

export default event;
