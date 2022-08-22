import Image from "next/future/image";

export default function PlayerClass() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl text-white">Wretch</div>

      <Image
        className="aspect-[3/4]"
        src="/images/wretch.webp"
        alt="Samurai"
        width={450}
        height={600}
      />
    </div>
  );
}
