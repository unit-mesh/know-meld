'use client'

import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { readFileContent } from '@/utils/fileUtil';
import { uploadAccept } from '@/core/constants';
import type { UploadFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

export default function Page() {
    const [uploadedFileList, setUploadedFileList] = useState<{ name: string; content: string }[]>([]);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    const handleFileChange = async ({ fileList }: { fileList: UploadFile[] }) => {
        const filesData = await Promise.all(
            fileList.map(async (file) => {
                if (!file.originFileObj) return null;
                try {
                    const { name, content } = await readFileContent(file.originFileObj);
                    console.log('content', content);
                    return { name, content };
                } catch (error) {
                    message.error(`Unable to read file ${file.name}`);
                    return null;
                }
            })
        );

        setUploadedFileList(filesData.filter((file): file is { name: string; content: string } => file !== null));
    };

    const handleSubmit = async () => {
        setUploadSuccess(false);

        for (const file of uploadedFileList) {
            const res = await fetch('/api/knowledge/know-entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: file.name, content: file.content }),
            });

            if (!res.ok) {
                message.error('KnowEntry upload error');
                return;
            }
        }

        setUploadedFileList([]);
        setUploadSuccess(true);
    };

    return (
        <div className="w-full">
            <div className='w-full p-4'>
                <Dragger
                    multiple
                    accept={uploadAccept.join(',')}
                    showUploadList={{ showRemoveIcon: false }}
                    beforeUpload={() => Promise.reject()}
                    onChange={handleFileChange}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag files to this area to upload</p>
                    <p className="ant-upload-hint">Support for single or bulk upload. Only {uploadAccept.join(', ')} files are supported.</p>
                </Dragger>
            </div>

            <div className='flex justify-center mb-4'>
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={uploadedFileList.length === 0}
                    className='mb-4'
                >
                    Submit
                </Button>
            </div>
            <div className='flex justify-center mb-4'>
                {uploadSuccess && (
                    <Button type="link" href="/knowledge/knowentry-list">
                        Upload succes! Check it out here.
                    </Button>
                )}
            </div>
        </div>
    );
}
