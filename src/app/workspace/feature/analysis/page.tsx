"use client"

import RequirementRefine from "@/components/business/RequirementRefine";
import { useState } from "react";

type Step = "requirementRefine" | "stories" | "navigate";
export default function Page() {
    const [currentStep, setCurrentStep] = useState<Step>("requirementRefine");
    const [requirements, setRequirements] = useState("");

    const handleRequirementRefineFinish = (requirements: string) => {
        setCurrentStep("stories");
        setRequirements(requirements);
    }

    const renderContent = () => {
        switch (currentStep) {
            case "requirementRefine":
                return (
                    <div className="flex flex-grow mb-4">
                        <RequirementRefine handleFinishAction={handleRequirementRefineFinish}/>
                    </div>
                );
            case "stories":
                return (
                    <div>
                        {requirements}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            {renderContent()}
        </div>
    );
}