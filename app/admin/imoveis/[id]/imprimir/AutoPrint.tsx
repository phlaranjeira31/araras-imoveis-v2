"use client";

import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    let cancelled = false;

    async function preparePrint() {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        const images = Array.from(
          document.querySelectorAll<HTMLImageElement>(
            "#property-print-sheet img"
          )
        );

        await Promise.all(
          images.map((img) => {
            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
              const finish = () => resolve();

              img.addEventListener("load", finish, {
                once: true,
              });

              img.addEventListener("error", finish, {
                once: true,
              });
            });
          })
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 350)
        );

        if (!cancelled) {
          window.print();
        }
      } catch {
        if (!cancelled) {
          window.print();
        }
      }
    }

    preparePrint();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}