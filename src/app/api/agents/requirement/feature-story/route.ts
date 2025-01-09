import axios from "axios";
import { handleErrorResponse, handleSuccessResponse } from "@/app/api/_utils/stream-api-util";
import { BASE_URL } from "@/app/api/_utils/api-constants";

export const maxDuration = 60;
const DIFY_FEATURE_STORY_SPLIT = process.env.DIFY_FEATURE_STORY_SPLIT;

export async function POST(request: Request) {
  const requestData = await request.json();

  try {
    const response: Response = await axios.post(`${BASE_URL}/completion-messages`, {
      "inputs": {
        "requirement_doc_outlines": requestData.requirement_doc_outlines,
        "product": requestData.product
      },
      "response_mode": "streaming",
      "user": "me"
    }, {
      responseType: "stream",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_FEATURE_STORY_SPLIT}`,
      },
    });

    return handleSuccessResponse(response);
  } catch (e: any) {
    return handleErrorResponse(e);
  }
}
