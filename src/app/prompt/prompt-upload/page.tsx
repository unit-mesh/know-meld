'use client'

import { useState } from 'react';
import { Button, Input, message } from 'antd';
import DocUpload from '@/components/dataconvert/DocUpload';
import TextViewer from '@/components/dataview/TextViewer';

export default function Page() {
    const [name, setName] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    const handleFileUpload = (name: string, content: string) => {
        setName(name);
        setContent(content);
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
        setContent('');
        setUploadSuccess(true);
    };

    const handleEdit = (value: string) => {
        setContent(value);
    };

    const handleExample = () => {
        fetch('/api/prompts/example')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setContent(data.content);
            })
            .catch((error) => console.error('Fetch error:', error));

    };

    return (
        <div className="flex flex-col items-center p-4">

            <div className="w-full sm:w-3/4 mt-8 flex space-x-4">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="flex-1"
                />

                <DocUpload handleDocUploadAction={handleFileUpload} />
                <Button onClick={handleExample} className="flex-none">Example</Button>
            </div>

            <div className="w-full mt-8 bg-white p-4 rounded">
                <TextViewer content={content} onContentChange={handleEdit} />
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
