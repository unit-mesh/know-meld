import { Card, Tag } from 'antd';

interface Props {
    prompts: Prompt[]
}

export default function PromptList({ prompts }: Props) {
    return (
        <div>
            {prompts.map((prompt, index) => (
                <Card
                    key={index}
                    title={prompt.name}
                >
                    {prompt.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                    <p>
                        <p>{prompt.content.replace(/\${(.*?)}/g, '________')}</p>
                    </p>
                </Card>
            )
            )}
        </div>
    );
}
