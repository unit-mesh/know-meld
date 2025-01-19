import { Steps } from "antd";
import { ReactNode, useEffect, useState } from "react";

interface StepItem {
    title: string,
    node?: ReactNode,
}

interface Props {
    currentStep: number;
    stepList: StepItem[];
    finished: boolean;
}

export default function StepProcess({ currentStep, stepList }: Props) {

    function convertToPending(currentStep: number, stepList: string[]) {
        return currentStep < stepList.length ? stepList[currentStep] : undefined;
    }

    function convertToItems(stepList: StepItem[]) {
        return stepList.map((step, index) => {
            return {
                title: step.title,
                description: step.node
            };
        }
        );
    }

    return (
        <Steps
            direction="vertical"
            current={currentStep}
            items={convertToItems(stepList)}
        />
    );
}
