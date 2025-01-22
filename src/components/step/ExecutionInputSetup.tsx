
import { useState } from "react";
import { Input } from "antd";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import TextView from "../dataview/TextView";

const { TextArea } = Input;

export default function ExecutionInputSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            handleDocUploadAction={(value) => setContent(value)}
            continueable={!!content}
            onContinue={() => handleFinishAction(content)}
        >
            <TextView text={content} rows={1} onEdit={(text) => setContent(text)} />
        </StepNode>
    );
}
