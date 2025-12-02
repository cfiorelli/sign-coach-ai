'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function CurriculumPage() {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurriculum = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/curriculum/lessons`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setLessons(data);
            } catch (error) {
                console.error('Failed to fetch curriculum', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading curriculum...</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Curriculum</h1>

            <div className="space-y-8">
                {lessons.length === 0 ? (
                    <div className="text-center text-slate-400">
                        <p>No lessons available yet.</p>
                        <p className="text-sm mt-2">(Seed the database to see content)</p>
                    </div>
                ) : (
                    lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-700">
                                <h2 className="text-xl font-semibold">{lesson.title}</h2>
                                <p className="text-slate-400 mt-1">{lesson.description}</p>
                            </div>

                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {lesson.signs.map((signItem: any) => (
                                    <div key={signItem.sign.id} onClick={() => window.location.href = `/practice/${lesson.id}`} className="block">
                                        <div className="p-4 bg-slate-700/30 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-500/50 group">
                                            <h3 className="font-medium group-hover:text-blue-400 transition-colors">
                                                {signItem.sign.name}
                                            </h3>
                                            <div className="mt-2 flex justify-between items-center text-xs text-slate-500">
                                                <span>Difficulty: {signItem.sign.difficulty}</span>
                                                <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Practice →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
