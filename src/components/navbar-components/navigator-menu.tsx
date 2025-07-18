import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NAVIGATION_LINKS } from "@/utils/constants";
import Link from "next/link";

export default function NavigatorMenu() {
  return (
    <NavigationMenu className="max-md:hidden">
      <NavigationMenuList className="gap-2">
        {NAVIGATION_LINKS.map((link, index) => {
          const Icon = link.icon;
          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link href={link.href} className="flex size-8 items-center justify-center p-1.5" title={link.label}>
                  <Icon aria-hidden="true" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
