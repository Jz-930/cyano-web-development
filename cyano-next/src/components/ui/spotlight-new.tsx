"use client";
import React from "react";
import { motion } from "motion/react";

type SpotlightProps = {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    translateY?: number;
    width?: number;
    height?: number;
    smallWidth?: number;
    duration?: number;
    xOffset?: number;
    inverted?: boolean;
};

export const Spotlight = ({
    gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(180, 100%, 50%, .08) 0, hsla(180, 100%, 50%, .02) 50%, hsla(180, 100%, 45%, 0) 80%)",
    gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(180, 100%, 50%, .06) 0, hsla(180, 100%, 50%, .02) 80%, transparent 100%)",
    gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(180, 100%, 50%, .04) 0, hsla(180, 100%, 45%, .02) 80%, transparent 100%)",
    translateY = -350,
    width = 560,
    height = 1380,
    smallWidth = 240,
    duration = 7,
    xOffset = 100,
    inverted = false,
}: SpotlightProps = {}) => {
    // For inverted mode, flip the vertical positioning
    const verticalPosition = inverted ? "bottom-0" : "top-0";
    const verticalOrigin = inverted ? "origin-bottom-left" : "origin-top-left";
    const verticalOriginRight = inverted ? "origin-bottom-right" : "origin-top-right";
    const rotateLeft = inverted ? 45 : -45;
    const rotateRight = inverted ? -45 : 45;
    const actualTranslateY = inverted ? -translateY : translateY;

    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 1.5,
            }}
            className="pointer-events-none absolute inset-0 h-full w-full"
        >
            <motion.div
                animate={{
                    x: [0, xOffset, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={`absolute ${verticalPosition} left-0 w-screen h-screen z-40 pointer-events-none`}
            >
                <div
                    style={{
                        transform: `translateY(${actualTranslateY}px) rotate(${rotateLeft}deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute ${verticalPosition} left-0 mix-blend-plus-lighter`}
                />

                <div
                    style={{
                        transform: `rotate(${rotateLeft}deg) translate(5%, ${inverted ? '50%' : '-50%'})`,
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute ${verticalPosition} left-0 ${verticalOrigin} mix-blend-plus-lighter`}
                />

                <div
                    style={{
                        transform: `rotate(${rotateLeft}deg) translate(-180%, ${inverted ? '70%' : '-70%'})`,
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute ${verticalPosition} left-0 ${verticalOrigin} mix-blend-plus-lighter`}
                />
            </motion.div>

            <motion.div
                animate={{
                    x: [0, -xOffset, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={`absolute ${verticalPosition} right-0 w-screen h-screen z-40 pointer-events-none`}
            >
                <div
                    style={{
                        transform: `translateY(${actualTranslateY}px) rotate(${rotateRight}deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute ${verticalPosition} right-0 mix-blend-plus-lighter`}
                />

                <div
                    style={{
                        transform: `rotate(${rotateRight}deg) translate(-5%, ${inverted ? '50%' : '-50%'})`,
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute ${verticalPosition} right-0 ${verticalOriginRight} mix-blend-plus-lighter`}
                />

                <div
                    style={{
                        transform: `rotate(${rotateRight}deg) translate(180%, ${inverted ? '70%' : '-70%'})`,
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute ${verticalPosition} right-0 ${verticalOriginRight} mix-blend-plus-lighter`}
                />
            </motion.div>
        </motion.div>
    );
};
