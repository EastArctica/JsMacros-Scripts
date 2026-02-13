import { getMetadata } from './mpris';

const Identifier = Java.type('net.minecraft.class_2960');
// public record Music(Holder<SoundEvent> sound, int minDelay, int maxDelay, boolean replaceCurrentMusic)
const Music = Java.type('net.minecraft.class_5195');

// net/minecraft/client/resources/language/ClientLanguage
const ClientLanguage = Java.type('net.minecraft.class_1078');

const HashMap = Java.type('java.util.HashMap');

function initialize() {
    // Language.getInstance()
    const LanguageClass = Reflection.getClass('net.minecraft.class_2477'); // Language
    const getInstanceMethod = Reflection.getDeclaredMethod(LanguageClass, 'method_10517', []); // Language.getInstance
    getInstanceMethod.setAccessible(true);

    // BuiltInRegistries.SOUND_EVENT.frozen = false
    const BuiltInRegistriesClass = Reflection.getClass('net.minecraft.class_7923'); // BuiltInRegistries
    const SOUND_EVENTSField = Reflection.getDeclaredField(BuiltInRegistriesClass, 'field_41172'); // BuiltInRegistries.SOUND_EVENT
    const MappedRegistryClass = Reflection.getClass('net.minecraft.class_2370'); // MappedRegistry
    const frozenField = Reflection.getField(MappedRegistryClass, 'field_36463'); // MappedRegistry.frozen
    frozenField.setAccessible(true);
    frozenField.set(SOUND_EVENTSField.get(null), false);

    Chat.log('[Spotify-Notifs] Initialized java access.');
}
initialize();

JsMacros.assertEvent(event, 'Service');

const player = 'spotify';
const metadata = getMetadata(player);
if (metadata) {
    const trackIdentifier = `jsmacrosce.song_notif.now_playing_${metadata.trackid?.split('/').pop()}`;
    let soundEvent = GlobalVars.getObject(`${trackIdentifier}_soundEvent`);
    if (!soundEvent) {
        const SoundEventsClass = Reflection.getClass('net.minecraft.class_3417'); // SoundEvents
        const registerForHolderMethod = Reflection.getDeclaredMethod(SoundEventsClass, 'method_47965', [
            // SoundEvents.registerForHolder
            Identifier,
            Identifier,
        ]);
        registerForHolderMethod.setAccessible(true);

        soundEvent = Reflection.invokeMethod(registerForHolderMethod, null, [
            Identifier.method_60656(trackIdentifier), // withDefaultNamespace
            Identifier.method_60656(trackIdentifier), // withDefaultNamespace
        ]);

        GlobalVars.putObject(`${trackIdentifier}_soundEvent`, soundEvent);
    }
    // Add track identifier to translatable strings
    const clientLang = ClientLanguage.method_10517(); // Language.getInstance()
    const storageField = Reflection.getDeclaredField(ClientLanguage, 'field_5330'); // ClientLanguage.storage
    storageField.setAccessible(true);
    const oldStorage = storageField.get(clientLang);
    const newStorage = new HashMap(oldStorage);
    newStorage.put(trackIdentifier, `Now Playing: ${metadata.title} - ${metadata.artist}`);
    storageField.set(clientLang, newStorage);

    const music = new Music(soundEvent, 0, 0, false);
    const musicManager = Client.getMinecraft().method_1538(); // getMusicManager
    musicManager.method_4858(music); // startPlaying/play
    Chat.log(`Now playing sound notification for ${metadata.title}`);
} else {
    Chat.log('No metadata available.');
}

export default event;
