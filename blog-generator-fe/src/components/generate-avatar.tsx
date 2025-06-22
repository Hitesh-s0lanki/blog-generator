import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type GenerateAvatarProps = {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
};

export function GenerateAvatar({
  seed,
  className,
  variant,
}: GenerateAvatarProps) {
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  }
  return (
    <Avatar className={className}>
      <AvatarImage src={avatar.toDataUri()}></AvatarImage>
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
