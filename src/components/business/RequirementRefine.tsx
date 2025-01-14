"use client"

import { useState } from "react";
import { Button, Card, Input } from "antd";

const { TextArea } = Input;

interface Props {
    historicalContent?: string;
    handleFinishAction: (value: string) => void;
}

export default function RequirementRefine({ historicalContent, handleFinishAction }: Props) {
    const [requirementsContent, setRequirementsContent] = useState(historicalContent || "");

    return (<div className="w-full mx-auto justify-between mt-4">
        <Card
            title={"Requirement Refine"}
            extra={
                <div className="space-x-4">
                </div>
            }
        >
            <TextArea
                value={requirementsContent}
                rows={20}
                onChange={(e) => {
                    setRequirementsContent(e.target.value);
                }}
            />
            <div className="flex justify-between mt-4">
                <Button type="primary"
                    disabled={requirementsContent.length === 0}
                    onClick={() => {
                        handleFinishAction(requirementsContent);
                    }}>
                    {"Save and Continue"}
                </Button>
            </div>
        </Card>
    </div>
    );
}