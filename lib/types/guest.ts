export interface GuestProgress {
    activeClassId: number | null;
    completedChallenges: Record<number, boolean>;
    lastAccessedLesson: number | null;
}

export interface GuestProgressUpdate extends Partial<GuestProgress> {}