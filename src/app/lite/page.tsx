"use client"

import ContextSetup from '@/components/step/ContextSetup';
import WorkNode from '@/components/workflow/WorkNode';
import PromptSetup from '@/components/step/PromptSetup';
import { useState } from 'react';
import LLMExecute from '@/components/step/LLMExecute';
import { Steps } from 'antd';
import ExecutionInputSetup from '@/components/step/ExecutionInputSetup';


export default function Page() {
    const [currentStep, setCurrentStep] = useState(0);
    const [prompt, setPrompt] = useState<Prompt>();
    const [context, setContext] = useState("");
    const [executionInput, setExecutionInput] = useState("")

    function handlePromptSetupFinishAction(value: Prompt): void {
        setPrompt(value);
        setCurrentStep(1);
    }

    function handleContextSetupFinishAction(value: string): void {
        setContext(value);
        setCurrentStep(2);
    }

    function handleExecutionInputSetupFinishAction(value: string): void {
        setExecutionInput(value);
        setCurrentStep(3);
    }


    function convertToStepItems(currentStage: number) {
        const stepItems = [
            {
                title: "Prompt",
                node: <PromptSetup handleFinishAction={handlePromptSetupFinishAction} />
            },
            {
                title: "Context",
                node: <ContextSetup historicalContent={context} handleFinishAction={handleContextSetupFinishAction} />
            },
            {
                title: "Input",
                node: <ExecutionInputSetup historicalContent={executionInput} handleFinishAction={handleExecutionInputSetupFinishAction} />
            },
            {
                title: "Execute",
                node: <LLMExecute contentInput={{prompt, context, executionInput}} handleFinishAction={() => { }} />
            }
        ]

        return stepItems.map((stepItem, index) => {
            return {
                title: stepItem.title,
                description: index <= currentStage ? stepItem.node : undefined
            };
        }
        )
    }

    return (
        <WorkNode>
            <Steps
                direction="vertical"
                current={currentStep}
                items={convertToStepItems(currentStep)}
            />
        </WorkNode>
    );
}