import GenerateFeatureUserStoryPrompt from "@/prompts/GenerateFeatureUserStory.prompt"
import { chatCompletions } from "../../_llm/glm";

export async function POST(request: Request) {
    const { requirement_doc_outlines } = await request.json();
    const content = GenerateFeatureUserStoryPrompt("product-info", "feature-term", "story-term", "user-story-spec", requirement_doc_outlines);
    return chatCompletions(content);
}