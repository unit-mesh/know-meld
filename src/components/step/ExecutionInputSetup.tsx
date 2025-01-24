
import { useState } from "react";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import MarkdownViewer from "../dataview/MarkdownViewer";
import DocUpload from "../converter/DocUpload";

export default function ExecutionInputSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            continueable={true}
            onContinue={() => handleFinishAction(content)}
        >
            <div className="mb-4">
                <DocUpload handleDocUploadAction={(name, content) => setContent(content)} />
            </div>
            <MarkdownViewer content={content} onContentChange={(newContent) => setContent(newContent)} />
        </StepNode>
    );
}
