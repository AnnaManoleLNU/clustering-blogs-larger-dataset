import { cn } from "@/lib/utils";

interface MutedProps {
    text?: string;
    className?: string;
}

export function Muted({ className, text }: MutedProps) {
    return (
      <p className={
        cn(
            "text-sm text-muted-foreground",
            className
        )
      }>
        {text ? text : ''}
      </p>
    )
  }
  