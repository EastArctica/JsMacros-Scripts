import { inv } from '../donut-smp-bone-macro/util';

Chat.say('/orders bones');

Client.waitTick(20 * 2); // Wait 2 seconds for the orders GUI to open
Chat.log(inv().getSlot(inv().findItem('minecraft:arrow')[0]).getName().getString());
