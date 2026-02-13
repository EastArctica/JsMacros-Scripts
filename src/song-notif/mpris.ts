import { parseGVariantText, type GvValue } from '../libs/GVariant';

const ProcessBuilder = Java.type('java.lang.ProcessBuilder');
const BufferedReader = Java.type('java.io.BufferedReader');
const InputStreamReader = Java.type('java.io.InputStreamReader');

/*
export interface GvObject {
    [key: string]: GvValue;
}

export type GvValue = string | boolean | number | bigint | GvValue[] | GvObject;
*/

function getRawData(player: string, property: string): GvValue | null {
    const process = new ProcessBuilder(
        'gdbus',
        'call',
        '--session',
        '--dest',
        `org.mpris.MediaPlayer2.${player}`,
        '--object-path',
        '/org/mpris/MediaPlayer2',
        '--method',
        `org.freedesktop.DBus.Properties.Get`,
        'org.mpris.MediaPlayer2.Player',
        property
    );

    try {
        const proc = process.start();
        const reader = new BufferedReader(new InputStreamReader(proc.getInputStream()));
        const output = reader.readLine();
        proc.waitFor();
        reader.close();

        if (output) {
            return parseGVariantText(output.toString());
        }
    } catch (e) {
        // Handle errors silently
        Chat.log(`Error fetching MPRIS data: ${e}`);
    }

    return null;
}

export type SongMetadata = {
    // 'mpris:artUrl': 'https://i.scdn.co/image/ab67616d0000b273ac2c80749b6fd366a51a1e94'
    artUrl?: string;
    // 'mpris:length': 178128000n
    length?: bigint;
    // 'mpris:trackid': '/com/spotify/track/25fwFyS4DeKLoPX01b5yKH'
    trackid?: string;
    // 'xesam:album': 'tension'
    album?: string;
    // 'xesam:albumArtist': ['gianni & kyle']
    albumArtist?: string[];
    // 'xesam:artist': ['gianni & kyle']
    artist?: string[];
    // 'xesam:autoRating': 0.29
    autoRating?: number;
    // 'xesam:discNumber': 1n
    discNumber?: bigint;
    // 'xesam:title': 'tension'
    title?: string;
    // 'xesam:trackNumber': 1n
    trackNumber?: bigint;
    // 'xesam:url': 'https://open.spotify.com/track/25fwFyS4DeKLoPX01b5yKH'
    url?: string;
};

export function getMetadata(player: string): SongMetadata | null {
    const data = getRawData(player, 'Metadata');
    if (!data || !Array.isArray(data)) {
        return null;
    }

    if (data.length !== 1) {
        Chat.log('Unexpected Metadata format');
        Chat.log(JSON.stringify(data));
        return null;
    }

    return {
        artUrl: data[0]['mpris:artUrl'] as string | undefined,
        length: data[0]['mpris:length'] as bigint | undefined,
        trackid: data[0]['mpris:trackid'] as string | undefined,
        album: data[0]['xesam:album'] as string | undefined,
        albumArtist: data[0]['xesam:albumArtist'] as string[] | undefined,
        artist: data[0]['xesam:artist'] as string[] | undefined,
        autoRating: data[0]['xesam:autoRating'] as number | undefined,
        discNumber: data[0]['xesam:discNumber'] as bigint | undefined,
        title: data[0]['xesam:title'] as string | undefined,
        trackNumber: data[0]['xesam:trackNumber'] as bigint | undefined,
        url: data[0]['xesam:url'] as string | undefined,
    };
}
