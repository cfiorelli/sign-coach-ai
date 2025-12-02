import React from 'react';
import { Button } from '@/components/Button';

interface FeedbackPanelProps {
    accuracy: number;
    feedback: string[];
    progress: number;
    onNext: () => void;
    canNext: boolean;
}

export function FeedbackPanel({ accuracy, feedback, progress, onNext, canNext }: FeedbackPanelProps) {
    // Determine color based on accuracy
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400 border-green-500/50 bg-green-500/10';
        if (score >= 50) return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
        return 'text-red-400 border-red-500/50 bg-red-500/10';
    };

    const scoreColorClass = getScoreColor(accuracy);

    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
                <h2 className="text-xl font-bold text-white">Feedback</h2>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                {/* Accuracy Score */}
                <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${scoreColorClass}`}>
                    <span className="text-sm uppercase tracking-wider font-semibold opacity-80">Accuracy</span>
                    <span className="text-5xl font-bold mt-2">{Math.round(accuracy)}%</span>
                </div>

                {/* Feedback Messages */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Coaching</h3>
                    {feedback.length > 0 ? (
                        <ul className="space-y-2">
                            {feedback.map((msg, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg text-slate-200 text-sm animate-in fade-in slide-in-from-left-2">
                                    <span className="text-blue-400 mt-0.5">💡</span>
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-slate-500 text-sm italic border border-dashed border-slate-700 rounded-lg">
                            Waiting for analysis...
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mt-auto">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Lesson Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <Button
                    onClick={onNext}
                    className="w-full"
                    variant={canNext ? 'primary' : 'secondary'}
                >
                    {canNext ? 'Next Sign →' : 'Skip Sign'}
                </Button>
            </div>
        </div>
    );
}
