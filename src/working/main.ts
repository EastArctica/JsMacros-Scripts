//------------variable----------------
let speed = 500;
//amount of wait time between every block place in milliseconds.

let ReloadTime = 50;
//amount of wait time for an item to get transfered from a slot

let wait = 100;
//------------------------------------

//------------Setup-------------------
Player.getPlayer().lookAt(90, 0);
KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
//------------------------------------

//------------laag 1------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);
Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 2------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 3------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 4------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 5------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 6------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 7------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 8------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 9------------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 10-----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 11-----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 12-----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------

//------------laag 13-----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(0);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.openInventory().setSelectedHotbarSlotIndex(1);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(3);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.openInventory().setSelectedHotbarSlotIndex(4);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 14-----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(1);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(4);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 15-----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(1);
Player.getPlayer().lookAt(-93.3, 39.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-98.7, 58);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-0.6, 90);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(92.7, 55.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(94.8, 37.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 0);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(50);

KeyBind.keyBind('key.forward', true);
Client.waitTick(10);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(4);
Player.getPlayer().lookAt(-125.2, 48.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-142.6, 57.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(121.1, 46.6);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(142.3, 57);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(178.9, 64);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------laag 16----------------
//redstone
Player.openInventory().setSelectedHotbarSlotIndex(1);
Player.getPlayer().lookAt(-98.2, 38.4);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-101.3, 58.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(171, 79);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(103.8, 55.2);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(96.6, 38.2);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-180, 0);

KeyBind.keyBind('key.forward', true);
Client.waitTick(1);
KeyBind.keyBind('key.forward', false);

KeyBind.keyBind('key.jump', true);
Client.waitTick(1);
KeyBind.keyBind('key.jump', false);

Time.sleep(wait);

KeyBind.keyBind('key.forward', true);
Client.waitTick(5);
KeyBind.keyBind('key.forward', false);
Time.sleep(wait);

//block
Player.openInventory().setSelectedHotbarSlotIndex(4);
Player.getPlayer().lookAt(-65.3, 48.9);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(-48.9, 60.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(65.1, 49);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(45.7, 62.7);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);

Player.getPlayer().lookAt(0, 68.8);
KeyBind.key('key.mouse.right', true);
Client.waitTick(1);
KeyBind.key('key.mouse.right', false);
Time.sleep(speed);
//------------------------------------
//------------retour------------------
Player.getPlayer().lookAt(180, 45);
KeyBind.keyBind('key.forward', true);
Client.waitTick(1);
KeyBind.keyBind('key.forward', false);

Time.sleep(100);

KeyBind.keyBind('key.forward', true);
Client.waitTick(57);
KeyBind.keyBind('key.forward', false);

Time.sleep(150);

Player.getPlayer().lookAt(-80, 0);
KeyBind.keyBind('key.forward', true);
Client.waitTick(15);
KeyBind.keyBind('key.forward', false);
//------------------------------------
