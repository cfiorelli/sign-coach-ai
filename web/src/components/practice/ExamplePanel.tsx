import React from 'react';
import { Button } from '@/components/Button';

interface ExamplePanelProps {
    sign: any;
}

export function ExamplePanel({ sign }: ExamplePanelProps) {
    if (!sign) return <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 h-full flex items-center justify-center text-slate-400">Loading example...</div>;

    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
                <h2 className="text-xl font-bold text-white">{sign.name}</h2>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                {/* Visual Example */}
                <div className="aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-600 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={sign.imageUrl}
                        alt={sign.name}
                        className="w-full h-full object-contain p-4"
                    />
                </div>

                {/* Details */}
                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Handshape</p>
                            <p className="font-medium text-slate-200">{sign.handshape || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Location</p>
                            <p className="font-medium text-slate-200">{sign.location || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Movement</p>
                            <p className="font-medium text-slate-200">{sign.movement || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Orientation</p>
                            <p className="font-medium text-slate-200">{sign.orientation || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                        <p className="text-slate-300 italic">"{sign.description}"</p>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex gap-2">
                <Button variant="secondary" className="flex-1 text-sm">Replay</Button>
                <Button variant="outline" className="flex-1 text-sm">Slow Motion</Button>
            </div>
        </div>
    );
}
