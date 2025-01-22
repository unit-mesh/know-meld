'use client';

import { Card, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import DataExport from "../step/DataExport";

interface Props {
    prompt: Prompt;
}

export default function PromptItem({ prompt }: Props) {
    const [expanded, setExpanded] = useState(false);

    function parseToMarkdownContent(tags: string[], content: string) {
        const formattedTags = tags.length > 0 ? `${tags.map(tag => `#${tag}`).join(' ')}\n` : '';
        return `${formattedTags}${content}`;
    }

    return (
        <div className="mx-auto p-4">
            <Card
                title={prompt.name}
                extra={<DataExport data={parseToMarkdownContent(prompt.tags, prompt.content)} />}
            >
                {prompt.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                ))}
                <p>
                    <Typography.Paragraph
                        ellipsis={{
                            rows: 2,
                            expandable: 'collapsible',
                            symbol: ((expanded: boolean) => expanded ? 'Hide' : 'Show') as any,
                            expanded,
                            onExpand: (_, info) => setExpanded(info.expanded),
                        }}
                        copyable
                    >
                        {prompt.content.replace(/\${(.*?)}/g, '____')}
                    </Typography.Paragraph>
                </p>
            </Card>
        </div>
    );
}