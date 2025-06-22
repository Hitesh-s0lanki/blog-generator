"use client";

import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth, useUser } from "@clerk/nextjs";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserButton = () => {
  const isMobile = useIsMobile();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Wait until Clerk is loaded, and only render if signed in and we have a user
  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const avatar = user.imageUrl ? (
    <Avatar>
      <AvatarImage src={user.imageUrl} />
    </Avatar>
  ) : (
    <GenerateAvatar
      seed={user.fullName || user.id}
      variant="initials"
      className="mr-3 size-9"
    />
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="border-border/10 bg-primary/10 hover:bg-primary/20 flex w-full cursor-pointer items-center gap-x-2 overflow-hidden rounded-lg p-3">
          {avatar}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
            <p className="w-full truncate text-sm">{user.fullName}</p>
            <p className="text-muted-foreground w-full truncate text-xs">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <ChevronDownIcon className="size-3 shrink-0" />
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{user.fullName}</DrawerTitle>
            <DrawerDescription>
              {user.primaryEmailAddress?.emailAddress}
            </DrawerDescription>
          </DrawerHeader>

          <DrawerFooter className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => router.push("/billing")}>
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-border/10 bg-primary/10 hover:bg-primary/20 flex w-full cursor-pointer items-center gap-x-2 overflow-hidden rounded-lg p-3">
        {avatar}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
          <p className="w-full truncate text-sm">{user.fullName}</p>
          <p className="text-muted-foreground w-full truncate text-xs">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
        <ChevronDownIcon className="size-3 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{user.fullName}</span>
            <span className="text-sm text-muted-foreground truncate">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between"
          onClick={() => router.push("/billing")}>
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between"
          onClick={handleLogout}>
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
