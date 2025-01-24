import React, { use, useEffect, useState } from 'react';
import { Button, Input, message, Space, Typography } from 'antd';
import { CopyOutlined, EditOutlined, SaveOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
const { Paragraph } = Typography;

interface MarkdownViewerProps {
    content: string;
    onContentChange?: (content: string) => void;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, onContentChange }) => {
    const [markdown, setMarkdown] = useState<string>(content);
    const [isEditing, setIsEditing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setMarkdown(content);
    }, [content]);

    // Copy content to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(markdown);
            message.success('Markdown copied successfully!');
        } catch (error) {
            message.error('Copy failed, please copy manually');
        }
    };

    // Save edited content
    const handleSave = () => {
        setIsEditing(false);
        setIsCollapsed(false);
        message.success('Markdown content saved');
        if (onContentChange) {
            onContentChange(markdown);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsCollapsed(false);
    };

    const handleChange = (e: any) => {
        setMarkdown(e.target.value);
        if (onContentChange) {
            onContentChange(e.target.value);
        }
    };

    return (
        <div style={{ position: 'relative', padding: 16, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
            {/* Top right buttons */}
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <Space>
                    {isEditing ? (
                        <Button size="small" icon={<SaveOutlined />} onClick={handleSave} />
                    ) : (
                        <Button size="small" icon={<EditOutlined />} onClick={handleEdit} />
                    )}
                    <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} />
                    <Button
                        size="small"
                        icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    />
                </Space>
            </div>

            {isEditing ? (
                <TextArea
                    autoSize={{ minRows: 6 }}
                    value={markdown}
                    onChange={handleChange}
                    style={{ marginTop: 24 }}
                />
            ) : (
                <Paragraph
                    ellipsis={isCollapsed ? { rows: 2, expandable: false } : false}
                    style={{ marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </Paragraph>
            )}
        </div>
    );
};

export default MarkdownViewer;
