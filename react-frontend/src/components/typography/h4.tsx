import { cn } from "@/lib/utils";

interface H4Props {
    text?: string;
    className?: string;
}

export function H4({ className, text }: H4Props) {
    return (
      <h4 className={
        cn(
            "scroll-m-20 text-xl font-semibold tracking-tight",
            className
        )
      }>
        {text ? text : ''}
      </h4>
    )
  }
  