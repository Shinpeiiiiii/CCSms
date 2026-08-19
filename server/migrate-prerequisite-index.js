require('dotenv').config()
const mongoose = require('mongoose')

const SubjectPrerequisite = require('./src/modules/academic/prerequisites/models/prerequisites.models')

mongoose.connect(process.env.MONGO_URI)

const migrate = async () => {
    try {
        const duplicates = await SubjectPrerequisite.aggregate([
            {
                $group: {
                    _id: {
                        subject: '$subject',
                        requiredSubject: '$requiredSubject',
                    },
                    curricula: { $addToSet: '$curriculum' },
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    count: { $gt: 1 },
                },
            },
        ])

        if (duplicates.length > 0) {
            console.log(
                'Found duplicate subject pairs across curricula. Please resolve these before migrating:'
            )
            for (const dup of duplicates) {
                console.log(
                    `Subject: ${dup._id.subject}, RequiredSubject: ${dup._id.requiredSubject}, Count: ${dup.count}, Curricula: ${JSON.stringify(dup.curricula)}`
                )
            }
            process.exit(1)
        }

        const indexes = await SubjectPrerequisite.collection.indexes()
        const oldIndex = indexes.find(
            (idx) =>
                idx.key &&
                idx.key.subject === 1 &&
                idx.key.requiredSubject === 1 &&
                !idx.key.curriculum
        )

        if (oldIndex) {
            await SubjectPrerequisite.collection.dropIndex(oldIndex.name)
            console.log(`Dropped old index: ${oldIndex.name}`)
        } else {
            console.log('Old index not found, skipping drop.')
        }

        await SubjectPrerequisite.collection.createIndex(
            { subject: 1, requiredSubject: 1, curriculum: 1 },
            { unique: true }
        )
        console.log('Created new unique index: subject_1_requiredSubject_1_curriculum_1')

        console.log('Migration completed successfully.')
        process.exit(0)
    } catch (error) {
        console.error('Migration failed:', error)
        process.exit(1)
    }
}

migrate()
