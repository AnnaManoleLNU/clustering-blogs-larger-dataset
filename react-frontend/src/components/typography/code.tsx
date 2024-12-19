import { cn } from "@/lib/utils";

interface CodeProps {
    codeText?: string;
    className?: string;
}

export function Code({ className, codeText }: CodeProps) {
    return (
      <code className={
        cn(
            "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
            className
        )
      }>
        {codeText ? codeText : ''}
      </code>
    )
  }
  