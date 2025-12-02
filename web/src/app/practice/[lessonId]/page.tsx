'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ExamplePanel } from '@/components/practice/ExamplePanel';
import { WebcamPanel } from '@/components/practice/WebcamPanel';
import { FeedbackPanel } from '@/components/practice/FeedbackPanel';

export default function PracticeSessionPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params?.lessonId as string;

    const [lesson, setLesson] = useState<any>(null);
    const [currentSignIndex, setCurrentSignIndex] = useState(0);
    const [isPracticing, setIsPracticing] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Feedback state
    const [accuracy, setAccuracy] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [landmarks, setLandmarks] = useState<any[]>([]);
    const [status, setStatus] = useState('Ready');
    const [progress, setProgress] = useState(0);

    // Fetch lesson details
    useEffect(() => {
        const fetchLesson = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                // For MVP, we might fetch all lessons and find the one we need, 
                // or have a specific endpoint. Let's assume we can get signs for a lesson.
                // Since our current API is simple, let's fetch all lessons and filter.
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/curriculum/lessons`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                // Find lesson by ID (or just take the first one if ID matches 'lesson-1' etc)
                // In a real app, use /curriculum/lessons/:id
                const foundLesson = data.find((l: any) => l.id === lessonId) || data[0];
                setLesson(foundLesson);
            } catch (error) {
                console.error('Failed to fetch lesson', error);
            }
        };
        fetchLesson();
    }, [lessonId, router]);

    // Start session
    useEffect(() => {
        const startSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/practice/sessions`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setSessionId(data.id);
            } catch (error) {
                console.error('Failed to start session', error);
            }
        };
        startSession();
    }, []);

    const handleFrame = useCallback(async (imageSrc: string) => {
        if (!lesson || !sessionId) return;

        const currentSign = lesson.signs[currentSignIndex].sign;
        setStatus('Analyzing...');

        try {
            // Call ML Service via Proxy or Direct
            // Using direct for MVP speed as per previous setup
            const res = await fetch('http://localhost:5000/infer-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target_sign_id: currentSign.name,
                    features: [],
                    image: imageSrc
                })
            });

            const result = await res.json();

            setAccuracy(result.confidence * 100);
            setFeedback(result.feedback);
            setLandmarks(result.landmarks || []);

            if (result.is_correct) {
                setStatus('Good job!');
                // Auto-advance logic could go here, or just enable "Next"
                if (progress < 100) setProgress(prev => Math.min(prev + 10, 100));
            } else {
                setStatus('Listening...');
            }

        } catch (error) {
            console.error('Inference failed', error);
            setStatus('Error');
        }
    }, [lesson, currentSignIndex, sessionId, progress]);

    const handleNext = () => {
        if (!lesson) return;
        if (currentSignIndex < lesson.signs.length - 1) {
            setCurrentSignIndex(prev => prev + 1);
            setAccuracy(0);
            setFeedback([]);
            setLandmarks([]);
            setProgress(0);
            setStatus('Ready');
        } else {
            // End of lesson
            router.push('/dashboard');
        }
    };

    if (!lesson) return <div className="min-h-screen flex items-center justify-center text-white">Loading lesson...</div>;

    const currentSign = lesson.signs[currentSignIndex].sign;

    return (
        <div className="min-h-screen bg-slate-900 p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-4 px-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
                    <p className="text-slate-400 text-sm">Sign {currentSignIndex + 1} of {lesson.signs.length}</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => setIsPracticing(!isPracticing)}
                        variant={isPracticing ? 'secondary' : 'primary'}
                    >
                        {isPracticing ? 'Pause Practice' : 'Start Practice'}
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/curriculum')}>Exit</Button>
                </div>
            </header>

            {/* Main Content - 3 Panel Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
                {/* Left Panel: Example (3 cols) */}
                <div className="lg:col-span-3 min-h-[400px]">
                    <ExamplePanel sign={currentSign} />
                </div>

                {/* Center Panel: Webcam (6 cols) */}
                <div className="lg:col-span-6 min-h-[400px]">
                    <WebcamPanel
                        isPracticing={isPracticing}
                        landmarks={landmarks}
                        status={status}
                        onFrame={handleFrame}
                    />
                </div>

                {/* Right Panel: Feedback (3 cols) */}
                <div className="lg:col-span-3 min-h-[400px]">
                    <FeedbackPanel
                        accuracy={accuracy}
                        feedback={feedback}
                        progress={progress}
                        onNext={handleNext}
                        canNext={true} // Always allow skip for now
                    />
                </div>
            </div>
        </div>
    );
}
