"use client";

import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { signOut } = useAuth();
  const { state, isMobile, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-between gap-x-5 border-b px-4 py-3">
      <div className=" flex gap-5 items-center">
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <h1 className="text-xl font-semibold capitalize ">
          {pathname.split("/")[1]}
        </h1>
      </div>
      <div className=" flex gap-2 items-center">
        <Button
          size="sm"
          className=" bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
          asChild>
          <Link href="/">Generate New</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className=" bg-transparent hidden md:flex lg:flex"
          onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
