import { Card, Tag, Button } from "antd";
import DataExport from "../dataconvert/DataExport";
import { DeleteOutlined } from '@ant-design/icons';
import TextViewer from "../dataview/TextViewer";

interface Props {
    prompt: Prompt;
    onDelete: (name: string) => void;
}

export default function PromptItem({ prompt, onDelete }: Props) {
    function parseToMarkdownContent(tags: string[], content: string) {
        const formattedTags = tags.length > 0 ? `${tags.map(tag => `#${tag}`).join(' ')}\n` : '';
        return `${formattedTags}${content}`;
    }

    return (
        <div className="mx-auto p-4">
            <Card
                title={
                    <>
                        {prompt.name}
                        {prompt.tags.map((tag) => (
                            <Tag key={tag} style={{ marginLeft: 8 }}>{tag}</Tag>
                        ))}
                    </>
                }
                extra={
                    <>
                        <DataExport data={parseToMarkdownContent(prompt.tags, prompt.content)} />
                        <Button type="link" onClick={() => onDelete(prompt.name)}><DeleteOutlined /></Button>
                    </>
                }
            >
                <p>
                    <TextViewer content={prompt.content} />
                </p>
            </Card>
        </div>
    );
}