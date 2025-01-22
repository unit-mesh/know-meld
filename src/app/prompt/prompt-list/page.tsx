'use client';

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
                <Card
                    key={index}
                    title={prompt.name}
                >
                    {prompt.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                    <p>
                        <p>{prompt.content.replace(/\${(.*?)}/g, '________')}</p>
                    </p>
                </Card>
            )
            )}
        </div>
    );
}