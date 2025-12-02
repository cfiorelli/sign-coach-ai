'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function PracticePage() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPracticing, setIsPracticing] = useState(false);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [currentSign, setCurrentSign] = useState<any>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const signId = searchParams?.get('sign');

    // Fetch sign details
    useEffect(() => {
        const fetchSign = async () => {
            const token = localStorage.getItem('token');
            if (!token || !signId) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/curriculum/signs/${signId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentSign(data);
                }
            } catch (error) {
                console.error('Failed to fetch sign', error);
            }
        };
        fetchSign();
    }, [signId]);

    // Start session on mount
    useEffect(() => {
        const startSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

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
    }, [router]);

    const captureAndInfer = useCallback(async () => {
        if (!webcamRef.current || !sessionId) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        // In a real app, we'd send the image or extracted landmarks.
        // For MVP, we'll send a mock request to the ML service.

        try {
            // Direct call to ML service (assuming CORS allowed)
            // Note: In production, proxy via API to hide ML URL
            const res = await fetch('http://localhost:5000/infer-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target_sign_id: currentSign?.name || 'unknown',
                    features: [], // Empty features, rely on image
                    image: imageSrc // Send base64 image
                })
            });

            const result = await res.json();
            setFeedback(result.feedback);

            // Record attempt in backend
            const token = localStorage.getItem('token');
            if (currentSign?.id) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/practice/attempts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        sessionId,
                        signId: currentSign.id,
                        isCorrect: result.is_correct,
                        accuracyScore: result.confidence,
                        feedback: result
                    })
                });
            }

        } catch (error) {
            console.error('Inference failed', error);
        }
    }, [sessionId, currentSign]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPracticing) {
            interval = setInterval(captureAndInfer, 2000); // Poll every 2s for MVP
        }
        return () => clearInterval(interval);
    }, [isPracticing, captureAndInfer]);

    return (
        <div className="min-h-screen p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex gap-8">
                {/* Left Column: Camera */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Practice: {currentSign?.name || (signId ? 'Loading...' : 'Select a Sign')}</h1>
                        {currentSign && (
                            <Button
                                onClick={() => setIsPracticing(!isPracticing)}
                                variant={isPracticing ? 'secondary' : 'primary'}
                            >
                                {isPracticing ? 'Stop Practice' : 'Start Camera'}
                            </Button>
                        )}
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black w-full aspect-video">
                        {!currentSign ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                                <p className="text-xl mb-4">Please select a sign to practice.</p>
                                <Button onClick={() => router.push('/curriculum')}>
                                    Go to Curriculum
                                </Button>
                            </div>
                        ) : isPracticing ? (
                            <>
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover"
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                />

                                {/* Reference Overlay */}
                                <div className="absolute top-4 right-4 w-32 h-24 bg-black/50 rounded-lg overflow-hidden border border-white/20 shadow-lg">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentSign.imageUrl}
                                        alt="Reference"
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                </div>

                                {/* Overlay Feedback */}
                                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur p-4 rounded-xl">
                                    <p className="text-lg font-semibold text-white mb-2">AI Coach:</p>
                                    {feedback.length > 0 ? (
                                        <ul className="list-disc list-inside text-blue-200">
                                            {feedback.map((msg, i) => <li key={i}>{msg}</li>)}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-400">Waiting for sign...</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                Camera is off
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Context */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                        {currentSign ? (
                            <>
                                <div className="aspect-video bg-slate-700 rounded-lg mb-4 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentSign.imageUrl}
                                        alt={currentSign.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-slate-300 mb-4">{currentSign.description}</p>
                                <div className="text-sm text-slate-400">
                                    <p className="font-semibold mb-1">Tips:</p>
                                    <ul className="list-disc list-inside">
                                        <li>Ensure good lighting</li>
                                        <li>Keep hand visible</li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-400">Select a sign from the curriculum to start practicing.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
