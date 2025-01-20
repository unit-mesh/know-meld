
import { useEffect, useState } from "react";
import { Select } from "antd";
import { Task } from '@/core/Task';
import StepNode from "@/components/step/StepNode";
import { StepNodeProps } from "@/core/StepNode";

export default function TaskSetup({ handleFinishAction }: StepNodeProps) {
    const [task, setTask] = useState<Task>();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetch('/api/prompt/tasks')
            .then((res) => res.json())
            .then((data: Task[]) => {
                console.log("tasks", data)
                setTasks(data);
            })
    }, []);

    const convertToTaskOptions = (tasks: Task[]) => {
        return tasks.map((task, index) => {
            return {
                value: index,
                label: task.goal,
            };
        }
        );
    }

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
                options={convertToTaskOptions(tasks)}
            />
        </StepNode>
    );
}
