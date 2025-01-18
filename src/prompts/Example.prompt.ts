import { Task } from "@/core/Task";

export default function prompt(task: Task, context: string, keyPoints: string[], input: string) {
    return `
<Role>
${task.role}
${task.skills?.map(skill => `- ${skill}`).join('\n')}
</Role>

<Context>
${context}
</Context>

<Goal>
根据<Input>部分,${task.goal},严格以<Example>格式输出, 并检查是否符合<CheckPoint>的要求.
</Goal>

<Workflow>
${task.workflow?.map((item, index) => `${index + 1}. ${item}`).join('\n')}
</Workflow>

<Example>
${task.example}
</Example>

<CheckPoint>
${task.checkPoints?.map(item => `- ${item}`).join('\n')}
</CheckPoint>

<KeyPoint>
${keyPoints?.map(item => `- ${item}`).join('\n')}
</KeyPoint>

<Input>
${input}
</Input>
`;
};
