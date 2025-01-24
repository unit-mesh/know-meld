"use client"

import { WorkNodeProps } from "@/core/WorkNode";
import WorkNode from "../workflow/WorkNode";
import ExecutionInputSetup from "../step/ExecutionInputSetup";
import { useState } from "react";
import LLMExecute from "../step/LLMExecute";
import { Steps } from "antd";
import StepProcess from "../step/StepProcess";

// steps:
// - (user) 'input' {requirement-content} by doc-or-text
// - (system) 'parse' {requirement-content} generate {feature-story-option}
// - (user) 'select' {feature-story} by {feature-story-option}
// - (system) 'parse'  {requirement-content} generate {story-desc}{story-rules}{story-terms}{out-of-scope}

export default function StoryBreakdown({ historicalContent, handleFinishAction }: WorkNodeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [requirementsContent, setRequirementsContent] = useState("");
    const [assembledPrompt, setAssembledPrompt] = useState("");

    const assemblePrompt = (value: string): Promise<string> => {
        return fetch('/api/prompts/_GenerateFeatureUserStory')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                const content = data.content;
                return content.replace('${requirementContent}', value || "");
            })
            .catch(error => {
                console.error('Fetch error:', error);
                return "";
            });
    }

    const handleRequirementInputFinishAction = async (value: string): Promise<void> => {
        setRequirementsContent(value);
        const prompt = await assemblePrompt(value);
        setAssembledPrompt(prompt);
        setCurrentStep(1);
    }

    const stepList = [
        {
            title: "Requirement Input",
            node: <ExecutionInputSetup historicalContent={requirementsContent} handleFinishAction={handleRequirementInputFinishAction} />

        },
        {
            title: "LLM Execute",
            node: <LLMExecute contentInput={{ prompt: assembledPrompt }} handleFinishAction={handleFinishAction} />
        }
    ]

    return (
        <WorkNode>
            <StepProcess currentStep={currentStep} stepList={stepList} />
        </WorkNode>
    );
}