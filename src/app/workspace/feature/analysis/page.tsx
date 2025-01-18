"use client"

import { useState } from "react";
import RequirementRefine from "@/components/business/RequirementRefine";
import FeatureUserStoryGenerate from "@/components/business/FeatureUserStoryGenerate";
import { Feature, Story } from "@/app/genify.type";
import ClickableWorkStage from "@/components/workflow/ClickableWorkStage";
import UseCaseGenerate from "@/components/business/UseCaseGenerate";

type Stage = "requirementRefine" | "featureUserStoryGenerate" | "useCaseGenerate";
const stageList = ["requirementRefine", "featureUserStoryGenerate", "useCaseGenerate"];

export default function Page() {
    const [currentStage, setCurrentStage] = useState<Stage>("requirementRefine");
    const [requirements, setRequirements] = useState("");
    const [selectedFeatureStories, setSelectedFeatureStories] = useState<Feature>();

    const handleRequirementRefineFinish = (requirements: string) => {
        setCurrentStage("featureUserStoryGenerate");
        setRequirements(requirements);
    }

    const handleFeatureStoriesSelected = (value: { selectedFeature: Feature, selectedStories: Story[] }) => {
        setCurrentStage("useCaseGenerate");
        setSelectedFeatureStories({ ...value.selectedFeature, stories: value.selectedStories });
    }

    function handleStageOnchange(selectedStage: string): void {
        setCurrentStage(selectedStage as Stage);
    }

    const handleUseCaseGenerated = () => {
        console.log("use case generated");
    }

    const renderContent = () => {

        switch (currentStage) {
            case "requirementRefine":
                return (
                    <RequirementRefine historicalContent={requirements} handleFinishAction={handleRequirementRefineFinish} />
                );
            case "featureUserStoryGenerate":
                return (
                    <FeatureUserStoryGenerate contentInput={requirements} handleFinishAction={handleFeatureStoriesSelected} />
                );
            case "useCaseGenerate":
                return (
                    <UseCaseGenerate contentInput={{ requirements, selectedFeatureStories }} handleFinishAction={handleUseCaseGenerated} />
                )
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ClickableWorkStage currentStage={currentStage} stageList={stageList} handleStageOnchangeAction={handleStageOnchange} />
            {renderContent()}
        </div>
    );
}