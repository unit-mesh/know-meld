
import { useEffect, useState } from "react";
import { Select, Space, Button } from "antd";
import { Task } from '@/core/Task';
import { tasks } from '@/prompts/Example.task';

interface Props {
    handleFinishAction: (value: Task) => void;
}

export default function TaskSetup({ handleFinishAction }: Props) {
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
        <Space direction="vertical" >
            <Select
                placeholder="Task"
                style={{ minWidth: 200 }}
                onChange={handleTaskChange}
                options={taskOptions}
            />
            <Button type="primary"
                disabled={!task}
                onClick={() => {
                    if (task) {
                        handleFinishAction(task);
                    }
                }}>
                {"Save and Continue"}
            </Button>
        </Space>
    );
}
