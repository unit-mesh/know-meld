
import { useState } from "react";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import TextViewer from "../dataview/TextViewer";

export default function ContextSetup({ historicalContent, handleFinishAction }: StepNodeProps) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode
            continueable={true}
            onContinue={() => handleFinishAction(content)}
            handleUpload={(name, content) => setContent(content)}
        >
            <TextViewer content={content} onContentChange={(newContent) => setContent(newContent)} />
        </StepNode>
    );
}
