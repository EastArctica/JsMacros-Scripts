/**
 * A wrapper for GlobalVars that provides a clean interface for persistent variables
 * that survive script reloads.
 */

type GlobalVarType = 'Double' | 'Int' | 'String' | 'Boolean';

interface TypeConfig<T> {
    type: GlobalVarType;
    get: (key: string) => T;
    put: (key: string, value: T) => void;
    default: T;
}

const TYPE_CONFIGS = {
    double: {
        type: 'Double' as const,
        get: (key: string) => GlobalVars.getDouble(key),
        put: (key: string, val: number) => GlobalVars.putDouble(key, val),
        default: 0,
    },
    int: {
        type: 'Int' as const,
        get: (key: string) => GlobalVars.getInt(key),
        put: (key: string, val: number) => GlobalVars.putInt(key, val),
        default: 0,
    },
    string: {
        type: 'String' as const,
        get: (key: string) => GlobalVars.getString(key),
        put: (key: string, val: string) => GlobalVars.putString(key, val),
        default: '',
    },
    boolean: {
        type: 'Boolean' as const,
        get: (key: string) => GlobalVars.getBoolean(key),
        put: (key: string, val: boolean) => GlobalVars.putBoolean(key, val),
        default: false,
    },
} as const;

export class PersistentVariable<T> {
    private readonly key: string;
    private readonly config: TypeConfig<T>;
    private cachedValue: T;

    constructor(key: string, config: TypeConfig<T>) {
        this.key = key;
        this.config = config;
        this.cachedValue = this.load();
    }

    private load(): T {
        const existingType = GlobalVars.getType(this.key);
        if (existingType === this.config.type) {
            return this.config.get(this.key);
        }
        return this.config.default;
    }

    get value(): T {
        return this.cachedValue;
    }

    set value(val: T) {
        this.cachedValue = val;
        this.config.put(this.key, val);
    }

    /** Update the value using a function */
    update(updater: (current: T) => T): void {
        this.value = updater(this.value);
    }

    /** Reset to default value */
    reset(): void {
        this.value = this.config.default;
    }
}

/**
 * Factory functions for creating persistent variables of different types
 */
export const Persistent = {
    double: (key: string, defaultValue = 0): PersistentVariable<number> => {
        return new PersistentVariable(key, { ...TYPE_CONFIGS.double, default: defaultValue });
    },

    int: (key: string, defaultValue = 0): PersistentVariable<number> => {
        return new PersistentVariable(key, { ...TYPE_CONFIGS.int, default: defaultValue });
    },

    string: (key: string, defaultValue = ''): PersistentVariable<string> => {
        return new PersistentVariable(key, { ...TYPE_CONFIGS.string, default: defaultValue });
    },

    boolean: (key: string, defaultValue = false): PersistentVariable<boolean> => {
        return new PersistentVariable(key, { ...TYPE_CONFIGS.boolean, default: defaultValue });
    },
};
