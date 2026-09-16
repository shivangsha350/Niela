// components/NavImage.tsx
import Image from "next/image";

export default function NavImage() {
  return (
    <section className="relative w-full bg-[#a580e4] overflow-hidden">
      <div className="w-full">
        <Image
          src="/images/Ladkiya.png"
          alt="Everyday Comfort, Reliable Protection, Total Confidence"
          width={2048}
          height={818}
          priority
          unoptimized
          className="w-full h-auto block"
          sizes="100vw"
        />
      </div>
    </section>
  );
}