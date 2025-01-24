import { Steps } from "antd";
import { ReactNode } from "react";

interface Step {
    title: string,
    node: ReactNode,
}

interface Props {
    currentStep: number;
    stepList: Step[];
}

export default function StepProcess({ currentStep, stepList }: Props) {

    function convertToItems(currentStage: number) {
        return stepList.map((stepItem, index) => {
            return {
                title: stepItem.title,
                description: index <= currentStage ? stepItem.node : undefined
            };
        })
    }

    return (
        <Steps
            direction="vertical"
            progressDot
            current={currentStep}
            items={convertToItems(currentStep)}
        />
    );
}
