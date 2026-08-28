import type { SVGProps } from "react";

export default function WhatsAppMark(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />

      <path
        d="M7.25 18.1 8 15.35a6.65 6.65 0 1 1 2.5 2.35l-3.25.4Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      <path
        d="M9.1 8.7c.2-.45.42-.46.65-.47h.55c.14 0 .31.05.4.29l.75 1.8c.08.2.05.35-.06.5l-.55.72c-.11.14-.22.27-.07.52.4.67.91 1.28 1.52 1.78.64.53 1.33.92 2.06 1.2.23.09.39.03.52-.13l.82-.99c.17-.2.34-.22.57-.14l1.64.78c.26.12.43.18.46.29.04.11.04.64-.15 1.26-.19.62-1.1 1.17-1.53 1.23-.4.06-.91.09-1.47-.09-.34-.11-.77-.25-1.33-.49-.56-.24-2.47-.92-4.2-3.22-1.44-1.9-1.7-3.32-1.88-3.88-.18-.56-.02-.87.12-1.06.13-.18.28-.32.4-.47.12-.14.16-.24.24-.41Z"
        fill="white"
      />
    </svg>
  );
}