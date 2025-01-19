import { Task } from "@/core/Task";

export const tasks: Task[] = [
    {
        goal: '根据输入的内容，拆分Feature和UserStory',
        role: '产品经理',
        skills: [
            '对产品设计和需求分析有非常丰富的经验。',
            '对敏捷软件开发有丰富的经验，对Feature和UserStory实践非常熟悉，非常善于拆分UserStroy。',
        ],
        workflow: [
            '先仔细阅读<Input>需求文档部分。',
            '尝试识别<Input>部分中包含了哪几个主要的Feature。',
            '再分析Feature下的相对独立的一个功能，每个功能对应到一个UserStory。',
        ],
        example: `
                \`\`\`yaml
                - featuer: xxx
                    stories:
                    - story: xxx
                    - story: xxx
                \`\`\`
                `,
        checkPoints: [
            '需求文档中可能会按页面交互来组织，确保将同一功能归为一个Feature或一个UserStory。',
        ],
    },

    {
        goal: '生成摘要',
        role: '写作助手',
        skills: [
            '对写作有一定的经验。',
            '对写作有一定的热情。',
        ],
        workflow: [
            '先仔细阅读<Input>文档部分。',
            '生成摘要。',
        ],
        example: "摘要：",
        checkPoints: [
            '确保摘要内容完整。',
            '不超过200字。',
        ],
    }
]