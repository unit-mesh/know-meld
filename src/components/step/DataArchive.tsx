import React from 'react';
import { Button } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

interface DataArchiveProps {
    data: string;
}

export default function DataArchive({ data }: DataArchiveProps) {

    function dataToKnowEntry(data: string) {
        return {
            tags: [],
            content: data,
            timestamp: Date.now() / 1000,
        }
    }

    function knowEntryToMd(knowEntry: KnowEntry) {
        const { tags, content, timestamp } = knowEntry;

        // Format tags with '#' prepended
        const formattedTags = tags.length > 0 ? `${tags.map(tag => `#${tag}`).join(' ')}` : '';

        // Format timestamp into a human-readable date (optional)
        const formattedDate = timestamp ? `${new Date(timestamp * 1000).toLocaleString()}` : '';

        // Generate markdown content
        const markdown = `
${formattedTags}
\`\`\`
${content}
\`\`\`
${formattedDate}
`;

        return markdown;
    }

    function onClick() {

        const knowEntry = dataToKnowEntry(data);
        const mdContent = knowEntryToMd(knowEntry);

        const blob = new Blob([mdContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${knowEntry.timestamp}.md`);
    }


    return (
        <Button onClick={onClick}>
            Archive <DatabaseOutlined />
        </Button>
    );
};