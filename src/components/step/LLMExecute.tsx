import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { StreamingMarkdownCodeBlock } from "@/utils/markdown/streaming/StreamingMarkdownCodeBlock";
import { Button } from "antd";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import MarkdownViewer from "../dataview/MarkdownViewer";

export default function LLMExecute({ contentInput }: StepNodeProps) {
    const [exceptionOutput, setExceptionOutput] = useState("");
    const [exceptionDone, setExceptionDone] = useState<boolean>(true);
    const [assembledPrompt, setAssembledPrompt] = useState("");

    useEffect(() => {
        const assembledPrompt = `${contentInput.prompt}\n${contentInput.context}\n${contentInput.executionInput}`
        console.log('assembledPrompt', assembledPrompt)
        setAssembledPrompt(assembledPrompt);
    }, [contentInput]);

    const executeTask = async () => {
        setExceptionOutput("")
        setExceptionDone(false);

        const response: Response = await fetch("/api/llm/glm", {
            method: "POST",
            headers: { Accept: "text/event-stream" },
            body: JSON.stringify({
                content: assembledPrompt
            }),
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let isDone = false;
        let content = "";
        while (!isDone) {
            const { value, done } = await reader.read();
            if (done) {
                isDone = true;
            }

            if (value) {
                const text = decoder.decode(value);
                content = content + text;

                const codeBlock = StreamingMarkdownCodeBlock.parse(content);
                setExceptionOutput(codeBlock.text);
            }
        }

        setExceptionDone(true);
    };

    const handleAssembledPromptEidt = (value: string) => {
        setAssembledPrompt(value);
    };

    return (
        <StepNode archiveData={exceptionOutput} exportData={exceptionOutput}>
            <div className="mb-4">
                <MarkdownViewer content={assembledPrompt} onContentChange={handleAssembledPromptEidt} />
                <Button
                    disabled={!exceptionDone}
                    onClick={executeTask}
                >
                    {"Excute"}
                </Button>
            </div>
            <CodeMirror
                value={exceptionOutput}
                editable={false}
                onChange={(value) => {
                    setExceptionOutput(value);
                }}
                extensions={[markdown()]}
                className="mb-4"
            />
        </StepNode>
    );
}
