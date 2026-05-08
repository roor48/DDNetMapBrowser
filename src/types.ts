export interface MapData {
    name: string;
    website: string;
    thumbnail: string;
    web_preview: string;
    type: string;
    points: number;
    difficulty: number;
    mapper: string;
    release: string;
    width: number;
    height: number;
    tiles: string[];
};

export interface map {
    finishes: number;
};

export interface TeeData {
    player: string;
    points: number;
    finishData: Record<string, boolean>;
};

export interface Filter {
    name: string;
    mapper: string;
    isFinished: boolean;
    isUnfinished: boolean;
    types: string[];
    difficultyMin: number;
    difficultyMax: number;
    tiles: string[];
};

export interface Sorter {
    sortBy: string;
    isDESC: boolean;
};

export const TYPES = {
    Novice: "Novice",
    Moderate: "Moderate",
    Brutal: "Brutal",
    Insane: "Insane",
    Dummy: "Dummy",
    DDmaX: "DDmaX",
    DDmaX_Easy: "DDmaX.Easy",
    DDmaX_Next: "DDmaX.Next",
    DDmaX_Pro: "DDmaX.Pro",
    DDmaX_Nut: "DDmaX.Nut",
    Oldschool: "Oldschool",
    Solo: "Solo",
    Race: "Race",
    Fun: "Fun",
    Event: "Event",
} as const;

export type MapType = (typeof TYPES)[keyof typeof TYPES];

export const SORT_BY = {
    Release: "Release",
    Points: "Points",
    Difficulty: "Difficulty",
    Name: "Name",
} as const;

export type SortBy = (typeof SORT_BY)[keyof typeof SORT_BY];