import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-1 w-20 ">
      <Image src="/logo.svg" height={30} width={30} alt="logo" />
      <p
        className={cn(
          "font-semibold text-[11px] text-center w-full",
          font.className
        )}>
        Agentic Blog
      </p>
    </div>
  );
};

export default Logo;
