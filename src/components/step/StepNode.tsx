import { Button, Card, Space } from "antd";
import { ReactNode } from "react";
import DocUpload from "../converter/DocUpload";
import DataExport from "../converter/DataExport";
import DataArchive from "../converter/DataArchive";

interface StepNodeProps {
    children: ReactNode;
    handleDocUploadAction?: (name: string, content: string) => void;
    continueable?: boolean;
    onContinue?: () => void;
    archiveData?: string;
    exportData?: string;
}

export default function StepNode({ children, handleDocUploadAction, continueable, onContinue, archiveData, exportData }: StepNodeProps) {

    function extraRander() {
        if (archiveData && exportData) {
            return (
                <Space>
                    <DataArchive data={archiveData} />
                    <DataExport data={exportData} />
                </Space>
            )
        }
        else return (
            (archiveData && <DataArchive data={archiveData} />)
            || (exportData && <DataExport data={exportData} />)
        )
    }
    return (
        <Card extra={extraRander()}>
            <div className="w-full mx-auto justify-between">
                {
                    handleDocUploadAction &&
                    <div className="mb-4">
                        <DocUpload handleDocUploadAction={handleDocUploadAction} />
                    </div>
                }
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
