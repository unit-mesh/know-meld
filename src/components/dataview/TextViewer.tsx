import React, { useEffect, useState } from 'react';
import { Button, Input, message, Space, Typography, Switch } from 'antd';
import { CopyOutlined, EditOutlined, SaveOutlined, UpOutlined, DownOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
const { Paragraph } = Typography;

interface TextViewerProps {
    content: string;
    onContentChange?: (content: string) => void;
    defaultMarkdownViewMode?: boolean;
}

const TextViewer: React.FC<TextViewerProps> = ({ content, onContentChange, defaultMarkdownViewMode }) => {
    const [text, setText] = useState<string>(content);
    const [isEditing, setIsEditing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [markdownViewMode, setMarkdownViewMode] = useState<boolean>(defaultMarkdownViewMode === undefined ? true : defaultMarkdownViewMode);

    useEffect(() => {
        setText(content);
    }, [content]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            message.success('Markdown copied successfully!');
        } catch (error) {
            message.error('Copy failed, please copy manually');
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        setIsCollapsed(false);
        message.success('Markdown content saved');
        if (onContentChange) {
            onContentChange(text);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsCollapsed(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (onContentChange) {
            onContentChange(e.target.value);
        }
    };

    return (
        <div style={{ position: 'relative', padding: 16, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <Space>
                    {
                        onContentChange &&
                        (isEditing ? (
                            <Button size="small" icon={<SaveOutlined />} onClick={handleSave} />
                        ) : (
                            <Button size="small" icon={<EditOutlined />} onClick={handleEdit} />
                        ))
                    }

                    <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} />
                    <Button
                        size="small"
                        icon={markdownViewMode ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        onClick={() => setMarkdownViewMode(!markdownViewMode)}
                    />
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
                    value={text}
                    onChange={handleChange}
                    style={{ marginTop: 24 }}
                />
            ) : markdownViewMode ? (
                <Paragraph
                    ellipsis={isCollapsed ? { rows: 2, expandable: false } : false}
                    style={{ marginTop: 16 }}
                >
                    <ReactMarkdown>{text}</ReactMarkdown>
                </Paragraph>
            ) : (
                <Paragraph
                    ellipsis={isCollapsed ? { rows: 2, expandable: false } : false}
                    style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}
                >
                    {text}
                </Paragraph>
            )}
        </div>
    );
};

export default TextViewer;
