
import { useState } from "react";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import MarkdownViewer from "../dataview/MarkdownViewer";

export default function ContextSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            continueable={true}
            onContinue={() => handleFinishAction(content)}
            handleUpload={(name, content) => setContent(content)}
        >
            <MarkdownViewer content={content} onContentChange={(newContent) => setContent(newContent)} />
        </StepNode>
    );
}
