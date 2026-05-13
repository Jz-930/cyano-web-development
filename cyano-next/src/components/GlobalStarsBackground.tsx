"use client";

import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export const GlobalStarsBackground = () => {
    return (
        <div className="global-stars-background fixed inset-0 z-0 pointer-events-none bg-[#030607]">
            <StarsBackground starDensity={0.0001} minTwinkleSpeed={0.7} maxTwinkleSpeed={1.5} />
            <ShootingStars
                starColor="#7EF5D6"
                trailColor="#3FA0A6"
                minDelay={2600}
                maxDelay={7200}
                starWidth={14}
            />
        </div>
    );
};
