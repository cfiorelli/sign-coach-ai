'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/practice/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401) {
                    router.push('/auth/login');
                    return;
                }

                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [router]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold">Your Dashboard</h1>
                <Link href="/curriculum">
                    <Button>Start Practice</Button>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress Section */}
                <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                    {stats?.progress.length === 0 ? (
                        <p className="text-slate-400">No progress yet. Start practicing!</p>
                    ) : (
                        <div className="space-y-4">
                            {stats?.progress.map((p: any) => (
                                <div key={p.id} className="flex justify-between items-center">
                                    <span>{p.sign.name}</span>
                                    <div className="w-1/2 bg-slate-700 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${Math.min(p.fluency, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Sessions */}
                <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
                    {stats?.recentSessions.length === 0 ? (
                        <p className="text-slate-400">No recent sessions.</p>
                    ) : (
                        <div className="space-y-4">
                            {stats?.recentSessions.map((s: any) => (
                                <div key={s.id} className="p-4 bg-slate-700/50 rounded-lg">
                                    <div className="flex justify-between text-sm text-slate-300">
                                        <span>{new Date(s.startedAt).toLocaleDateString()}</span>
                                        <span>{s.attempts.length} attempts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
