
import { useState } from "react";
import { Input } from "antd";
import StepNode from "@/components/step/StepNode";

const { TextArea } = Input;

interface Props {
    historicalContent?: string;
    handleFinishAction: (content: string) => void;
}

export default function ContextSetup({ historicalContent, handleFinishAction }: Props) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <StepNode continueable={!!content} onContinue={() => handleFinishAction(content)}>
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
