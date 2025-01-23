
import { useState } from "react";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import TextView from "../dataview/TextView";

export default function ExecutionInputSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            handleDocUploadAction={(name, content) => setContent(content)}
            continueable={true}
            onContinue={() => handleFinishAction(content)}
        >
            <TextView text={content} rows={1} onEdit={(text) => setContent(text)} />
        </StepNode>
    );
}
