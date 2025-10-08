import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/contexts/PageTitleContext";

type Padding = "none" | "sm" | "md" | "lg"

const PAD: Record<Padding, string> = {
  none: "p-0",
  sm: "px-3  sm:px-4  lg:px-4 py-2",
  md: "px-4 sm:px-4 py-0",
  lg: "px-6 sm:px-4  py-0",
}

export default function Page({
  children,
  className,
  title,
  /** content max width; false = no max */
  max = "max-w-10xl" as string | false,
  /** center the content block (no effect when max=false) */
  center = true,
  /** outer padding around the content */
  padding = "sm" as Padding,
}: React.PropsWithChildren<{
  className?: string
  title?: string
  max?: string | false
  center?: boolean
  padding?: Padding
}>) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title, setTitle]);
  return (
    <main
      className={cn(
        "w-full h-full",                 // stretch
        PAD[padding],                    // padding preset
        max ? max : "",                  // optional max width
        max && center ? "mx-auto" : "",  // optional centering
        className
      )}
    >
      {children}
    </main>
  )
}
