import { Button, Card, Space } from "antd";
import { ReactNode } from "react";
import DataExport from "../converter/DataExport";
import DataArchive from "../converter/DataArchive";

interface StepNodeProps {
    children: ReactNode;
    continueable?: boolean;
    onContinue?: () => void;
    archiveData?: string;
    exportData?: string;
}

export default function StepNode({ children, continueable, onContinue, archiveData, exportData }: StepNodeProps) {

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
