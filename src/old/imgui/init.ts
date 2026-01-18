// Download latest imgui jar from imgui-java releases
const IMGUI_JAVA_VERSION = 'v1.88.0';

// TODO: Auto determine based on platform
const OS_NATIVE_NAME = 'imgui-java64.dll';

function extractNativeLibraries() {
    const res = Request.get(
        `https://github.com/SpaiR/imgui-java/releases/download/${IMGUI_JAVA_VERSION}/native-libraries.zip`
    );
    const data = res.byteArray();

    // Un-Zip the downloaded file
    const ZipInputStream = Java.type('java.util.zip.ZipInputStream') as any;
    const ByteArrayInputStream = Java.type('java.io.ByteArrayInputStream') as any;
    const ByteArrayOutputStream = Java.type('java.io.ByteArrayOutputStream') as any;
    const _Array = Java.type('java.lang.reflect.Array') as any;

    const zip = new ZipInputStream(new ByteArrayInputStream(data));
    let entry;

    while ((entry = zip.getNextEntry()) !== null) {
        if (entry.getName() === OS_NATIVE_NAME) {
            const outputStream = new ByteArrayOutputStream();
            const buffer = _Array.newInstance(Java.type('byte'), 1024);
            let bytesRead;

            // Read all data at once
            while ((bytesRead = zip.read(buffer)) !== -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            // Convert ByteArrayOutputStream to byte array
            const dllData = outputStream.toByteArray();

            // Write to file
            FS.makeDir('./libraries/native/');
            FS.open('./libraries/native/' + OS_NATIVE_NAME).write(Array.from(dllData as number[]));
        }
    }
}

function extractJavaLibraries() {
    const res = Request.get(
        `https://github.com/SpaiR/imgui-java/releases/download/${IMGUI_JAVA_VERSION}/java-libraries.zip`
    );
    const data = res.byteArray();

    // Un-Zip the downloaded file
    const ZipInputStream = Java.type('java.util.zip.ZipInputStream') as any;
    const ByteArrayInputStream = Java.type('java.io.ByteArrayInputStream') as any;
    const ByteArrayOutputStream = Java.type('java.io.ByteArrayOutputStream') as any;
    const _Array = Java.type('java.lang.reflect.Array') as any;

    const zip = new ZipInputStream(new ByteArrayInputStream(data));
    let entry;

    while ((entry = zip.getNextEntry()) !== null) {
        const outputStream = new ByteArrayOutputStream();
        const buffer = _Array.newInstance(Java.type('byte'), 1024);
        let bytesRead;

        // Read all data at once
        while ((bytesRead = zip.read(buffer)) !== -1) {
            outputStream.write(buffer, 0, bytesRead);
        }

        // Convert ByteArrayOutputStream to byte array
        const dllData = outputStream.toByteArray();

        // Write to file
        FS.makeDir('./libraries/java/');
        FS.open('./libraries/java/' + entry.getName()).write(Array.from(dllData as number[]));
    }
}

if (!FS.exists('./libraries')) {
    Chat.log('Downloading imgui-java libraries...');
    extractNativeLibraries();
    Chat.log('Extracted native libraries');
    extractJavaLibraries();
    Chat.log('Extracted java libraries');
}

// TODO: Check if the native library is already loaded
const Load = (Java.type('java.lang.System') as any).load;
Load(FS.toRawFile(`./libraries/native/${OS_NATIVE_NAME}`).getAbsoluteFile().toString());
Chat.log('Loaded native library');

// Load java libraries
const javaLibs = FS.list('./libraries/java/');
const loadedLibraries = {};
for (const lib of javaLibs) {
    const URLClassLoader = Java.type('java.net.URLClassLoader') as any;
    const child = new URLClassLoader(
        [FS.toRawFile(`./libraries/java/${lib}`).toURI().toURL()],
        (Java.type('java.lang.Class') as any).classLoader
    );
    loadedLibraries[lib] = child;
}
Chat.log('Loaded java libraries');

export default event;
