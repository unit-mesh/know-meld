import { Card, Tag, Button } from "antd";
import DataExport from "../dataconvert/DataExport";
import { DeleteOutlined } from '@ant-design/icons';
import TextViewer from "../dataview/TextViewer";

interface Props {
    knowEntry: KnowEntry;
    onDelete: (knowenty: KnowEntry) => void;
}

export default function KnowEntryItem({ knowEntry, onDelete }: Props) {
    function parseToMarkdownContent(tags: string[], content: string) {
        const formattedTags = tags.length > 0 ? `${tags.map(tag => `#${tag}`).join(' ')}\n` : '';
        return `${formattedTags}${content}`;
    }

    return (
        <div className="mx-auto p-4">
            <Card
                title={
                    <>
                        {knowEntry.title}
                        {knowEntry.tags.map((tag) => (
                            <Tag key={tag} style={{ marginLeft: 8 }}>{tag}</Tag>
                        ))}
                    </>
                }
                extra={
                    <>
                        <DataExport data={parseToMarkdownContent(knowEntry.tags, knowEntry.content)} />
                        <Button type="link" onClick={() => onDelete(knowEntry)}><DeleteOutlined /></Button>
                    </>
                }
            >
                <p>
                    <TextViewer content={knowEntry.content} />
                </p>
            </Card>
        </div>
    );
}