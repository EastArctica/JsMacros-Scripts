/**
 * Discord Webhook Helper for JsMacros
 * Provides an easy interface to send messages and embeds to Discord webhooks
 */

export interface DiscordEmbed {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    timestamp?: string;
    footer?: {
        text: string;
        icon_url?: string;
    };
    thumbnail?: {
        url: string;
    };
    image?: {
        url: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
}

export interface DiscordWebhookPayload {
    content?: string;
    username?: string;
    avatar_url?: string;
    embeds?: DiscordEmbed[];
}

export class DiscordWebhook {
    private webhookUrl: string;
    private defaultUsername?: string;
    private defaultAvatarUrl?: string;

    /**
     * Creates a new Discord Webhook instance
     * @param webhookUrl The Discord webhook URL
     * @param defaultUsername Optional default username for messages
     * @param defaultAvatarUrl Optional default avatar URL for messages
     */
    constructor(webhookUrl: string, defaultUsername?: string, defaultAvatarUrl?: string) {
        this.webhookUrl = webhookUrl;
        this.defaultUsername = defaultUsername;
        this.defaultAvatarUrl = defaultAvatarUrl;
    }

    /**
     * Sends a simple text message to the webhook
     * @param content The message content
     * @param username Optional username override
     * @returns true if successful, false otherwise
     */
    sendMessage(content: string, username?: string): boolean {
        const payload: DiscordWebhookPayload = {
            content: content,
            username: username || this.defaultUsername,
            avatar_url: this.defaultAvatarUrl,
        };

        return this.send(payload);
    }

    /**
     * Sends an embed to the webhook
     * @param embed The embed object
     * @param content Optional message content
     * @param username Optional username override
     * @returns true if successful, false otherwise
     */
    sendEmbed(embed: DiscordEmbed, content?: string, username?: string): boolean {
        const payload: DiscordWebhookPayload = {
            content: content,
            username: username || this.defaultUsername,
            avatar_url: this.defaultAvatarUrl,
            embeds: [embed],
        };

        return this.send(payload);
    }

    /**
     * Sends multiple embeds to the webhook
     * @param embeds Array of embed objects (max 10)
     * @param content Optional message content
     * @param username Optional username override
     * @returns true if successful, false otherwise
     */
    sendEmbeds(embeds: DiscordEmbed[], content?: string, username?: string): boolean {
        if (embeds.length > 10) {
            Chat.log('§cError: Discord allows maximum 10 embeds per message');
            return false;
        }

        const payload: DiscordWebhookPayload = {
            content: content,
            username: username || this.defaultUsername,
            avatar_url: this.defaultAvatarUrl,
            embeds: embeds,
        };

        return this.send(payload);
    }

    /**
     * Sends a raw payload to the webhook
     * @param payload The Discord webhook payload
     * @returns true if successful, false otherwise
     */
    send(payload: DiscordWebhookPayload): boolean {
        try {
            const json = JSON.stringify(payload);

            const request = Request.create(this.webhookUrl);
            request.addHeader('Content-Type', 'application/json');
            const response = request.post(json);

            if (response.responseCode >= 200 && response.responseCode < 300) {
                return true;
            } else {
                Chat.log(`§cDiscord webhook error: ${response.responseCode} - ${response.text()}`);
                return false;
            }
        } catch (error) {
            Chat.log(`§cDiscord webhook exception: ${error}`);
            return false;
        }
    }

    /**
     * Creates a basic embed with common fields
     * @param title Embed title
     * @param description Embed description
     * @param color Embed color (decimal number)
     * @returns DiscordEmbed object
     */
    static createEmbed(title: string, description: string, color?: number): DiscordEmbed {
        return {
            title: title,
            description: description,
            color: color || 0x5865f2, // Discord blurple
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Converts RGB color to decimal for Discord embeds
     * @param r Red (0-255)
     * @param g Green (0-255)
     * @param b Blue (0-255)
     * @returns Decimal color value
     */
    static rgbToDecimal(r: number, g: number, b: number): number {
        return (r << 16) + (g << 8) + b;
    }

    /**
     * Common Discord color presets
     */
    static readonly Colors = {
        BLURPLE: 0x5865f2,
        GREEN: 0x57f287,
        YELLOW: 0xfee75c,
        FUCHSIA: 0xeb459e,
        RED: 0xed4245,
        WHITE: 0xffffff,
        BLACK: 0x000000,
        ORANGE: 0xff8c00,
        PURPLE: 0x9b59b6,
        BLUE: 0x3498db,
    };
}
