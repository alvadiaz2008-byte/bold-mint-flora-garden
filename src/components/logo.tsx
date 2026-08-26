import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 text-fg", className)}
      aria-label="ATLAS TÁCTICO — inicio"
    >
      <svg
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M16 2.5 28 8.2v7.4c0 7.2-5.1 12.6-12 14.9C9.1 28.2 4 22.8 4 15.6V8.2L16 2.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M16 8.2 22.4 22h-2.6l-1.2-2.8h-5.2L12.2 22H9.6L16 8.2Zm-3 8.6h6L16 12.2 13 16.8Z"
          fill="currentColor"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-[0.18em]">
          ATLAS
        </span>
        <span className="text-[0.65rem] font-medium tracking-[0.32em] text-primary">
          TÁCTICO
        </span>
      </span>
    </Link>
  );
}
