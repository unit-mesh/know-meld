import { Button, Card, Space } from "antd";
import { ReactNode } from "react";
import DataExport from "../converter/DataExport";
import DataArchive from "../converter/DataArchive";
import DocUpload from "../converter/DocUpload";

interface StepNodeProps {
    children: ReactNode;
    continueable?: boolean;
    onContinue?: () => void;
    handleUpload?: (name: string, content: string) => void;
    archiveData?: string;
    exportData?: string;
}

export default function StepNode({ children, continueable, onContinue, handleUpload, archiveData, exportData }: StepNodeProps) {

    function extraRander() {
        if (archiveData || exportData || handleUpload) {
            return (
                <Space>
                    {handleUpload && <DocUpload handleDocUploadAction={handleUpload} />}
                    {archiveData && <DataArchive data={archiveData} />}
                    {exportData && <DataExport data={exportData} />}
                </Space>
            )
        }

    }
    return (
        <Card extra={extraRander()}>
            <div className="w-full mx-auto justify-between">
                {children}
                {
                    continueable !== undefined &&
                    <div className="mt-4">
                        <Button type="primary"
                            disabled={!continueable}
                            onClick={onContinue}>
                            {"Continue"}
                        </Button>
                    </div>
                }
            </div>
        </Card>
    );
}
