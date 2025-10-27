import { useState, useEffect } from "react";

export function useGitHubStars(repo: string) {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch star count:", error);
        setStarCount(0);
      }
    };

    fetchStars();
  }, [repo]);

  return starCount;
}
