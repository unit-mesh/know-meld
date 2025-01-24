import { useEffect, useState } from "react";
import { Button } from "antd";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import TextViewer from "../dataview/TextViewer";

export default function LLMExecute({ contentInput, handleFinishAction }: StepNodeProps) {
    const [exceptionOutput, setExceptionOutput] = useState("");
    const [exceptionDone, setExceptionDone] = useState<boolean>(true);
    const [assembledPrompt, setAssembledPrompt] = useState("");

    useEffect(() => {
        const assembledPrompt = `${contentInput.prompt}\n${contentInput.context}\n${contentInput.executionInput}`
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
                setExceptionOutput(content);
            }
        }

        setExceptionDone(true);
    };

    const handleAssembledPromptEidt = (value: string) => {
        setAssembledPrompt(value);
    };

    const convertToKownEntry = (): KnowEntry => {
        return {
            title: "llmexecute",
            content: exceptionOutput,
            tags: [],
        };
    }

    return (
        <StepNode
            archiveData={convertToKownEntry()}
            exportData={exceptionOutput}
            continueable={!!exceptionOutput && exceptionDone}
            onContinue={handleFinishAction && (() => handleFinishAction(exceptionOutput))}
        >
            <div className="mb-4">
                <TextViewer content={assembledPrompt} onContentChange={handleAssembledPromptEidt} />
                <Button
                    disabled={!exceptionDone}
                    onClick={executeTask}
                    type="primary"
                    className="mt-4"
                >
                    {"Excute"}
                </Button>
            </div>
            <TextViewer content={exceptionOutput} defaultMarkdownViewMode={false} />
        </StepNode>
    );
}
