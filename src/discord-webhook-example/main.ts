import { type DiscordEmbed, DiscordWebhook } from '../libs/DiscordWebhook';

/**
 * Discord Webhook Example Script
 *
 * This script demonstrates how to use the DiscordWebhook library to send
 * messages and embeds to Discord.
 *
 * Setup:
 * 1. Create a webhook in your Discord server (Server Settings > Integrations > Webhooks)
 * 2. Copy the webhook URL
 * 3. Replace the WEBHOOK_URL below with your webhook URL
 * 4. Run the script!
 */

// ===== CONFIGURATION =====
// Replace this with your Discord webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';

// Optional: Set a custom username and avatar for your webhook
const BOT_USERNAME = 'JsMacros Bot';
const BOT_AVATAR_URL = 'https://i.imgur.com/bKXv5Sdl.jpg'; // Minecraft Steve head

// ===== MAIN SCRIPT =====

// Create a webhook instance
const webhook = new DiscordWebhook(WEBHOOK_URL, BOT_USERNAME, BOT_AVATAR_URL);

// Example 1: Send a simple text message
Chat.log('§aSending a simple message...');
webhook.sendMessage('Hello from JsMacros! 👋');

// Wait a bit between messages to avoid rate limiting
Client.waitTick(20);

// Example 2: Send a basic embed
Chat.log('§aSending a basic embed...');
const basicEmbed = DiscordWebhook.createEmbed(
    'Server Status',
    'The server is online and running smoothly!',
    DiscordWebhook.Colors.GREEN
);
webhook.sendEmbed(basicEmbed);

// Wait a bit
Client.waitTick(20);

// Example 3: Send an embed with more features
Chat.log('§aSending an advanced embed...');
const playerName = Player.getPlayer().getName().getString();
const advancedEmbed: DiscordEmbed = {
    title: 'Player Stats',
    description: `Stats for ${playerName}`,
    color: DiscordWebhook.Colors.BLUE,
    timestamp: new Date().toISOString(),
    thumbnail: {
        url: `https://mc-heads.net/avatar/${playerName}/100`,
    },
    fields: [
        {
            name: 'Health',
            value: `${Player.getPlayer().getHealth().toFixed(1)} / 20.0`,
            inline: true,
        },
        {
            name: 'Food Level',
            value: `${Player.getPlayer().getFoodLevel()} / 20`,
            inline: true,
        },
        {
            name: 'Position',
            value: `X: ${Player.getPlayer().getX().toFixed(0)}, Y: ${Player.getPlayer().getY().toFixed(0)}, Z: ${Player.getPlayer().getZ().toFixed(0)}`,
            inline: false,
        },
        {
            name: 'Dimension',
            value: World.getDimension(),
            inline: true,
        },
    ],
    footer: {
        text: 'JsMacros Discord Integration',
    },
};
webhook.sendEmbed(advancedEmbed);

// Example 4: Send a message with a custom color
Chat.log('§aSending a custom colored embed...');
const customColorEmbed = DiscordWebhook.createEmbed(
    'Custom Color',
    'This embed uses a custom RGB color!',
    DiscordWebhook.rgbToDecimal(255, 128, 0) // Orange
);
webhook.sendEmbed(customColorEmbed);

Chat.log('§aAll messages sent successfully!');

export default event;
