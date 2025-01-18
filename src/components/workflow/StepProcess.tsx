import { Steps, Timeline } from "antd";
import { useEffect, useState } from "react";

interface Props {
    currentStep: number;
    stepList: string[];
    finished: boolean;
}

export default function StepProcess({ currentStep, stepList, finished }: Props) {

    function convertToPending(currentStep: number, stepList: string[]) {
        return currentStep < stepList.length ? stepList[currentStep] : undefined;
    }

    function convertToItems(stepList: string[]) {
        return stepList.filter((step, index) => index < currentStep).map((step, index) => {
            return {
                children: step,
            };
        }
        );
    }

    return (
        <Timeline
            pending={convertToPending(currentStep, stepList)}
            items={convertToItems(stepList)}
        />
    );
}
