import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api' });
});

import authRoutes from './routes/auth';
import curriculumRoutes from './routes/curriculum';
import practiceRoutes from './routes/practice';

app.use('/auth', authRoutes);
app.use('/curriculum', curriculumRoutes);
app.use('/practice', practiceRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
