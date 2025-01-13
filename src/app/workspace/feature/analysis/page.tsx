"use client"

import RequirementRefine from "@/components/business/RequirementRefine";
import { useState } from "react";
import { Steps } from 'antd';
import FeatureStoryGenerate from "@/components/business/FeatureStoryGenerate";
import { Feature, Story } from "@/app/genify.type";

type Step = "requirementRefine" | "featureStoryGenerate" | "navigate";

export default function Page() {
    const [currentStep, setCurrentStep] = useState<Step>("requirementRefine");
    const [requirements, setRequirements] = useState("");
    const [selectedFeatureStories, setSelectedFeatureStories] = useState<Feature>();

    const handleRequirementRefineFinish = (requirements: string) => {
        setCurrentStep("featureStoryGenerate");
        setRequirements(requirements);
    }

    const handleFeatureStoriesSelected = (feature: Feature, stories: Story[]) => {
        setCurrentStep("navigate");
        setSelectedFeatureStories({...feature, stories});
    }

    const steps = [{ "step": "requirementRefine", "title": "Requirement Refine" }, { "step": "featureStoryGenerate", "title": "Feature Story Generate" }, { "step": "navigate", "title": "Navigate" }];

    const renderContent = () => {

        switch (currentStep) {
            case "requirementRefine":
                return (
                    <div className="flex flex-grow mb-4">
                        <RequirementRefine handleFinishAction={handleRequirementRefineFinish} />
                    </div>
                );
            case "featureStoryGenerate":
                return (
                    <FeatureStoryGenerate requirements={requirements} handleFeatureStoriesSelectedAction={handleFeatureStoriesSelected} />
                );
            case "navigate":
                return (
                    <div>
                        <p>{selectedFeatureStories?.feature}</p>
                        {selectedFeatureStories?.stories.map((story, index) => <p key={index}>{story.story}</p>)}
                    </div>
                )
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Steps
                current={steps.findIndex(step => step.step === currentStep)}
                items={steps.map(step => { return { title: step.title } })}
            />
            {renderContent()}
        </div>
    );
}