import Image from "next/image";

// Amar's AK emblem (public/logo.png, transparent corners). next/image serves
// a resized copy for the small sizes it's shown at.
export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      loading="eager"
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}
