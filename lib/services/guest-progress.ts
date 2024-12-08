import { GuestProgress, GuestProgressUpdate } from "@/lib/types/guest";

const STORAGE_KEY = "guest-progress";

class GuestProgressService {
    private getStorage(): Storage {
        if(typeof window === 'undefined') {
            throw new Error('Guest progress service is not available in the server');
        }
        return window.localStorage;
    }

    initialize(): void {
        try {
            const storage = this.getStorage();
            if (!storage.getItem(STORAGE_KEY)) {
                const initialState: GuestProgress = {
                    activeClassId: null,
                    completedChallenges: {},
                    lastAccessedLesson: null
                }
                storage.setItem(STORAGE_KEY, JSON.stringify(initialState));
            }
        } catch (error) {
            console.error('Error initializing guest progress:', error);
        }
    }

    getProgress(): GuestProgress | null {
        try {
            const storage = this.getStorage();
            const data = storage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting guest progress:', error);
            return null;
        }
    }

    updateProgress(update: GuestProgressUpdate): void {
        try {
            const storage = this.getStorage();
            const current = this.getProgress();
            const updated = {
                ...current,
                ...update
            };
            storage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to update guest progress:', error);
        }
    }

    clearProgress(): void {
        try {
            const storage = this.getStorage();
            storage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear guest progress:', error);
        }
    }
}

export const guestProgressService = new GuestProgressService();