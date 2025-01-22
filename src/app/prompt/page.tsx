'use client';

import PromptList from "@/components/prompt/PromptList";
import PromptUpload from "@/components/prompt/PromptUpload";
import { useEffect, useState } from "react";


export default function Page() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    fetch('/api/prompt/prompts')
      .then((res) => res.json())
      .then((data) => setPrompts(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <PromptUpload />
      <PromptList prompts={prompts} />
    </div>
  );
}