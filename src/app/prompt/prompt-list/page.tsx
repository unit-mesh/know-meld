'use client';

import PromptItem from "@/components/prompt/PromptItem";
import { useEffect, useState } from "react";


export default function Page() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        fetch('/api/prompt/prompts')
            .then((res) => res.json())
            .then((data) => setPrompts(data));
    }, []);

    function onDelete(name: string) {
        fetch(`/api/prompt/prompts/${name}`, { method: 'DELETE' })
            .then(() => setPrompts(prompts.filter(prompt => prompt.name !== name)));
    }

    return (
        <div className="container mx-auto p-4">
            {prompts.map((prompt, index) => (
                <PromptItem key={index} prompt={prompt} onDelete={onDelete} />
            )
            )}
        </div>
    );
}