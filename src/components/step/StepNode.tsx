import { Button, Card, Space } from "antd";
import { ReactNode } from "react";
import DocUpload from "./DocUpload";
import DataExport from "./DataExport";
import DataArchive from "./DataArchive";

export default function StepNode({ children, handleDocUploadAction, continueable, onContinue, archiveData, exportData }: { children: ReactNode, handleDocUploadAction?: (value: string) => void, continueable?: boolean, onContinue?: () => void, archiveData?: string, exportData?: string }) {

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
