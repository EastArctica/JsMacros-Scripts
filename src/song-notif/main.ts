import { getMetadata } from './mpris';

const Identifier = Java.type('net.minecraft.resources.Identifier');
// public record Music(Holder<SoundEvent> sound, int minDelay, int maxDelay, boolean replaceCurrentMusic)
const Music = Java.type('net.minecraft.sounds.Music');

// net/minecraft/client/resources/language/ClientLanguage
const ClientLanguage = Java.type('net.minecraft.client.resources.language.ClientLanguage');

const HashMap = Java.type('java.util.HashMap');

function initialize() {
    const LanguageClass = Reflection.getClass('net.minecraft.locale.Language');
    const getInstanceMethod = Reflection.getDeclaredMethod(LanguageClass, 'getInstance', []);
    getInstanceMethod.setAccessible(true);

    const BuiltInRegistriesClass = Reflection.getClass('net.minecraft.core.registries.BuiltInRegistries');
    const SOUND_EVENTSField = Reflection.getDeclaredField(BuiltInRegistriesClass, 'SOUND_EVENT');
    const MappedRegistryClass = Reflection.getClass('net.minecraft.core.MappedRegistry');
    const frozenField = Reflection.getField(MappedRegistryClass, 'frozen');
    frozenField.setAccessible(true);
    frozenField.set(SOUND_EVENTSField.get(null), false);

    Chat.log('[Spotify-Notifs] Initialized java access.');
}
initialize();

JsMacros.assertEvent(event, 'Service');

const player = 'spotify';
const metadata = getMetadata(player);
if (metadata) {
    // TODO: Hash trackid to avoid capitals
    const trackIdentifier = `jsmacrosce.song_notif.now_playing_${metadata.trackid?.split('/').pop()}`.toLowerCase();
    let soundEvent = GlobalVars.getObject(`${trackIdentifier}_soundEvent`);
    if (!soundEvent) {
        const SoundEventsClass = Reflection.getClass('net.minecraft.sounds.SoundEvents');
        const registerForHolderMethod = Reflection.getDeclaredMethod(SoundEventsClass, 'registerForHolder', [
            Identifier,
            Identifier,
        ]);
        registerForHolderMethod.setAccessible(true);

        soundEvent = Reflection.invokeMethod(registerForHolderMethod, null, [
            Identifier.withDefaultNamespace(trackIdentifier),
            Identifier.withDefaultNamespace(trackIdentifier),
        ]);

        GlobalVars.putObject(`${trackIdentifier}_soundEvent`, soundEvent);
    }

    // Add track identifier to translatable strings
    const clientLang = ClientLanguage.getInstance();
    const storageField = Reflection.getDeclaredField(ClientLanguage, 'storage');
    storageField.setAccessible(true);
    const oldStorage = storageField.get(clientLang);
    const newStorage = new HashMap(oldStorage);
    newStorage.put(trackIdentifier, `Now Playing: ${metadata.title} - ${metadata.artist}`);
    storageField.set(clientLang, newStorage);

    const music = new Music(soundEvent, 0, 0, false);
    const musicManager = Client.getMinecraft().getMusicManager();
    // Okay so this is really cursed but we'll need to force the currentMusic to be looping, hopefully this makes it work.
    musicManager.startPlaying(music);
    Chat.log(`Now playing sound notification for ${metadata.title}`);
} else {
    Chat.log('No metadata available.');
}

export default event;
