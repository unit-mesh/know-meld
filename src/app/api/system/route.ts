import { NextResponse } from "next/server";

export async function GET() {  
    // return systemInfoList by mock SystemInfo data
    const systemInfoList = [
        {
            id: 1,
            systemName: "systemName-1",
            systemIntroduction: "systemIntroduction-1",
            architecture: "architecture-1",
            domainKnowledge: "domainKnowledge-1",
            repoUrl: "repoUrl-1",
            onlineUrl: "onlineUrl-1",
            productFeatureTree: "productFeatureTree-1",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            systemName: "systemName-2",
            systemIntroduction: "systemIntroduction-2",
            architecture: "architecture-2",
            domainKnowledge: "domainKnowledge-2",
            repoUrl: "repoUrl-2",
            onlineUrl: "onlineUrl-2",
            productFeatureTree: "productFeatureTree-2",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    return NextResponse.json(systemInfoList);
  }