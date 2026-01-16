JsMacros.assertEvent(event, 'Key');

const cmdMgr = Chat.getCommandManager();

// This doesn't get all commands
// const valid = cmdMgr.getValidCommands();

// Loop through all utf16 chars and trigger autocompletes
const primaryOptions: Set<string> = new Set();
const primaryPromises: Promise<void>[] = [];
for (let i = 0; i < 256; i++) {
    const char = String.fromCharCode(i);
    primaryPromises.push(
        new Promise((resolve) => {
            cmdMgr.getArgumentAutocompleteOptions(
                char,
                JavaWrapper.methodToJava((options) => {
                    for (const option of options) {
                        primaryOptions.add(option);
                    }
                    resolve();
                })
            );
        })
    );
}

Promise.all(primaryPromises).then(async () => {
    Chat.log(`Found ${primaryOptions.size} autocomplete options:`);

    const detailedOptions: Map<string, Set<string>> = new Map();

    for (const option of primaryOptions) {
        Chat.log(`Requesting sub-options for ${option}`);
        try {
            await Promise.race([
                new Promise<void>((resolve) => {
                    cmdMgr.getArgumentAutocompleteOptions(
                        `${option} `,
                        JavaWrapper.methodToJava((subOptions) => {
                            Chat.log(`Fetched ${subOptions.size()} sub-options for option '${option}'`);
                            const subOptionSet: Set<string> = new Set();
                            for (let i = 0; i < subOptions.size(); i++) {
                                subOptionSet.add(subOptions.get(i));
                            }
                            detailedOptions.set(option, subOptionSet);
                            resolve();
                        })
                    );
                }),
                new Promise<void>((_, reject) => {
                    Client.waitTick(40); // 2 seconds at 20 TPS
                    reject(new Error('Timeout'));
                }),
            ]);
        } catch {
            Chat.log(`Timed out or failed for option '${option}'`);
            detailedOptions.set(option, new Set());
        }
    }

    for (const [option, subOptions] of detailedOptions) {
        if (subOptions.size > 0) {
            Chat.log(`- ${option}:`);
            // for (const subOption of subOptions) {
            //     Chat.log(`    - ${subOption}`);
            // }
        } else {
            Chat.log(`- ${option}`);
        }
    }
});

export default event;
