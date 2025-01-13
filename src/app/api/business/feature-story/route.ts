import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Mock data response in stream format
        const mockData = `
根据提供的需求文档对xxx产品的分析结果如下：

\`\`\`yaml
- feature: xxx的创建与管理
  stories:
    - story: 用户可以在首页快速创建一个新的xxx
    - story: 用户能够设置xxx的隐私权限
    - story: 用户可以邀请好友加入自己创建的xxx
    - story: 用户能够在xxx内修改xxx名称和描述

- feature: xx消息的发送与接收
  stories:
    - story: 用户可以在聊天界面快速发送xx消息
    - story: 用户能够接收并播放xx消息
    - story: 用户可以回复xx消息并进行互动
    - story: 用户能够删除自己发送的xx消息

- feature: xx活动的参与与管理
  stories:
    - story: 用户可以在活动页面浏览正在进行的xx活动
    - story: 用户能够报名参加自己感兴趣的xx活动
    - story: 用户可以在活动结束后查看活动回放
    - story: 用户能够在活动中与其他参与者进行xx交流

- feature: 用户个人信息的设置与管理
  stories:
    - story: 用户可以编辑自己的个人资料
    - story: 用户能够设置隐私选项来保护个人信息
    - story: 用户可以查看和管理自己的好友列表
    - story: 用户能够设置个人状态来展示自己当前的心情
\`\`\`

在这个分析中，我识别出了xxx的创建与管理、xx消息的发送与接收、xx活动的参与与管理以及用户个人信息的设置与管理等四个主要的feature，并为每一个feature编写了相应的用户故事。每个故事都遵循了用户-场景-行为-目的的格式，确保了完整性和逻辑。
`;

        const lines = mockData.split('\n');
        const stream = new ReadableStream({
            start(controller) {
                let index = 0;

                function push() {
                    if (index < lines.length) {
                        controller.enqueue(new TextEncoder().encode(lines[index] + '\n'));
                        index++;
                        setTimeout(push, 200); // Send a line every 200ms
                    } else {
                        controller.close();
                    }
                }

                push();
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Error processing request:', error);

        return NextResponse.json({
            error: 'An error occurred while processing your request.',
        }, {
            status: 500,
        });
    }
}
