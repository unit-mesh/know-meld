import { useEffect, useState } from "react";
import { Select } from "antd";
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";
import TextView from "../dataview/TextView";

export default function PromptSetup({ handleFinishAction }: StepNodeProps) {
    const [prompt, setPrompt] = useState<Prompt>();
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        fetch('/api/prompts')
            .then((res) => res.json())
            .then((data: Prompt[]) => {
                setPrompts(data);
            })
    }, []);

    const convertToPromptOptions = (prompts: Prompt[]) => {
        return prompts.map((prompt, index) => {
            return {
                value: index,
                label: prompt.name,
            };
        });
    }

    const handlePromptChange = (value: string) => {
        const prompt = prompts[parseInt(value)];
        setPrompt(prompt);
    };

    const handleEdit = (value: string) => {
        if (prompt) {
            setPrompt({ ...prompt, content: value });
        }
    }

    return (
        <StepNode continueable={!!prompt} onContinue={() => prompt && handleFinishAction(prompt.content)}>
            <Select
                placeholder="Prompt"
                style={{ width: "100%" }}
                onChange={handlePromptChange}
                options={convertToPromptOptions(prompts)}
            />
            <div className="mt-4">
                <TextView text={prompt ? prompt.content : ""} rows={1} copyable={true} onEdit={handleEdit} />
            </div>
        </StepNode>
    );
}
