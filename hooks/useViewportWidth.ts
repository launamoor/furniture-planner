"use client";

import { useState, useEffect } from "react";

export function useViewportWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
