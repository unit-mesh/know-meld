"use client"

import { useState } from "react";
import ClickableWorkStage from "@/components/workflow/ClickableWorkStage";
import StoryBreakdown from "@/components/business/StoryBreakdown";

//workflow:
// - [[📎 StoryBreakdown]] {feature-story} 
// - [[📎 ContextComplete]] {story-context} 
// - [[📎 ACGenerate]] {AC-list} 
// - [[📎 TestCaseGenerate]] {test-case-list}

type Stage = "StoryBreakdown" | "ContextComplete" | "ACGenerate" | "TestCaseGenerate";
const stageList = ["StoryBreakdown", "ContextComplete", "ACGenerate", "TestCaseGenerate"];

export default function Page() {
    const [currentStage, setCurrentStage] = useState<Stage>("StoryBreakdown");
    const [stories, setStories] = useState([]);

    const handleStageOnchange = (selectedStage: string): void => {
        setCurrentStage(selectedStage as Stage);
    }

    const handleStoryBreakdownFinish = (stories: any) => {
        setCurrentStage("ContextComplete");
        setStories(stories);
    }

    const renderContent = () => {

        switch (currentStage) {
            case "StoryBreakdown":
                return (
                    <StoryBreakdown historicalContent={stories} handleFinishAction={handleStoryBreakdownFinish} />
                );
            case "ContextComplete":
                return (
                    <div>ContextComplete</div>
                );
            case "ACGenerate":
                return (
                    <div>ACGenerate</div>
                );
            case "TestCaseGenerate":
                return (
                    <div>TestCaseGenerate</div>
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