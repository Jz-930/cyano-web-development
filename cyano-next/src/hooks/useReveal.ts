"use client";

import { useEffect } from "react";

export function useReveal() {
    useEffect(() => {
        const revealElements = document.querySelectorAll(".reveal");

        // Immediately activate elements already in viewport
        revealElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add("active");
            }
        });

        // Set up observer for elements that scroll into view later
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.05, rootMargin: "50px" }
        );

        revealElements.forEach((el) => {
            if (!el.classList.contains("active")) {
                observer.observe(el);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);
}

