"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
    dependencies: any[] = []
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }, dependencies);

    return ref;
}
