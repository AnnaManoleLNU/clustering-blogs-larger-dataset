import { cn } from "@/lib/utils";

interface PProps {
    text?: string;
    className?: string;
}

export function P({ className, text }: PProps) {
    return (
      <p className={
        cn(
            "leading-7 [&:not(:first-child)]:mt-6",
            className
        )
      }>
        {text ? text : ''}
      </p>
    )
  }
  