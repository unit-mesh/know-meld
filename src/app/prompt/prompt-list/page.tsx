'use client';

import PromptItem from "@/components/prompt/PromptItem";
import { Card, Tag } from "antd";
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
            {prompts.map((prompt, index) => (
                <PromptItem key={index} prompt={prompt} />
            )
            )}
        </div>
    );
}