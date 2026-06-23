import Link from "next/link";
import { Instagram, MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ContactButtonsProps = {
  className?: string;
  layout?: "row" | "column";
  size?: "default" | "sm" | "lg";
  contacts?: {
    instagramUrl?: string | null;
    mapsUrl?: string | null;
    whatsappUrl?: string | null;
  };
};

export function ContactButtons({
  className,
  layout = "row",
  size = "default",
  contacts,
}: ContactButtonsProps) {
  const contactItems = [
    {
      href: contacts ? contacts.instagramUrl : CONTACT.instagram,
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: contacts ? contacts.mapsUrl : CONTACT.maps,
      label: "Konum",
      icon: MapPin,
    },
    {
      href: contacts ? contacts.whatsappUrl : CONTACT.whatsapp,
      label: "WhatsApp",
      icon: MessageCircle,
    },
  ].filter((item) => Boolean(item.href));

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-3",
        layout === "column" ? "flex-col" : "flex-row flex-wrap justify-center",
        className
      )}
    >
      {contactItems.map(({ href, label, icon: Icon }) => (
        <Button
          key={label}
          asChild
          variant="secondary"
          size={size}
          className="min-w-[7.5rem]"
        >
          <Link
            href={href!}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
