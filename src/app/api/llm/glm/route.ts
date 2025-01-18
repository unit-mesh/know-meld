import axios from "axios";
import { handleErrorResponse, handleStreamSuccessResponse } from "@/app/api/_utils/handle-response-util";

export async function POST(request: Request) {
    try {
        const { content } = await request.json();
        const response: Response = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            "model": "glm-4-flash",
            "stream": true,
            "messages": [
                {
                    "role": "user",
                    "content": content
                }
            ]
        }, {
            responseType: "stream",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GML_API_KEY}`,
            },
        });

        const handleContentParse = (value: any) => {
            return JSON.parse(value).choices[0].delta.content;
        }

        return handleStreamSuccessResponse(response, handleContentParse);
    } catch (error) {
        return handleErrorResponse(error);
    }
}