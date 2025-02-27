import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer 
      className={cn(
        "w-full border-t bg-background py-6 px-4 md:px-6",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Image 
            src="/smallVanguard.png" 
            alt="Vanguard Parking Logo" 
            width={28} 
            height={28} 
            className="h-7 w-auto"
          />
          <span className="text-lg font-medium logo-text">Vanguard Parking</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} Vanguard Parking. All rights reserved.</p>
          <div className="hidden md:block">•</div>
          <nav className="flex items-center space-x-4">
            <Link href="#" className="hover:text-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
} 