const cron = require('node-cron');
const GoogleClassroomLink = require('../modules/grading/models/googleclassroomlink.model');
const SectionSubject = require('../modules/sectionsubject/models/sectionsubject.model');
const syncService = require('../modules/grading/services/sync.service');

const MAX_AGE_MS = 4 * 60 * 60 * 1000;

let isRunning = false;

const runAutoSync = async () => {
    if (isRunning) return;
    isRunning = true;
    try {
        const cutoff = new Date(Date.now() - MAX_AGE_MS);
        const links = await GoogleClassroomLink.find({
            isActive: true,
            $or: [{ lastSyncedAt: null }, { lastSyncedAt: { $lt: cutoff } }],
        });

        for (const link of links) {
            const sectionSubject = await SectionSubject.findById(link.sectionSubject).lean();
            if (!sectionSubject || !sectionSubject.instructor) continue;
            try {
                await syncService.syncFromGoogleClassroom(
                    String(sectionSubject.instructor),
                    String(link.sectionSubject),
                    undefined
                );
            } catch (error) {
                console.error(
                    `[google-sync] failed for class ${link.sectionSubject}: ${error.message}`
                );
            }
        }
    } catch (error) {
        console.error(`[google-sync] error: ${error.message}`);
    } finally {
        isRunning = false;
    }
};

const startGoogleSyncScheduler = () => {
    const cronExpr = process.env.GOOGLE_AUTO_SYNC_CRON || '0 */4 * * *';
    if (!cron.validate(cronExpr)) {
        console.warn(`[google-sync] invalid cron "${cronExpr}"; auto-sync disabled.`);
        return;
    }
    cron.schedule(cronExpr, runAutoSync);
    console.log(`[google-sync] auto-sync scheduled: ${cronExpr}`);
};

module.exports = { startGoogleSyncScheduler, runAutoSync };