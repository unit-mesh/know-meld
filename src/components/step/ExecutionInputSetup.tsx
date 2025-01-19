
import { useState } from "react";
import { Input } from "antd";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";

const { TextArea } = Input;

export default function ExecutionInputSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            handleDocUploadAction={(value) => setContent(value)}
            continueable={!!content}
            onContinue={() => handleFinishAction(content)}
        >
            <TextArea
                autoSize
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                }}
            />
        </StepNode>
    );
}
