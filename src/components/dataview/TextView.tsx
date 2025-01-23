'use client';

import { Typography } from "antd";
import { useState } from "react";
import { FileOutlined, FileTextOutlined } from '@ant-design/icons';

interface Props {
    text: string,
    rows: number,
    copyable?: boolean,
    onEdit?: (value: string) => void,
}

export default function TextView({ text, rows, copyable, onEdit }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Typography.Paragraph
            ellipsis={{
                rows: rows,
                expandable: 'collapsible',
                symbol: ((expanded: boolean) => expanded ? <FileOutlined /> : <FileTextOutlined />) as any,
                expanded,
                onExpand: (_, info) => setExpanded(info.expanded),
            }}
            editable={onEdit && {
                onChange: onEdit,
                text: text,
            }}
            copyable={copyable}
            style={{ whiteSpace: 'pre-wrap' }}
        >
            {text.trim()}
        </Typography.Paragraph>
    );
}