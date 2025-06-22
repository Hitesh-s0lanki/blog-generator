"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import Link from "next/link";
import Logo from "@/components/logo";

const Navbar = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 fixed flex items-center justify-between top-0 w-full p-3 px-8 md:px-20 lg:px-20 border-b ",
        scrolled && "shadow-sm"
      )}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between flex items-center gap-x-2">
        {!isLoaded && <Spinner />}

        {isLoaded && !isSignedIn && (
          <>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className=" bg-transparent">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700">
                Get First Blog
              </Button>
            </SignInButton>
          </>
        )}

        {isLoaded && isSignedIn && (
          <>
            <Button
              variant="outline"
              size="sm"
              className=" bg-transparent"
              asChild>
              <Link href="/blogs">View Blogs</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
