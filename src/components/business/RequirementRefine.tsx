"use client"

import { useState } from "react";
import { Button, Card, Input } from "antd";

const { TextArea } = Input;

interface RequirementRefineProps {
    handleFinishAction: (value: string) => void;
}

export default function RequirementRefine({ handleFinishAction }: RequirementRefineProps) {
    const [localReq, setLocalReq] = useState("");

    return (<div className="w-full mx-auto justify-between mt-4">
        <Card
            title={"Requirement Refine"}
            extra={
                <div className="space-x-4">
                </div>
            }
        >
            <TextArea
                value={localReq}
                rows={20}
                onChange={(e) => {
                    setLocalReq(e.target.value);
                }}
            />
            <div className="flex justify-between mt-4">
                <Button type="primary"
                    disabled={localReq.length === 0}
                    onClick={() => {
                        handleFinishAction(localReq);
                    }}>
                    {"Save and Continue"}
                </Button>
            </div>
        </Card>
    </div>
    );
}