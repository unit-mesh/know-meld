import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { readFileContent } from '@/utils/fileUtil';
import { uploadAccept } from '@/core/constants';

interface Props {
  handleDocUploadAction: (name: string, content: string) => void;
}
export default function DocUpload({ handleDocUploadAction }: Props) {

  const handleDocUpload = (file: File) => {
    return readFileContent(file).then(({ name, content }) => {
      handleDocUploadAction(name, content);
    });
  };

  return (
    <Upload
      customRequest={({ file, onSuccess, onError }) => {
        handleDocUpload(file as File)
          .then(() => onSuccess?.(file))
          .catch(onError);
      }}
      accept={uploadAccept.join(',')}
      maxCount={1}
      showUploadList={false}
    >
      <Button type='link'><UploadOutlined /></Button>
    </Upload>
  );
};
