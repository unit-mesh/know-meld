import { Steps } from "antd";
import { useEffect, useState } from "react";

interface StepItem {
    step: string;
    title: string;
    disabled: boolean;
    status: "finish" | "process" | "wait";
}

interface Props {
    currentStage: string;
    stageList: string[];
    handleStageOnchangeAction: (selectedStage: string) => void;
}

export default function ClickableWorkStage({ currentStage, stageList, handleStageOnchangeAction }: Props) {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [stepItems, setStepItems] = useState<StepItem[]>([]);

    useEffect(() => {
        const currentStageIndex = stageList.indexOf(currentStage);
        setCurrentStageIndex(currentStageIndex);
        const items = convertToStemItems(currentStageIndex, stageList);
        setStepItems(items);
    }, [currentStage, stageList]);

    const convertToStemItems = (currentStageIndex: number, stageList: string[]) => {
        return stageList.map((step, index) => {
            return {
                step,
                title: step,
                status: currentStageIndex === index ? "process" : currentStageIndex > index ? "finish" : "wait" as "finish" | "process" | "wait",
                disabled: currentStageIndex < index,
            };
        });
    }

    const stageOnchange = (current: number) => {
        handleStageOnchangeAction(stepItems[current].step);
    };

    return (
        <Steps
            current={currentStageIndex}
            onChange={stageOnchange}
            items={stepItems}
        />
    );
}
