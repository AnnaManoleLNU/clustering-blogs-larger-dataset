import { cn } from "@/lib/utils";

interface LeadProps {
    text?: string;
    className?: string;
}

export function Lead({ className, text }: LeadProps) {
    return (
      <p className={
        cn(
            "text-xl text-muted-foreground",
            className
        )
      }>
        {text ? text : ''}
      </p>
    )
  }
  