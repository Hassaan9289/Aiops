import Image from "next/image";

export function BrandMark() {
  return (
   
      <div className="relative h-12 w-full max-w-[220px]">
        <Image
          src="/rclogo1.png"
          alt="Royal Cyber"
          fill
          className="object-contain"
          priority
        />
      </div>
     
    
  );
}
