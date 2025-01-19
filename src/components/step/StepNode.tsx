import { Button, Card } from "antd";
import { ReactNode } from "react";
import DocUpload from "./DocUpload";

export default function StepNode({ children, handleDocUploadAction, continueable, onContinue }: { children: ReactNode, handleDocUploadAction?: (value: string) => void, continueable?: boolean, onContinue?: () => void }) {
    return (
        <Card >
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
