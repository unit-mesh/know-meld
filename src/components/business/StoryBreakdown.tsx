"use client"

import { WorkNodeProps } from "@/core/WorkNode";
import WorkNode from "../workflow/WorkNode";
import ExecutionInputSetup from "../step/ExecutionInputSetup";
import { useState } from "react";
import LLMExecute from "../step/LLMExecute";
import { Steps } from "antd";

// steps:
// - (user) 'input' {requirement-content} by doc-or-text
// - (system) 'parse' {requirement-content} generate {feature-story-option}
// - (user) 'select' {feature-story} by {feature-story-option}
// - (system) 'parse'  {requirement-content} generate {story-desc}{story-rules}{story-terms}{out-of-scope}

export default function StoryBreakdown({ historicalContent, handleFinishAction }: WorkNodeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [requirementsContent, setRequirementsContent] = useState("");
    const [assembledPrompt, setAssembledPrompt] = useState("");

    const handleRequirementInputFinishAction = (value: string): void => {
        setRequirementsContent(value);
        setAssembledPrompt(assemblePrompt(value));
        setCurrentStep(1);
    }

    const assemblePrompt = (value: string): string => {
        let filledContent = "";
        fetch('/api/prompts/_GenerateFeatureUserStory')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                const content = data.content;
                filledContent = content.replace('${requirementContent}', value || "");
            })
            .catch((error) => console.error('Fetch error:', error));
        return filledContent;
    }


    function convertToStepItems(currentStage: number) {
        const stepItems = [
            {
                title: "Requirement Input",
                node: <ExecutionInputSetup historicalContent={requirementsContent} handleFinishAction={handleRequirementInputFinishAction} />

            },
            {
                title: "LLM Execute",
                node: <div>LLM Execute</div>
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
                progressDot
                current={currentStep}
                items={convertToStepItems(currentStep)}
            />
        </WorkNode>
    );
}