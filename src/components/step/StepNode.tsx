import { Button, Card } from "antd";
import { ReactNode } from "react";

export default function StepNode({ children, continueable, onContinue }: { children: ReactNode, continueable?: boolean, onContinue?: () => void }) {
    return (
        <Card>
            <div className="w-full mx-auto justify-between mt-4">
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
