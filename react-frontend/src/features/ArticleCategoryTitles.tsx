import { H2 } from "@/components/typography/h2";
import { Small } from "@/components/typography/small";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface ArticleCategoryTitlesProps {
  title: string;
  articleTitles: string;
}

export default function ArticleCategoryTitles({ articleTitles, title }: ArticleCategoryTitlesProps) {
  const [isArticlesOpen, setIsArticlesOpen] = useState<boolean>(false);
  return (
    <div className="">
    <div className="flex items-center gap-2">
      <H2 text={title} />
      
      {isArticlesOpen ? <ChevronDownIcon onClick={() => setIsArticlesOpen(!isArticlesOpen)} className="bg-primary rounded-lg" /> : <ChevronUpIcon onClick={() => setIsArticlesOpen(!isArticlesOpen)} className="bg-primary rounded-lg"/>}
      </div>
      
      {isArticlesOpen && (
        <Small text={articleTitles} />
      )}
      </div>
  );
}