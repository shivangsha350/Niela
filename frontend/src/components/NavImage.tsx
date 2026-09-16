// components/HeroBanner.tsx
import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="relative w-full">
      <div className="relative w-full aspect-[2560/974]">
        <Image
          src="/images/Ladkiya.png"
          alt="Niela Hero Banner"
          fill
          priority
          quality={100}
          className="object-contain"
          sizes="100vw"
        />
      </div>
    </section>
  );
}