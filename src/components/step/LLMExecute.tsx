
import { useState } from "react";
import ExamplePrompt from "@/prompts/Example.prompt"
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { StreamingMarkdownCodeBlock } from "@/utils/markdown/streaming/StreamingMarkdownCodeBlock";
import { Button } from "antd";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";

export default function LLMExecute({ contentInput }: StepNodeProps) {
    const [exceptionOutput, setExceptionOutput] = useState("");
    const [exceptionDone, setExceptionDone] = useState<boolean>(true);

    const executeTask = async () => {
        setExceptionOutput("")
        setExceptionDone(false);

        const { task, context, executionInput } = contentInput;

        const prompt = ExamplePrompt(task, context, executionInput)

        const response: Response = await fetch("/api/llm/glm", {
            method: "POST",
            headers: { Accept: "text/event-stream" },
            body: JSON.stringify({
                content: prompt
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

    return (
        <StepNode archiveData={exceptionOutput} exportData={exceptionOutput}>
            <div className="mb-4">
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
