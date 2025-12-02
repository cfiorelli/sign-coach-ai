import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Signs
    const signs = [
        {
            name: 'Hello',
            description: 'Raise your hand to your forehead and move it away in a salute-like motion.',
            imageUrl: '/signs/hello.svg',
            difficulty: 1,
            handshape: 'Flat hand (B-hand)',
            location: 'Near temple/forehead',
            orientation: 'Palm facing out',
            movement: 'Outward away from head',
        },
        {
            name: 'Thank You',
            description: 'Touch your chin with your fingertips and move your hand forward.',
            imageUrl: '/signs/thank-you.svg',
            difficulty: 1,
            handshape: 'Flat hand',
            location: 'Chin',
            orientation: 'Palm facing in',
            movement: 'Forward and down',
        },
        {
            name: 'A',
            description: 'Make a fist with your thumb resting on the side of your index finger.',
            imageUrl: '/signs/a.svg',
            difficulty: 1,
            handshape: 'Fist (A-hand)',
            location: 'Neutral space',
            orientation: 'Palm facing out',
            movement: 'None (Static)',
        },
        {
            name: 'B',
            description: 'Hold your hand open with fingers together and thumb tucked across your palm.',
            imageUrl: '/signs/b.svg',
            difficulty: 1,
            handshape: 'Open palm (B-hand)',
            location: 'Neutral space',
            orientation: 'Palm facing out',
            movement: 'None (Static)',
        },
    ];

    for (const s of signs) {
        await prisma.sign.upsert({
            where: { name: s.name },
            update: {},
            create: s,
        });
    }

    // Create Lesson
    const lesson = await prisma.lesson.upsert({
        where: { id: 'lesson-1' }, // simplistic ID for seed
        update: {},
        create: {
            id: 'lesson-1',
            title: 'Basics 101',
            description: 'Learn the fundamental greetings and first letters.',
            order: 1,
        },
    });

    // Link Signs to Lesson
    const allSigns = await prisma.sign.findMany();
    for (let i = 0; i < allSigns.length; i++) {
        await prisma.signLesson.upsert({
            where: {
                signId_lessonId: {
                    signId: allSigns[i].id,
                    lessonId: lesson.id,
                },
            },
            update: {},
            create: {
                signId: allSigns[i].id,
                lessonId: lesson.id,
                order: i + 1,
            },
        });
    }

    console.log('Database seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
