import { Steps } from "antd";
import { useEffect, useState } from "react";

interface StepItem {
    step: string;
    title: string;
    status?: "finish" | "process" | "wait" | "error";
}

interface Props {
    currentStep: string;
    stepList: string[];
    handleStepOnchangeAction: (selectedStep: string) => void;
}

export default function ClickableSteps({currentStep, stepList, handleStepOnchangeAction }: Props) {
    const [stepItems, setStepItems] = useState<StepItem[]>([]);
    useEffect(() => {
        const items = stepList.map((step, index) => {
            return {
                step,
                title: step,
                status: currentStep === step ? "process" : currentStep === stepList[index + 1] ? "wait" : "finish" as "finish" | "process" | "wait" | "error"
            };
        });
        setStepItems(items);
    }, [currentStep, stepList]);

    const stepOnchange = (current: number) => {
        handleStepOnchangeAction(stepItems[current].step);
    };

    return (
        <Steps
            onChange={stepOnchange}
            items={stepItems}
        />
    );
}
