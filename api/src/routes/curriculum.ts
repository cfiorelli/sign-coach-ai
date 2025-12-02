import express from 'express';
import prisma from '../db';
import { authenticateToken } from '../auth';

const router = express.Router();

// Get all lessons with their signs
router.get('/lessons', authenticateToken, async (req, res) => {
    const lessons = await prisma.lesson.findMany({
        include: {
            signs: {
                include: {
                    sign: true
                },
                orderBy: {
                    order: 'asc'
                }
            }
        },
        orderBy: {
            order: 'asc'
        }
    });
    res.json(lessons);
});

// Get a specific sign details
router.get('/signs/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const sign = await prisma.sign.findUnique({
        where: { id }
    });

    if (!sign) {
        return res.status(404).json({ error: 'Sign not found' });
    }

    res.json(sign);
});

export default router;
