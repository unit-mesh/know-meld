import axios from "axios";
import { handleErrorResponse, handleSuccessResponse } from "@/app/api/_utils/stream-api-util";
import { BASE_URL } from "@/app/api/_utils/api-constants";

export const maxDuration = 60;
const DIF_REQUIREMENT_REFINE = process.env.DIF_REQUIREMENT_REFINE;

export async function POST(request: Request, response: Response) {
  const requestData = await request.json();

  try {
    const response: Response = await axios.post(`${BASE_URL}/completion-messages`, {
      "inputs": {
        "requirement": requestData.requirement,
        "product": requestData.product,
      },
      response_mode: "streaming",
      user: "me",
    }, {
      responseType: "stream",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIF_REQUIREMENT_REFINE}`,
      },
    });

    return handleSuccessResponse(response);
  } catch (e: any) {
    return handleErrorResponse(e);
  }
}
