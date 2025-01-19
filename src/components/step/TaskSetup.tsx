
import { useEffect, useState } from "react";
import { Select } from "antd";
import { Task } from '@/core/Task';
import { tasks } from '@/prompts/Example.task';
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";

export default function TaskSetup({ handleFinishAction }: StepNodeProps) {
    const [task, setTask] = useState<Task>();
    const [taskOptions, setTaskOptions] = useState<any>([]);

    useEffect(() => {
        const taskOptions = tasks.map((task, index) => {
            return {
                value: index,
                label: task.goal,
            };
        }
        );
        setTaskOptions(taskOptions);

    }, []);

    const handleTaskChange = (value: string) => {
        const task = tasks[parseInt(value)];
        setTask(task);
    };

    return (
        <StepNode continueable={!!task} onContinue={() => task && handleFinishAction(task)}>
            <Select
                placeholder="Task"
                style={{ width: "100%" }}
                onChange={handleTaskChange}
                options={taskOptions}
            />
        </StepNode>
    );
}
