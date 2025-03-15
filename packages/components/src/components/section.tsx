import { HTMLProps, ReactNode } from "react";
import { cn } from "@/shadcn/utils";

export const Section = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLProps<HTMLDivElement>) => {
  return (
    <section
      {...props}
      className={cn(
        "flex flex-col gap-8 max-w-(--breakpoint-xl) w-full p-4",
        className,
      )}
    >
      {children}
    </section>
  );
};
