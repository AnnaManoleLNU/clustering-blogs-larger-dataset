import { cn } from "@/lib/utils";

interface H3Props {
    text?: string;
    className?: string;
}

export function H3({ className, text }: H3Props) {
    return (
      <h3  className={
        cn(
            "scroll-m-20 text-2xl font-semibold tracking-tight",
            className
        )
      }>
        {text ? text : ''}
      </h3 >
    )
  }
  