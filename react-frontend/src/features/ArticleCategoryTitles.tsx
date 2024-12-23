import { H2 } from "@/components/typography/h2";
import { Small } from "@/components/typography/small";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface ArticleCategoryTitlesProps {
  articleTitles: string;
}

export default function ArticleCategoryTitles({ articleTitles }: ArticleCategoryTitlesProps) {
  const [isArticlesOpen, setIsArticlesOpen] = useState<boolean>(false);
  return (
    <div className="">
    <div className="flex items-center gap-2">
      <H2 text="Gaming articles" />
      
      {isArticlesOpen ? <ChevronDownIcon onClick={() => setIsArticlesOpen(!isArticlesOpen)} className="bg-primary rounded-lg" /> : <ChevronUpIcon onClick={() => setIsArticlesOpen(!isArticlesOpen)} className="bg-primary rounded-lg"/>}
      </div>
      
      {isArticlesOpen && (
        <Small text={articleTitles} />
      )}
      </div>
  );
}