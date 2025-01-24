"use client"

import { WorkNodeProps } from "@/core/WorkNode";
import WorkNode from "../workflow/WorkNode";
import ExecutionInputSetup from "../step/ExecutionInputSetup";
import { use, useEffect, useState } from "react";
import LLMExecute from "../step/LLMExecute";
import StepProcess from "../step/StepProcess";

// steps:
// - (user) 'input' {requirement-content} by doc-or-text
// - (system) 'parse' {requirement-content} generate {feature-story-option}
// - (user) 'select' {feature-story} by {feature-story-option}
// - (system) 'parse'  {requirement-content} generate {story-desc}{story-rules}{story-terms}{out-of-scope}

export default function StoryBreakdown({ historicalContent, handleFinishAction }: WorkNodeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [generateFeatureUserStoryPrompt, setGenerateFeatureUserStoryPrompt] = useState("");
    const [requirementsContent, setRequirementsContent] = useState("");

    useEffect(() => {
        fetch('/api/prompts/_GenerateFeatureUserStory')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                const content = data.content;
                setGenerateFeatureUserStoryPrompt(content);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                return "";
            });
    } , []);

    const handleRequirementInputFinishAction = async (value: string): Promise<void> => {
        setRequirementsContent(value);
        setCurrentStep(1);
    }

    const stepList = [
        {
            title: "Requirement Input",
            node: <ExecutionInputSetup historicalContent={requirementsContent} handleFinishAction={handleRequirementInputFinishAction} />

        },
        {
            title: "LLM Execute",
            node: <LLMExecute contentInput={{prompt: generateFeatureUserStoryPrompt, executionInput: requirementsContent}} handleFinishAction={handleFinishAction} />
        }
    ]

    return (
        <WorkNode>
            <StepProcess currentStep={currentStep} stepList={stepList} />
        </WorkNode>
    );
}