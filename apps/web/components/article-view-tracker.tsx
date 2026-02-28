"use client";

import { useEffect } from "react";
import { incrementView } from "../lib/api";

export function ArticleViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    void incrementView(articleId);
  }, [articleId]);

  return null;
}

