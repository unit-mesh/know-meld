"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, message, Select } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import { StreamingMarkdownCodeBlock } from "@/utils/markdown/streaming/StreamingMarkdownCodeBlock";
import { yamlToFeatureStories } from "@/utils/YamlToObject";
import { RequirementEditor } from "@/business/RequirementEditor";
import FeatureStoryList from "@/business/FeatureStoryList";
import AcMindmapUML from "@/business/AcMindmapUML";
import { Feature, Story, SystemInfo } from "@/app/genify.type";

type Step = "upload" | "stories" | "navigate";

export default function FeatureStory() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [requirements, setRequirements] = useState<Feature[]>([]);
  const [genRequirementDone, setGenRequirementDone] = useState<boolean>(false);

  const [currentTestStep, setCurrentTestStep] = useState<number>(0);

  const [productInfo, setProductInfo] = useState<string>("");
  const [productId, setProductId] = useState<string>("");

  const [manualDocument, setManualDocument] = useState<string>("");

  const [systemInfoOptions, setSystemInfoOptions] = useState<any[]>([]);
  const [systemInfos, setSystemInfos] = useState<SystemInfo[]>([]);


  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch("/api/system");
        if (!response.ok) {
          message.error("networkError");
        }
        const data = await response.json();
  
        if (data.length === 0) {
          message.error("emptySystemInfo");
          return;
        }
  
        const first = data[0];
        setSystemInfos(data);
        setSystemInfoOptions(data.map((item: SystemInfo) => {
          return {
            label: item.systemName,
            value: item.systemIntroduction,
          };
        }));
  
        setProductId(first.id);
        setProductInfo(first.systemIntroduction ?? "");
      } catch (err) {
        console.error(err);
        message.error("fetchSystemInfoError");
      }
    };

    fetchSystemInfo();
  }, []);


  const handleForReturnRequirement = () => {
    setCurrentStep("stories");
    setCurrentTestStep(0);
  };

  const handleForReturnHome = () => {
    setCurrentStep("upload");
    setSelectedStories([]);
    setSelectedFeature(null);
    setFileList([]);
    setManualDocument("");
    setRequirements([]);
    setCurrentTestStep(0);
  };

  const handleStorySelect = (story: Story, feature: Feature) => {
    setSelectedStories([story]);
    setSelectedFeature(feature);
    setCurrentStep("navigate");
  };

  const handleStoriesSelect = (stories: Story[], features: Feature[]) => {
    setSelectedStories(stories);
    setSelectedFeature(features[0]);
    setCurrentStep("navigate");
  };

  const splitStory = async () => {
    let jsonContent = "";
    setGenRequirementDone(false);

    const outline = localStorage.getItem("attachment-editor");

    const response: Response = await fetch("/api/agents/requirement/feature-story", {
      method: "POST",
      headers: { Accept: "text/event-stream" },
      body: JSON.stringify({
        requirement_doc_outlines: outline,
        product: productInfo,
      }),
    });

    message.info("parsingDocument");

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let isDone = false;
    setCurrentStep("stories");

    while (!isDone) {
      const { value, done } = await reader.read();
      if (done) {
        isDone = true;
      }

      if (value) {
        const text = decoder.decode(value);
        jsonContent = jsonContent + text;

        const codeBlock = StreamingMarkdownCodeBlock.parse(jsonContent);
        try {
          const data: Feature[] = yamlToFeatureStories(codeBlock.text);
          try {
            if (data[data.length - 1].stories.length > 0) {
              setRequirements(data);
            }
          } catch (e) {
            // ignore
          }
        } catch (e: any) {
          console.error(e);
          message.error(`documentFormatError: ${e.message}`);
        }

      }
    }

    setGenRequirementDone(true);
    message.success("documentParsedSuccessfully");
  };

  const handleProductChange = useCallback((value: string) => {
    setProductInfo(value);
    const systemInfo = systemInfos.filter((item) => item.systemIntroduction === value);
    if (systemInfo.length > 0) {
      setProductId(systemInfo[0].id.toString());
    }
  }, [setProductId, systemInfos]);

  const renderContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <>
            <div className="flex flex-grow mb-4">
              <Select
                size="large"
                onChange={handleProductChange}
                style={{ width: 200 }}
                value={productInfo}
                options={systemInfoOptions}
              />
            </div>
            <RequirementEditor
              fileList={fileList}
              manualDocument={manualDocument}
              productInfo={productInfo}
              splitStory={splitStory}
            />
          </>
        );
      case "stories":
        return (
          <FeatureStoryList
            productId={productId}
            productInfo={productInfo}
            requirements={requirements}
            handleForReturnHome={handleForReturnHome}
            genRequirementDone={genRequirementDone}
            handleStorySelect={handleStorySelect}
            handleReturnSelectedStories={handleStoriesSelect}
            enableHistoryCases={false}
          />
        );
      case "navigate":
        return <div className="container w-full px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={() => handleForReturnRequirement()}
              className="hover:bg-gray-100 transition-colors duration-200">
              {"returnToRequirementList"}
            </Button>
          </div>

          <Card
            title={selectedFeature?.feature}
            className="w-full shadow-lg rounded-lg overflow-hidden"
            styles={{
              header: { backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
              body: { padding: "24px" },
            }}>
            <p className="text-gray-600 leading-relaxed">
              {selectedStories?.map(story => story.story).join(", ")}
            </p>

            <AcMindmapUML
              manualDocument={manualDocument}
              productInfo={productInfo}
              selectedFeature={selectedFeature}
              selectedStories={selectedStories}
              gotoNextStep={(mindmap: string) => {
                setCurrentTestStep(currentTestStep + 1);
              }}
            />
          </Card>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {renderContent()}
    </div>
  );
}
