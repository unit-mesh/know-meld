import axios from "axios";
import { handleErrorResponse, handleSuccessResponse } from "@/app/api/_utils/stream-api-util";
import { BASE_URL } from "@/app/api/_utils/api-constants";

export const maxDuration = 60;
const DIFY_MIND_MAP_UML = process.env.DIFY_MIND_MAP_UML;

export async function POST(request: Request, response: Response) {
  const requestData = await request.json();

  try {
    const response: Response = await axios.post(`${BASE_URL}/completion-messages`, {
      "inputs": {
        "requirement_doc_outlines": requestData.requirement_doc_outlines,
        "product": requestData.product,
        "story": requestData.story,
        "feature": requestData.feature,
        "biz_ac_checkpoints": requestData.biz_ac_checkpoints,
      },
      response_mode: "streaming",
      user: "me",
    }, {
      responseType: "stream",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_MIND_MAP_UML}`,
      },
    });

    return handleSuccessResponse(response);
  } catch (e: any) {
    return handleErrorResponse(e);
  }
}

