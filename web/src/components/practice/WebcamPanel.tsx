import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

interface WebcamPanelProps {
    isPracticing: boolean;
    landmarks: Array<{ x: number, y: number, z: number }> | null;
    status: string;
    onFrame: (imageSrc: string) => void;
}

export function WebcamPanel({ isPracticing, landmarks, status, onFrame }: WebcamPanelProps) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Capture loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPracticing) {
            interval = setInterval(() => {
                if (webcamRef.current) {
                    const imageSrc = webcamRef.current.getScreenshot();
                    if (imageSrc) onFrame(imageSrc);
                }
            }, 500); // 2 FPS for MVP to avoid overloading
        }
        return () => clearInterval(interval);
    }, [isPracticing, onFrame]);

    // Draw skeleton
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !landmarks || landmarks.length === 0) {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw landmarks
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;

        // MediaPipe Hands connections (simplified)
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        // Draw connections
        connections.forEach(([start, end]) => {
            const p1 = landmarks[start];
            const p2 = landmarks[end];
            if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                ctx.stroke();
            }
        });

        // Draw points
        landmarks.forEach(lm => {
            ctx.beginPath();
            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

    }, [landmarks]);

    return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl">
            {isPracticing ? (
                <>
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        mirrored={true}
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none transform -scale-x-100" // Mirror canvas to match webcam
                        width={640}
                        height={480}
                    />

                    {/* Status Overlay */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur rounded-full border border-white/10">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status === 'Listening...' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-white text-sm font-medium">{status}</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                        📷
                    </div>
                    <p>Camera is paused</p>
                </div>
            )}
        </div>
    );
}
