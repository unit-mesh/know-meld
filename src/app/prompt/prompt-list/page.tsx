'use client';

import PromptItem from "@/components/prompt/PromptItem";
import { useEffect, useState } from "react";


export default function Page() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        fetch('/api/prompts')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => setPrompts(data))
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    function onDelete(name: string) {
        fetch(`/api/prompts/${name}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                setPrompts(prompts.filter(prompt => prompt.name !== name));
            })
            .catch((error) => console.error('Delete error:', error));
    }

    const filterPrompts = () => {
        const match = searchQuery.toLowerCase();
        return prompts.filter(prompt =>
            prompt.name.toLowerCase().includes(match)
            || prompt.content.toLowerCase().includes(match)
            || prompt.tags.some(tag => tag.toLowerCase().includes(match))
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mx-auto p-4">
                <input
                    type="text"
                    className="border rounded p-2 w-full"
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {filterPrompts().map((prompt, index) => (
                <PromptItem key={index} prompt={prompt} onDelete={onDelete} />
            ))}
        </div>
    );
}