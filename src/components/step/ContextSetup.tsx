
import { useState } from "react";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import TextView from "../dataview/TextView";
import DocUpload from "../converter/DocUpload";

export default function ContextSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            continueable={true}
            onContinue={() => handleFinishAction(content)}
        >
            <div className="mb-4">
                <DocUpload handleDocUploadAction={(name, content) => setContent(content)} />
            </div>
            <TextView text={content} rows={1} onEdit={(text) => setContent(text)} />
        </StepNode>
    );
}
