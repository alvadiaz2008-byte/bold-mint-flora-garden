import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-elevated text-center text-xs tracking-wide text-subtle uppercase",
          className,
        )}
      >
        {alt}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-elevated", className)}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn(
          "max-h-full max-w-full w-auto h-auto object-contain saturate-[0.88] contrast-[1.04]",
          imgClassName,
        )}
      />
    </div>
  );
}
