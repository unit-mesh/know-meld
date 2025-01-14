import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Mock data response in stream format
    const mockData = `
\`\`\`markdown
# 用户创建、管理xxx的功能验收案例

## 1. 使用功能前
### 1.1 [Happy] 从首页进入创建xxx页面
#### 预置条件：用户身份为注册用户，已登录状态
#### 入口操作：
1) 点击首页的“创建xxx”按钮
#### 预期结果：展示“创建xxx”页面，包括相关的设置选项。

### 1.2 [Happy] 直接通过链接访问创建xxx页面
#### 预置条件：用户身份为注册用户，已登录状态
#### 入口操作：
1) 输入直接链接或点击存储的链接
#### 预期结果：展示“创建xxx”页面，包括相关的设置选项。

### 1.3 [Sad] 未登录用户无法访问创建xxx页面
#### 预置条件：用户身份未登录
#### 入口操作：
1) 点击首页的“创建xxx”按钮
#### 预期结果：提示“请先登录”信息，并引导用户到登录页面。

### 1.4 [Sad] 用户身份没有创建权限
#### 预置条件：用户身份为普通访客（无创建权限）
#### 入口操作：
1) 点击首页的“创建xxx”按钮
#### 预期结果：提示“您没有权限访问此功能”，并阻止进入创建页面。

## 2. 使用功能中
### 2.1 [Happy] 用户填写xxx的名称和描述
#### 预置条件：用户已进入创建xxx页面
#### 操作步骤：
1) 在“名称”字段输入“xxx名称”
2) 在“描述”字段输入“xxx描述”
3) 点击“保存”按钮
#### 预期结果：系统提示“创建成功”，并将用户带入xxx管理页面。

### 2.2 [Happy] 用户设置xxx隐私权限
#### 预置条件：用户已进入创建xxx页面
#### 操作步骤：
1) 选择隐私权限选项（公开/私密/好友可见）
2) 点击“保存”按钮
#### 预期结果：系统提示“隐私权限设置成功”。

### 2.3 [Happy] 用户邀请好友加入xxx
#### 预置条件：用户已进入xxx管理页面
#### 操作步骤：
1) 点击“邀请好友”按钮
2) 输入好友的邮箱或用户名
3) 点击“发送邀请”按钮
#### 预期结果：系统提示“邀请已发送”。

### 2.4 [Sad] 用户未填写xxx名称和描述
#### 预置条件：用户已进入创建xxx页面
#### 操作步骤：
1) 直接点击“保存”按钮
#### 预期结果：提示“名称和描述不能为空”。

### 2.5 [Sad] 用户选择非法字符作为xxx名称
#### 预置条件：用户已进入创建xxx页面
#### 操作步骤：
1) 在“名称”字段输入非法字符
2) 点击“保存”按钮
#### 预期结果：提示“名称包含非法字符”。

### 2.6 [Exception] 网络异常时的创建操作
#### 预置条件：用户已进入创建xxx页面
#### 操作步骤：
1) 填写名称和描述
2) 点击“保存”按钮（模拟网络异常）
#### 预期结果：提示“网络异常，请稍后重试”。

## 3. 使用功能后
### 3.1 [Happy] 用户成功创建xxx后数据持久化
#### 预置条件：用户已成功创建xxx
#### 触发动作：用户刷新页面
#### 预期结果：刷新后可见新创建的xxx在管理页面列表中。

### 3.2 [Sad] 用户创建xxx失败后未能持久化数据
#### 预置条件：用户因未填写名称和描述而创建失败
#### 触发动作：用户刷新页面
#### 预期结果：未见新创建的xxx，提示“请先完成创建”。

## 4. 业务校验点
### 4.1 [隐私设置] 用户成功设置不同隐私权限并邀请好友
#### 预置条件：用户已进入创建xxx页面并成功创建
#### 触发动作：用户修改隐私设置并尝试再次邀请好友
#### 预期结果：隐私设置应按所选保存，邀请仍能正常发送。

### 4.2 [名称验证] 不同用户身份对xxx名称创建的影响
#### 预置条件：注册用户与普通访客
#### 触发动作：两类用户分别尝试创建xxx
#### 预期结果：注册用户成功创建，而普通访客无权限创建。
\`\`\`
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
