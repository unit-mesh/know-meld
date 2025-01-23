'use client'

import { useState } from 'react';
import { Upload, Button, Input, message, Space, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { removeFileExtension } from '@/utils/fileUtil';

const { Dragger } = Upload;

export default function Page() {
    const [name, setName] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    const handleUpload: UploadProps["customRequest"] = async (options) => {
        const { onSuccess, onError, file } = options;

        handleFileUpload(file as File);
        onSuccess?.({}, file);
        setUploadSuccess(false);
    };

    const handleFileUpload = (file: File) => {
        const name = removeFileExtension(file.name)
        setName(name);

        const reader = new FileReader();
        reader.onload = (e) => setContent(e.target?.result as string);
        reader.readAsText(file);

        return false;
    };

    const handleSubmit = async () => {
        const res = await fetch('/api/prompts', {
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
        setUploadSuccess(true);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <Dragger
                className="w-full h-64"
                customRequest={handleUpload}
                maxCount={1}
                accept=".md,.txt,.text"
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag file here or click to upload</p>
                <p className="ant-upload-hint">Supports .md, .txt, .text files</p>
            </Dragger>

            <div className="w-full sm:w-1/2 mt-8">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
            </div>

            <Button
                className="mt-4"
                type="primary"
                disabled={!name || !content}
                onClick={handleSubmit}
            >
                Submit
            </Button>

            {uploadSuccess && (
                <div className="mt-4 text-green-600">
                    <Button type="link" href="/prompt/prompt-list">
                        Upload succes! Check it out here.
                    </Button>
                </div>
            )}
        </div>
    );
}
