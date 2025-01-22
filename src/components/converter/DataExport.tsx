import React from 'react';
import { Button, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

interface DataExportProps {
  data: string;
}

const DataExport: React.FC<DataExportProps> = ({ data }) => {
  // 导出为TXT格式
  const exportAsTxt = () => {
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'data.txt');
  };

  // 导出为MD格式
  const exportAsMd = () => {
    const blob = new Blob([data], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'data.md');
  };

  // 创建导出菜单
  const menu = (
    <Menu>
      <Menu.Item onClick={exportAsTxt}>Export as txt</Menu.Item>
      <Menu.Item onClick={exportAsMd}>Export as md</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button type="link">
        <DownloadOutlined />
      </Button>
    </Dropdown>
  );
};

export default DataExport;
