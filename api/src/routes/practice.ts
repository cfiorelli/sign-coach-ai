import express from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../auth';
import { z } from 'zod';

const router = express.Router();

// Start a practice session
router.post('/sessions', authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user!.userId;

    const session = await prisma.practiceSession.create({
        data: {
            userId,
        }
    });

    res.json(session);
});

// Record an attempt
const attemptSchema = z.object({
    sessionId: z.string(),
    signId: z.string(),
    isCorrect: z.boolean(),
    accuracyScore: z.number().optional(),
    feedback: z.any().optional(),
});

router.post('/attempts', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { sessionId, signId, isCorrect, accuracyScore, feedback } = attemptSchema.parse(req.body);
        const userId = req.user!.userId;

        // Verify session belongs to user
        const session = await prisma.practiceSession.findUnique({
            where: { id: sessionId }
        });

        if (!session || session.userId !== userId) {
            return res.status(403).json({ error: 'Invalid session' });
        }

        const attempt = await prisma.practiceAttempt.create({
            data: {
                sessionId,
                signId,
                isCorrect,
                accuracyScore,
                feedback: feedback || {},
            }
        });

        // Update user progress
        await prisma.userProgress.upsert({
            where: {
                userId_signId: {
                    userId,
                    signId
                }
            },
            update: {
                lastPracticed: new Date(),
                // Simple fluency update logic: increment if correct, but cap at 100
                fluency: {
                    increment: isCorrect ? 5 : 0
                }
            },
            create: {
                userId,
                signId,
                fluency: isCorrect ? 10 : 0,
                lastPracticed: new Date()
            }
        });

        res.json(attempt);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid input' });
    }
});

// Get user stats/dashboard data
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user!.userId;

    const progress = await prisma.userProgress.findMany({
        where: { userId },
        include: { sign: true }
    });

    const recentSessions = await prisma.practiceSession.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: 5,
        include: {
            attempts: true
        }
    });

    res.json({
        progress,
        recentSessions
    });
});

export default router;
