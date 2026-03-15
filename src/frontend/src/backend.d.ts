import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WaterLog {
    id: bigint;
    ph: number;
    temperature: number;
    ammonia: number;
    notes: string;
    timestamp: bigint;
    nitrate: number;
}
export interface Reminder {
    id: bigint;
    frequencyDays: bigint;
    title: string;
    description: string;
    enabled: boolean;
    reminderType: string;
    nextDue: bigint;
    lastDone: bigint;
}
export interface UserProfile {
    name: string;
}
export interface FishProfile {
    id: bigint;
    incompatibleWith: Array<string>;
    maxPH: number;
    minPH: number;
    plants: Array<string>;
    minTemp: bigint;
    diet: string;
    name: string;
    compatibleWith: Array<string>;
    habitat: string;
    lighting: string;
    scientificName: string;
    minTankSize: bigint;
    maxTemp: bigint;
    filtration: string;
    substrate: string;
    maxTankSize: bigint;
    decorations: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFishProfile(profile: FishProfile): Promise<void>;
    addReminder(reminderType: string, title: string, description: string, frequencyDays: bigint): Promise<bigint>;
    addWaterLog(log: WaterLog): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkCompatibility(fishNames: Array<string>): Promise<{
        compatible: boolean;
        conflicts: Array<[string, string]>;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFishById(id: bigint): Promise<FishProfile | null>;
    getReminders(user: Principal): Promise<Array<Reminder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWaterLogs(user: Principal): Promise<Array<WaterLog>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchFishByName(searchTerm: string): Promise<Array<FishProfile>>;
}
