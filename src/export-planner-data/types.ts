// ===============================
// Top-level dataset
// ===============================

export interface PlannerData {
    /**
     * Export schema version for compatibility.
     * Use a number if you really want, but semver string is nicer.
     * Keeping number to match your interface.
     */
    schemaVersion: number;

    pack: {
        id: string; // "atm10_tts"
        name: string; // "All The Mods 10: To The Sky"
        version: string; // "1.7"
        exportedAt: string; // ISO timestamp
        minecraft?: string; // "1.21.x" (optional but useful)
        loader?: 'forge' | 'neoforge' | 'fabric' | 'quilt'; // optional
    };

    items: PlannerItem[];
    tags: PlannerTag[];
    recipes: PlannerRecipe[];
    machines: PlannerMachine[];

    /**
     * Anything pack-specific you don’t want to normalize yet.
     * Example: default primitive items, recommended milestones, etc.
     */
    metadata: PlannerMetadata;
}

export interface PlannerMetadata {
    /**
     * Items you want the planner to treat as "free"/assumed available by default.
     * Example: water/cobble/dirt in some sky packs.
     */
    defaultPrimitives?: string[]; // item ids

    /**
     * Optional: curated milestone targets for this preset.
     * Example: "ae2:controller", "powah:reactor", "allthemodium:atm_star"
     */
    suggestedGoals?: Array<{
        itemId: string;
        label?: string;
        stage?: PlannerStage;
    }>;

    /**
     * Optional notes for users. Plain text or markdown.
     */
    notes?: string;

    /**
     * Escape hatch for future additions.
     */
    [key: string]: unknown;
}

export type PlannerStage = 'early' | 'mid' | 'late' | 'endgame';

// ===============================
// Items / Tags
// ===============================

export enum IconType {
    Texture = 'texture',
    Url = 'url',
    None = 'none',
}

export interface PlannerItem {
    id: string; // "minecraft:iron_ingot"
    name: string; // "Iron Ingot"
    namespace: string; // "minecraft"
    maxStackSize: number; // 64

    icon?: {
        type: IconType;
        ref?: string; // "minecraft:item/iron_ingot" OR URL
    };

    /**
     * Helpful for filtering/search without decoding ids.
     */
    modName?: string; // "Mekanism" (optional)
}

export interface PlannerTag {
    id: string; // "forge:ingots/iron"
    name: string; // "Iron Ingots"
    members: string[]; // item ids
}

// ===============================
// Resources / Ingredients
// ===============================

export enum RecipeType {
    Processing = 'processing',
    Crafting = 'crafting',
    Smelting = 'smelting',
    Generation = 'generation',
    Brewing = 'brewing',
    Smithing = 'smithing',
    Stonecutting = 'stonecutting',
    Crushing = 'crushing',
    Enriching = 'enriching',
    Custom = 'custom',
}

export enum ResourceKind {
    Item = 'item',
    Tag = 'tag',
    Fluid = 'fluid',
    Energy = 'energy',
    AnyOf = 'anyOf',
}

/**
 * Item stack ingredient.
 */
export interface ItemResourceEntry {
    kind: ResourceKind.Item;
    id: string; // "minecraft:dirt"
    count: number; // 1..64 (or >64 for bulk math)
}

/**
 * Tag ingredient.
 */
export interface TagResourceEntry {
    kind: ResourceKind.Tag;
    id: string; // "forge:ingots/iron"
    count: number;
}

/**
 * Fluid ingredient: use millibuckets (mB) by convention.
 */
export interface FluidResourceEntry {
    kind: ResourceKind.Fluid;
    id: string; // "minecraft:water"
    amountMb: number; // 1000 = 1 bucket
}

/**
 * Energy ingredient/cost: represent as amount per craft or per tick.
 * For recipes, this is usually metadata rather than "input", but sometimes
 * you’ll want to model it as an entry too.
 */
export interface EnergyResourceEntry {
    kind: ResourceKind.Energy;
    /**
     * Energy system identifier, pack-dependent:
     * "forge:fe", "mekanism:joules", "gtceu:eu", etc.
     */
    id: string;
    /**
     * Generic energy amount. Interpretation depends on context.
     * Prefer using PlannerRecipe.power below for clarity.
     */
    amount: number;
    unit?: 'fe' | 'joule' | 'eu' | 'rf' | string;
}

/**
 * Any-of ingredient: choose one of several options.
 * Useful when JEI exports an ingredient as a list, or when you want
 * "any cobblestone" without expanding tags.
 */
export interface AnyOfResourceEntry {
    kind: ResourceKind.AnyOf;
    count?: number; // optional multiplier for options that omit their own count
    options: Array<ItemResourceEntry | TagResourceEntry | FluidResourceEntry>;
}

export type AnyResourceEntry =
    | ItemResourceEntry
    | TagResourceEntry
    | FluidResourceEntry
    | EnergyResourceEntry
    | AnyOfResourceEntry;

// ===============================
// Machines
// ===============================

export interface PlannerMachine {
    /**
     * Unique machine id in your planner space.
     * Examples:
     *  - "minecraft:crafting_table"
     *  - "mekanism:enrichment_chamber"
     *  - "mysticalagriculture:farm"
     */
    id: string;

    name: string; // "Enrichment Chamber"
    namespace: string; // "mekanism"

    /**
     * Broad grouping so the UI can filter and color code.
     */
    category: 'crafting' | 'processing' | 'smelting' | 'generation' | 'magic' | 'storage' | 'transport' | 'custom';

    /**
     * What recipeType strings map to this machine.
     * Example: mekanism:enriching -> enrichment chamber
     */
    handlesRecipeTypes?: string[];

    /**
     * Default power behavior (optional, for UI hints).
     */
    power?: {
        system?: 'fe' | 'joule' | 'eu' | 'rf' | string;
        perTick?: number;
        perOp?: number;
    };

    /**
     * Extra info you want to show in tooltips.
     */
    notes?: string[];
}

// ===============================
// Recipes
// ===============================

export interface PlannerRecipe {
    id: string; // "mekanism:enriching/iron"
    type: RecipeType; // RecipeType.Processing etc.

    /**
     * Raw recipe type from the game/export:
     * "minecraft:crafting_shaped", "mekanism:enriching", etc.
     */
    recipeType: string;

    /**
     * Mod namespace for filtering, even if id parsing is messy.
     */
    namespace?: string; // "mekanism"

    /**
     * Optional: explicit machine id (recommended).
     * If missing, UI can infer from recipeType using machines[].handlesRecipeTypes
     */
    machineId?: string; // "mekanism:enrichment_chamber"

    inputs: AnyResourceEntry[];
    outputs: AnyResourceEntry[];

    /**
     * Extra outputs that happen but aren't the "main" ones.
     */
    byproducts?: AnyResourceEntry[];

    /**
     * Things not consumed but required (molds, tools, upgrades).
     * NOTE: In many mods, catalysts are "not consumed" but sometimes damaged.
     */
    catalysts?: AnyResourceEntry[];

    /**
     * Processing duration metadata.
     */
    time?: {
        ticks?: number; // 200 ticks = 10 seconds
        seconds?: number; // alternative if you prefer
        note?: string; // "Varies with upgrades"
    };

    /**
     * Power metadata for processing.
     */
    power?: {
        system?: 'fe' | 'joule' | 'eu' | 'rf' | string;
        perTick?: number; // energy/tick
        perOp?: number; // energy per operation/craft
        note?: string;
    };

    /**
     * Crafting-grid data when applicable.
     */
    crafting?: CraftingShape;

    /**
     * Conditions for enabling/disabling recipes (datapacks, stages, mod rules).
     * You can keep this very lightweight in v1.
     */
    conditions?: RecipeCondition[];

    /**
     * Freeform notes shown in UI.
     * Great for things like MA growth rates, Auto Civs loops, etc.
     */
    notes?: string[];
}

export type CraftingShape =
    | {
          kind: 'shaped';
          width: number; // usually <= 3
          height: number; // usually <= 3
          /**
           * Row-major list, length = width*height.
           * Each slot is either an ingredient or null.
           */
          grid: Array<AnyResourceEntry | null>;
      }
    | {
          kind: 'shapeless';
          inputs: AnyResourceEntry[];
      };

export type RecipeCondition =
    | {
          kind: 'modLoaded';
          modId: string;
      }
    | {
          kind: 'flag';
          key: string; // arbitrary exporter-defined flag
          value?: boolean | string | number;
      }
    | {
          kind: 'stage';
          stage: PlannerStage; // useful for curated presets
      }
    | {
          kind: 'unknown';
          raw: unknown;
      };
