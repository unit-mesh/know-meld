import React, { useState } from "react";
import { Button } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { useTranslation } from "react-i18next";

import { StreamingMarkdownCodeBlock } from "@/util/markdown/streaming/StreamingMarkdownCodeBlock";
// import { StrategyFormData } from "@/business/TestStrategyForm";
import { Story } from "@/app/genify.type";
import { markdown } from "@codemirror/lang-markdown";
import MarkdownMindMapRender from "@/components/mindmap/MarkdownMindMapRender";

export interface MindmapUMLProps {
  manualDocument: string,
  productInfo: string,
  selectedFeature: { feature: string } | null,
  selectedStories: Story[],
  gotoNextStep: (mindmap: string) => void,
  // acStrategyData?: StrategyFormData
  isForFeatureUsecase?: boolean
}

export default function AcMindmapUML({
                                       manualDocument,
                                       productInfo,
                                       selectedFeature,
                                       selectedStories,
                                       gotoNextStep,
                                      //  acStrategyData,
                                       isForFeatureUsecase = false,
                                     }: MindmapUMLProps) {
  const { t } = useTranslation();
  const [acMindmap, setAcMindmap] = useState<string>("");
  const [editorMindmap, setEditorMindmap] = useState<string>("");
  const [umlCompleted, setUmlCompleted] = useState<boolean>(false);

  const generateAIContent = async () => {
    setUmlCompleted(false);
    setAcMindmap("");

    let umlContent = "";

    // const bizStrategy = acStrategyData?.testStrategies ?? [];
    const outline = localStorage.getItem("attachment-editor") ?? manualDocument;

    const url = isForFeatureUsecase ? "/api/agents/requirement/mind-map-usecase" : "/api/agents/requirement/mind-map";
    const umlRes: Response = await fetch(url, {
      method: "POST",
      headers: { Accept: "text/event-stream" },
      body: JSON.stringify({
        requirement_doc_outlines: outline,
        product: productInfo,
        feature: selectedFeature?.feature,
        story: selectedStories?.map((story) => story.story).join("\n"),
        // biz_ac_checkpoints: bizStrategy.map((item) => item.strategyItem + ":" + item.checkPoint).join("\n"),
      }),
    });

    const umlReader = umlRes.body!.getReader();
    const umlDecoder = new TextDecoder();
    let isUmlDone = false;
    while (!isUmlDone) {
      const { value, done } = await umlReader.read();
      if (done) {
        isUmlDone = true;
      }

      if (value) {
        const text = umlDecoder.decode(value);
        umlContent = umlContent + text;

        const codeBlock = StreamingMarkdownCodeBlock.parse(umlContent);
        setAcMindmap(codeBlock.text);
        setEditorMindmap(codeBlock.text);
      }
    }

    setUmlCompleted(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <Button onClick={generateAIContent} className="mt-4">
          {t("generate")}
        </Button>
        {isForFeatureUsecase && <div className="flex space-x-4">
          <Button onClick={() => gotoNextStep(acMindmap)} className="mt-4" disabled={!umlCompleted}>
            {t("nextStep")}
          </Button>
        </div>
        }
      </div>
      {umlCompleted && acMindmap && <MarkdownMindMapRender
        content={acMindmap}
        onChange={(newContent) => {
          setAcMindmap(newContent);
          setEditorMindmap(newContent);
        }}
      />}
      <CodeMirror
        value={editorMindmap}
        editable={false}
        onChange={(value) => {
          setEditorMindmap(value);
        }}
        extensions={[markdown()]}
        placeholder="Input UML content here"
        className="mb-4"
      />
    </div>
  );
};
