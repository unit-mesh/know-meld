
import { useState } from "react";
import { Button, Card, Input } from "antd";

const { TextArea } = Input;

interface Props {
    title: string
    historicalContent?: string;
    handleFinishAction: (content: string) => void;
}

export default function ContextInput({ title, historicalContent, handleFinishAction }: Props) {
    const [content, setContent] = useState(historicalContent || "");

    return (
        <Card
            title={title}
            extra={
                <div className="space-x-4">
                </div>
            }
        >
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
        </Card>
    );
}
