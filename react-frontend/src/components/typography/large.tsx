import { cn } from "@/lib/utils";

interface LargeProps {
    text?: string;
    className?: string;
}

export function Large({ className, text }: LargeProps) {
    return (
      <div  className={
        cn(
            "text-lg font-semibold",
            className
        )
      }>
        {text ? text : ''}
      </div >
    )
  }
  