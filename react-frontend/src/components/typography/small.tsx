import { cn } from "@/lib/utils";

interface SmallProps {
    text?: string;
    className?: string;
}

export function Small({ className, text }: SmallProps) {
    return (
      <small className={
        cn(
            "text-sm font-medium leading-none",
            className
        )
      }>
        {text ? text : ''}
      </small>
    )
  }
  