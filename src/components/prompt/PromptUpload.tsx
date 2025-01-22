'use client'

import { useState } from 'react';
import { Upload, Button, Input, message, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { removeFileExtension } from '@/utils/fileUtil';

export default function PromptUpload() {
    const [name, setName] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const handleFileUpload = (file: File) => {
        const name = removeFileExtension(file.name)
        setName(name);

        const reader = new FileReader();
        reader.onload = (e) => setContent(e.target?.result as string);
        reader.readAsText(file);

        return false;
    };

    const handleSubmit = async () => {
        const res = await fetch('/api/prompt/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, content }),
        });

        if (res.ok) {
            message.success('Prompt upload success');
        } else {
            message.error('Prompt upload error');
        }

        setName('');
    };

    return (
        <Space>
            <Upload
                beforeUpload={handleFileUpload}
                maxCount={1}
                accept=".md,.txt,.text"
            >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <Button
                type="primary"
                disabled={!name || !content}
                onClick={handleSubmit}>
                Submit
            </Button>
        </Space>
    );
}
