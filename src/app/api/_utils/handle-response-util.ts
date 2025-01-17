import { NextResponse } from "next/server";

/// todo: refactor to latest stream usage
export function convertToStreamCompletion(response: Response, handleContentParse: (value: any) => string): ReadableStream<string> {
  let controller: ReadableStreamController<any>;
  const stream = new ReadableStream({
    async start(con) {
      controller = con;
    },
  });

  let buffer = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  response.data.on("data", async (data: BufferSource | undefined) => {
    if (data) {
      const dataStr = data.toString();
      buffer += dataStr;

      // 按行分割数据
      const lines = buffer.split("\n");

      // 留存最后一个可能不完整的部分
      buffer = lines.pop() || "";

      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          controller.close();
        } else if (message === "event: ping") {
          controller.enqueue("" as any);
        } else {
          try {
            const parsed = handleContentParse(message); // 可能会抛出错误，如果数据不完整
            if (parsed) {
              controller.enqueue(parsed as any);
            }
          } catch (error) {
            // console.warn("Could not JSON parse stream message", message, error);
          }
        }
      }
    }
  });

  return stream;
}

export function handleStreamSuccessResponse(response: Response, handleContentParse: (value: any) => string): NextResponse {
  if (response.status !== 200 && response.status !== 201) {
    console.error("Response status is not 200", response);
    return new NextResponse(JSON.stringify({ error: response.statusText }), {
      status: response.status,
    });
  }

  let stream;
  try {
    stream = convertToStreamCompletion(response, handleContentParse);
  } catch (e) {
    console.log(e);
  }

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream;",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export function handleErrorResponse(e: any) {
  if (e.response) {
    console.log(e.response);
  }
  if (e.response?.config?.data) {
    console.log(e.response.config.data);
  }

  if (e.response?.status) {
    return new NextResponse(JSON.stringify({ error: e }), {
      status: 500,
    });
  } else {
    let msg = e.message;
    if (e.code === "ETIMEDOUT") {
      msg = "Request api was timeout, pls confirm your network worked";
    }

    return new NextResponse(JSON.stringify({ error: e.message, msg: msg }), {
      status: 500,
    });
  }
}
