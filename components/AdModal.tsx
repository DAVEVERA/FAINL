import { FC, useState, useEffect } from 'react';
import { PlayCircle, Shield, Zap } from 'lucide-react';

interface AdModalProps {
    isOpen: boolean;
    onAdComplete: () => void;
}

export const AdModal: FC<AdModalProps> = ({ isOpen, onAdComplete }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(5);
            setCanSkip(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanSkip(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl relative flex flex-col">
                {/* Ad Video Placeholder */}
                <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center flex-col gap-4 border-b border-black/5 dark:border-white/5">
                    <PlayCircle className="w-12 h-12 text-black/20 dark:text-white/20" />
                    <p className="font-mono text-sm text-black/40 dark:text-white/40 tracking-widest uppercase">
                        Sponsor Message
                    </p>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-0 left-0 h-1 bg-black dark:bg-white transition-all duration-1000" style={{ width: `${((5 - timeLeft) / 5) * 100}%` }} />
                </div>

                {/* Content */}
                <div className="p-8 pb-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
                        <Zap className="w-6 h-6 text-white dark:text-black" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight dark:text-white">
                            Unlocking your 2nd free turn...
                        </h2>
                        <p className="text-black/60 dark:text-white/60">
                            Please wait a moment while we process this sponsor message to keep the FAINL grid running.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (canSkip) onAdComplete();
                        }}
                        disabled={!canSkip}
                        className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${canSkip
                                ? 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] shadow-xl'
                                : 'bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30 cursor-not-allowed'
                            }`}
                    >
                        {canSkip ? (
                            <>
                                Continue to consensus <Shield className="w-4 h-4 ml-1" />
                            </>
                        ) : (
                            `Please wait... ${timeLeft}s`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
