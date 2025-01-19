"use client"

import ContextSetup from '@/components/step/ContextSetup';
import WorkNode from '@/components/workflow/WorkNode';
import StepNode from "@/components/step/StepNode";
import TaskSetup from '@/components/step/TaskSetup';
import { useState } from 'react';
import { Task } from '@/core/Task';
import LLMExecute from '@/components/step/LLMExecute';
import { Steps } from 'antd';
import ExecutionInputSetup from '@/components/step/ExecutionInputSetup';


export default function Page() {
    const [currentStep, setCurrentStep] = useState(0);
    const [task, setTask] = useState<Task>({ goal: "" });
    const [context, setContext] = useState("");
    const [executionInput, setExecutionInput] = useState("")

    function handleTaskSetupFinishAction(value: Task): void {
        setTask(value);
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
                title: "Task",
                node: <TaskSetup handleFinishAction={handleTaskSetupFinishAction} />
            },
            {
                title: "Context",
                node: <ContextSetup handleFinishAction={handleContextSetupFinishAction} />
            },
            {
                title: "Input",
                node: <ExecutionInputSetup handleFinishAction={handleExecutionInputSetupFinishAction} />
            },
            {
                title: "Execute",
                node: <LLMExecute task={task} context={context} executionInput={executionInput} handleFinishAction={() => { }} />
            }
        ]

        return stepItems.map((stepItem, index) => {
            return {
                title: stepItem.title,
                description: index <= currentStage ? <StepNode>{stepItem.node}</StepNode> : undefined
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