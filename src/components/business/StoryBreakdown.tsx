"use client"

import { WorkNodeProps } from "@/core/WorkNode";
import WorkNode from "../workflow/WorkNode";
import ExecutionInputSetup from "../step/ExecutionInputSetup";
import { useEffect, useState } from "react";
import LLMExecute from "../step/LLMExecute";
import StepProcess from "../step/StepProcess";
import FeatureUserStoryList from "../dataview/FeatureUserStoryList";
import { StreamingMarkdownCodeBlock } from "@/utils/markdown/streaming/StreamingMarkdownCodeBlock";
import StepNode from "../step/StepNode";
import { Feature } from "@/app/genify.type";
import { yamlToFeatureStories } from "@/utils/YamlToObject";

// steps:
// - (user) 'input' {requirement-content} by doc-or-text
// - (system) 'parse' {requirement-content} generate {feature-story-option}
// - (user) 'select' {feature-story} by {feature-story-option}
// - (system) 'parse'  {requirement-content} generate {story-desc}{story-rules}{story-terms}{out-of-scope}

export default function StoryBreakdown({ historicalContent, handleFinishAction }: WorkNodeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [generateFeatureUserStoryPrompt, setGenerateFeatureUserStoryPrompt] = useState("");
    const [requirementsContent, setRequirementsContent] = useState("");
    const [executeResult, setExecuteResult] = useState("");
    const [FeatureStoryList, setFeatureStoryList] = useState<Feature[]>([]);

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
    }, []);

    const handleRequirementInputFinishAction = async (value: string): Promise<void> => {
        setRequirementsContent(value);
        setCurrentStep(1);
    }

    const handleLLMExecuteFinishAction = async (value: string): Promise<void> => {
        setExecuteResult(value);
        const codeblock = StreamingMarkdownCodeBlock.parse(executeResult).text;
        const featureStories = yamlToFeatureStories(codeblock);
        setFeatureStoryList(featureStories);
        setCurrentStep(2);
    }

    const stepList = [
        {
            title: "Requirement Input",
            node: <ExecutionInputSetup historicalContent={requirementsContent} handleFinishAction={handleRequirementInputFinishAction} />

        },
        {
            title: "LLM Execute",
            node: <LLMExecute contentInput={{ prompt: generateFeatureUserStoryPrompt, executionInput: requirementsContent }} handleFinishAction={handleLLMExecuteFinishAction} />
        },
        {
            title: "Feature User Story",
            node:
                <StepNode archiveData={JSON.stringify(FeatureStoryList)}>
                    <FeatureUserStoryList contentInput={FeatureStoryList} handleFinishAction={() => { }} />
                </StepNode>

        }
    ]

    return (
        <WorkNode>
            <StepProcess currentStep={currentStep} stepList={stepList} />
        </WorkNode>
    );
}