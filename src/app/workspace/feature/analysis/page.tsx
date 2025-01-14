"use client"

import { useState } from "react";
import RequirementRefine from "@/components/business/RequirementRefine";
import FeatureStoryGenerate from "@/components/business/FeatureStoryGenerate";
import { Feature, Story } from "@/app/genify.type";
import ClickableSteps from "@/components/steps/ClickableSteps";

type Step = "requirementRefine" | "featureStoryGenerate" | "navigate";

export default function Page() {
    const [currentStep, setCurrentStep] = useState<Step>("requirementRefine");
    const [requirements, setRequirements] = useState("");
    const [selectedFeatureStories, setSelectedFeatureStories] = useState<Feature>();

    const handleRequirementRefineFinish = (requirements: string) => {
        setCurrentStep("featureStoryGenerate");
        setRequirements(requirements);
    }

    const handleFeatureStoriesSelected = (value: { selectedFeature: Feature, selectedStories: Story[] }) => {
        setCurrentStep("navigate");
        setSelectedFeatureStories({ ...value.selectedFeature, stories: value.selectedStories });
    }

    const stepList = ["requirementRefine", "featureStoryGenerate", "navigate"];
    function handleStepOnchange(selectedStep: string): void {
        setCurrentStep(selectedStep as Step);
    }

    const renderContent = () => {

        switch (currentStep) {
            case "requirementRefine":
                return (
                    <RequirementRefine historicalContent={requirements} handleFinishAction={handleRequirementRefineFinish} />
                );
            case "featureStoryGenerate":
                return (
                    <FeatureStoryGenerate contentInput={requirements} handleFinishAction={handleFeatureStoriesSelected} />
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
            <ClickableSteps currentStep={currentStep} stepList={stepList} handleStepOnchangeAction={handleStepOnchange} />
            {renderContent()}
        </div>
    );
}