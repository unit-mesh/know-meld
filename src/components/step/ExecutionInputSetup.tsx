
import { useState } from "react";
import { Button, Input } from "antd";

const { TextArea } = Input;

interface Props {
    historicalContent?: string;
    handleFinishAction: (content: string) => void;
}

export default function ExecutionInputSetup({ historicalContent, handleFinishAction }: Props) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <div>
            <TextArea
                autoSize
                value={content}
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
        </div>
    );
}
