import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import mammoth from 'mammoth';
import { UploadRequestFile } from 'rc-upload/lib/interface';

interface Props {
  handleDocUploadAction: (value: string) => void;
}

export default function DocUpload({ handleDocUploadAction }: Props) {
  const handleDocUpload = (file: UploadRequestFile) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      // 根据文件类型判断如何处理
      const fileType = (file as File).name.split('.').pop()?.toLowerCase();

      reader.onload = () => {
        const result = reader.result;
        if (fileType === 'docx' && result instanceof ArrayBuffer) {
          // 处理 docx 文件
          mammoth.extractRawText({ arrayBuffer: result })
            .then((mammothResult) => {
              handleDocUploadAction(mammothResult.value);
              resolve();
            })
            .catch((error) => {
              console.error('Error reading document:', error);
              reject(error);
            });
        } else if (fileType === 'md' || fileType === 'txt' || fileType === 'text') {
          // 处理 md 或 txt 文件
          if (typeof result === 'string') {
            handleDocUploadAction(result);
            resolve();
          } else {
            reject(new Error('Failed to read the file as text.'));
          }
        } else {
          reject(new Error('Unsupported file type.'));
        }
      };

      // 根据文件类型使用不同的读取方法
      if (fileType === 'docx') {
        reader.readAsArrayBuffer(file as Blob); // 对于 .docx 文件，读取为 ArrayBuffer
      } else {
        reader.readAsText(file as Blob); // 对于文本文件 (.md, .txt, .text)，读取为文本
      }
    });
  };

  return (
    <Upload
      customRequest={({ file, onSuccess, onError }) => {
        handleDocUpload(file)
          .then(() => {
            onSuccess?.(file); // 文件处理成功，通知 Upload 组件
          })
          .catch((error) => {
            console.error('Error processing document:', error);
            onError?.(error); // 发生错误时，通知 Upload 组件
          });
      }}
      accept=".docx,.md,.txt,.text" // 支持更多类型的文件
      maxCount={1}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};
