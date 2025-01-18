
import { useState } from "react";
import { Button, Card, Input } from "antd";
import StepNode from "@/components/workflow/StepNode";

const { TextArea } = Input;

interface Props {
    title: string
    historicalContent?: string;
    handleFinishAction: (selectedStep: string) => void;
}

export default function ContextInput({ title, historicalContent, handleFinishAction }: Props) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode>
            <Card
                title={title}
                extra={
                    <div className="space-x-4">
                    </div>
                }
            >
                <TextArea
                    value={content}
                    rows={20}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
                <div className="flex justify-between mt-4">
                    <Button type="primary"
                        disabled={content.length === 0}
                        onClick={() => {
                            handleFinishAction(content);
                        }}>
                        {"Save and Continue"}
                    </Button>
                </div>
            </Card>
        </StepNode>
    );
}
