"use client"

import ContextInput from '@/components/business/ContextInput';
import WorkNode from '@/components/workflow/WorkNode';
import StepNode from "@/components/workflow/StepNode";
import TaskSetup from '@/components/business/TaskSetup';
import { useState } from 'react';
import { Task } from '@/core/Task';
import StepProcess from '@/components/workflow/StepProcess';
import LLMExecute from '@/components/business/LLMExecute';


const steps = ["Task Setup", "Context Input", "Execute", "Export"];
export default function Page() {
    const [currentStep, setCurrentStep] = useState(0);
    const [taskSetting, setTaskSetting] = useState({});
    const [context, setContext] = useState("");

    function handleTaskSetupFinishAction(value: Task): void {
        setTaskSetting(value);
        setCurrentStep(1);
    }

    function handleContextInputFinishAction(value: string): void {
        setContext(value);
        setCurrentStep(2);
    }

    function renderCurrentStep() {
        switch (currentStep) {
            case 0:
                return <TaskSetup handleFinishAction={handleTaskSetupFinishAction} />;
            case 1:
                return <ContextInput title='Context Input' handleFinishAction={handleContextInputFinishAction} />;
            case 2:
                return <LLMExecute handleFinishAction={() => { }} />;
            default:
                return null;
        }
    }

    return (
        <WorkNode>
            <StepProcess currentStep={currentStep} stepList={steps} finished={false} />
            <StepNode>
                {renderCurrentStep()}
            </StepNode>
        </WorkNode>
    );
}