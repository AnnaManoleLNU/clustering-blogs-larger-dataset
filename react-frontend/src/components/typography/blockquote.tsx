import { cn } from "@/lib/utils";

interface BlockquoteProps {
    text?: string;
    className?: string;
}

export function Blockquote({ className, text }: BlockquoteProps) {
    return (
      <blockquote  className={
        cn(
            "mt-6 border-l-2 pl-6 italic",
            className
        )
      }>
        {text ? text : ''}
      </blockquote >
    )
  }
  