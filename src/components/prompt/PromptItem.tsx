'use client';

import { Card, Tag, Typography, Button } from "antd";
import { useEffect, useState } from "react";
import DataExport from "../step/DataExport";
import { DeleteOutlined } from '@ant-design/icons';


interface Props {
    prompt: Prompt;
    onDelete: (name: string) => void;
}

export default function PromptItem({ prompt, onDelete }: Props) {
    const [expanded, setExpanded] = useState(false);

    function parseToMarkdownContent(tags: string[], content: string) {
        const formattedTags = tags.length > 0 ? `${tags.map(tag => `#${tag}`).join(' ')}\n` : '';
        return `${formattedTags}${content}`;
    }

    return (
        <div className="mx-auto p-4">
            <Card
                title={prompt.name}
                extra={
                    <>
                        <DataExport data={parseToMarkdownContent(prompt.tags, prompt.content)} />
                        <Button type="link" onClick={() => onDelete(prompt.name)}><DeleteOutlined /></Button> {/* Add delete button */}
                    </>
                }
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