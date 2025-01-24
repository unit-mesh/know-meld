import React from 'react';
import { Button, message } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';

interface DataArchiveProps {
    data: KnowEntry | KnowEntry[];
}

export default function DataArchive({ data }: DataArchiveProps) {
    const [archiveDone, setArchiveDone] = React.useState(true);
    const [archiveCount, setArchiveCount] = React.useState(0);

    async function archiveKnowEntry(knowEntry: KnowEntry) {
        const res = await fetch('/api/knowledge/know-entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(knowEntry),
        });

        if (res.ok) {
            message.success('Prompt upload success');
        } else {
            message.error('Prompt upload error');
        }

    }
    async function onClick() {
        setArchiveDone(false);
        let count = 0;
        if (data instanceof Array) {
            for (const knowEntry of data) {
                await archiveKnowEntry(knowEntry);
                count++;
            }
        }
        else {
            await archiveKnowEntry(data);
            count++;
        }
        setArchiveDone(true);
        setArchiveCount(count);
    }


    return (
        <Button
            type='link'
            disabled={!archiveDone}
            onClick={onClick}
        >
            <DatabaseOutlined />
            {archiveCount ? `+ ${archiveCount}` : ''}
        </Button>
    );
};