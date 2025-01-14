import { Steps } from "antd";
import { useEffect, useState } from "react";

interface StepItem {
    step: string;
    title: string;
    disabled: boolean;
    status: "finish" | "process" | "wait";
}

interface Props {
    currentStep: string;
    stepList: string[];
    handleStepOnchangeAction: (selectedStep: string) => void;
}

export default function ClickableSteps({ currentStep, stepList, handleStepOnchangeAction }: Props) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stepItems, setStepItems] = useState<StepItem[]>([]);
    useEffect(() => {
        const currentStepIndex = stepList.indexOf(currentStep);
        setCurrentStepIndex(currentStepIndex);
        const items = convertToStemItems(currentStepIndex, stepList);
        setStepItems(items);
    }, [currentStep, stepList]);

    const convertToStemItems = (currentStepIndex: number, stepList: string[]) => {
        return stepList.map((step, index) => {
            return {
                step,
                title: step,
                status: currentStepIndex === index ? "process" : currentStepIndex > index ? "finish" : "wait" as "finish" | "process" | "wait",
                disabled: currentStepIndex < index,
            };
        });
    }

    const stepOnchange = (current: number) => {
        handleStepOnchangeAction(stepItems[current].step);
    };

    return (
        <Steps
            current={currentStepIndex}
            onChange={stepOnchange}
            items={stepItems}
        />
    );
}
