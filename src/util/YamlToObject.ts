import { parse } from "yaml";
import { v4 } from "uuid";
import { Feature } from "@/app/genify.type";

export function yamlToFeatureStories(yaml: string): Feature[] {
  try {
    let data = parse(yaml);
    data = data.map((item: any) => ({
      ...item, id: v4(), stories: item.stories?.map((story: any) => ({ ...story, id: v4() })) || [],
    }));

    return data;
  } catch (e) {
    return [];
  }
}
