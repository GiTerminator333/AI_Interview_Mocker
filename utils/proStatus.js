import { db } from './db';
import { UserSubscription } from './schema';
import { eq } from 'drizzle-orm';
import moment from 'moment';

/**
 * Check if a user has Pro subscription status
 * @param {string} userEmail 
 * @returns {Promise<boolean>}
 */
export async function checkProStatus(userEmail) {
    if (!userEmail) return false;
    try {
        const result = await db.select()
            .from(UserSubscription)
            .where(eq(UserSubscription.userEmail, userEmail));
        return result.length > 0 && result[0].isPro === true;
    } catch (error) {
        console.error("Error checking pro status:", error);
        return false;
    }
}

/**
 * Toggle Pro status for a user (demo purposes)
 * Creates a new subscription record if one doesn't exist
 * @param {string} userEmail 
 * @returns {Promise<boolean>} new isPro status
 */
export async function toggleProStatus(userEmail) {
    if (!userEmail) return false;
    try {
        const existing = await db.select()
            .from(UserSubscription)
            .where(eq(UserSubscription.userEmail, userEmail));

        if (existing.length > 0) {
            const newStatus = !existing[0].isPro;
            await db.update(UserSubscription)
                .set({ 
                    isPro: newStatus, 
                    updatedAt: moment().format('DD-MM-yyyy') 
                })
                .where(eq(UserSubscription.userEmail, userEmail));
            return newStatus;
        } else {
            await db.insert(UserSubscription).values({
                userEmail: userEmail,
                isPro: true,
                createdAt: moment().format('DD-MM-yyyy'),
                updatedAt: moment().format('DD-MM-yyyy'),
            });
            return true;
        }
    } catch (error) {
        console.error("Error toggling pro status:", error);
        return false;
    }
}
