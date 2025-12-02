import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                SignCoach AI
            </h1>
            <p className="text-xl mb-12 text-slate-300 max-w-2xl">
                Master American Sign Language with real-time AI feedback.
                Practice anytime, anywhere, with your personal digital coach.
            </p>

            <div className="flex gap-6">
                <Link
                    href="/auth/signup"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                    Get Started
                </Link>
                <Link
                    href="/auth/login"
                    className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                    Log In
                </Link>
            </div>
        </main>
    );
}
