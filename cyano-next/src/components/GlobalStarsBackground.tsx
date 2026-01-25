"use client";

import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export const GlobalStarsBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
            <StarsBackground starDensity={0.00012} />
            <ShootingStars
                starColor="#00F2FF"
                trailColor="#0066FF"
                minDelay={2000}
                maxDelay={5000}
            />
        </div>
    );
};
