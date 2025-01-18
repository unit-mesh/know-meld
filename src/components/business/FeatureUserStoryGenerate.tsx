import React, { useState } from "react";
import { Button, Card, Checkbox, Collapse, List, Radio, message } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { StreamingMarkdownCodeBlock } from "@/utils/markdown/streaming/StreamingMarkdownCodeBlock";
import { yamlToFeatureStories } from "@/utils/YamlToObject";
import { Feature, Story } from "@/app/genify.type";
import { WorkNodeProps } from "@/core/WorkNode";
import GenerateFeatureUserStoryPrompt from "@/prompts/GenerateFeatureUserStory.prompt"

const { Panel } = Collapse;

export default function FeatureStoryGenerate({ contentInput, handleFinishAction }: WorkNodeProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [genFeatrueStoryDone, setGenFeatrueStoryDone] = useState<boolean>(true);
  const [FeatureStoryList, setFeatureStoryList] = useState<Feature[]>([]);

  const isFeatureSelected = (feature: Feature) => {
    return selectedFeature === feature.id;
  };

  const isStorySelected = (story: Story) => {
    return selectedStories.has(story.id);
  };

  const returnSelectedStories = () => {
    const selectedFeatureObj = FeatureStoryList.find(f => f.id === selectedFeature);
    if (selectedFeatureObj) {
      const selectedStoriesArray = selectedFeatureObj.stories.filter(story => selectedStories.has(story.id));
      handleFinishAction({ selectedFeature: selectedFeatureObj, selectedStories: selectedStoriesArray });
    }
  };

  const toggleFeatureSelection = (featureId: string) => {
    if (selectedFeature === featureId) {
      setSelectedFeature(null);
      setSelectedStories(new Set());
    } else {
      setSelectedFeature(featureId);
      const feature = FeatureStoryList.find(f => f.id === featureId);
      if (feature) {
        setSelectedStories(new Set(feature.stories.map(s => s.id)));
      }
    }
  };

  const toggleStorySelection = (story: Story, feature: Feature) => {
    if (selectedFeature !== feature.id) {
      toggleFeatureSelection(feature.id);
      setSelectedStories(new Set([story.id]));
      return;
    }

    const newSelectedStories = new Set(
      Array.from(selectedStories).filter(storyId => feature.stories.some(s => s.id === storyId)),
    );

    if (newSelectedStories.has(story.id)) {
      newSelectedStories.delete(story.id);
    } else {
      newSelectedStories.add(story.id);
    }

    setSelectedStories(newSelectedStories);
  };

  const splitStory = async () => {
    setGenFeatrueStoryDone(false);

    const content = GenerateFeatureUserStoryPrompt("product-info", "feature-term", "story-term", "user-story-spec", contentInput);

    const response: Response = await fetch("/api/llm/glm", {
      method: "POST",
      headers: { Accept: "text/event-stream" },
      body: JSON.stringify({
        content
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let isDone = false;

    let context = "";
    while (!isDone) {
      const { value, done } = await reader.read();
      if (done) {
        isDone = true;
      }

      if (value) {
        context += decoder.decode(value);

        const codeBlock = StreamingMarkdownCodeBlock.parse(context);
        try {
          const data: Feature[] = yamlToFeatureStories(codeBlock.text);
          try {
            if (data[data.length - 1].stories.length > 0) {
              setFeatureStoryList(data);
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

    setGenFeatrueStoryDone(true);
    message.success("documentParsedSuccessfully");
  };

  return (<div className="container w-full px-4 py-8">
    <div className="mb-6">
      <Button
        disabled={!genFeatrueStoryDone}
        onClick={splitStory}
        className="hover:bg-gray-100 transition-colors duration-200"
      >
        {"Generate"}
      </Button>
    </div>
    <Card
      title={"Feature & Story"}
      className="w-full mx-auto"
      extra={
        <Button onClick={returnSelectedStories} disabled={!genFeatrueStoryDone || selectedStories.size == 0} className="ml-4" type="primary">
          {"Generate Use Cases"}
        </Button>
      }
    >
      {FeatureStoryList && FeatureStoryList.length > 0 && (
        <List
          dataSource={FeatureStoryList}
          renderItem={(feature) => (
            <List.Item key={feature.id}>
              {feature.feature && feature.feature.length > 1 && (
                <Collapse className="w-full">
                  <Panel
                    header={
                      <Radio
                        checked={isFeatureSelected(feature)}
                        onChange={() => toggleFeatureSelection(feature.id)}
                      >
                        {feature.feature}
                      </Radio>
                    }
                    key={feature.id}
                  >
                    <List
                      dataSource={feature.stories}
                      renderItem={(story: Story) => (
                        <List.Item key={story.id} className="w-full">
                          <Checkbox
                            checked={isStorySelected(story)}
                            onChange={() => toggleStorySelection(story, feature)}
                            className="w-full"
                          >
                            <Button
                              type="text"
                              onClick={() => handleFinishAction({ selectedFeature: feature, selectedStories: [story] })}
                              className="w-full px-4 py-2 justify-between items-center"
                            >
                              <span className="text-left truncate mr-2 flex-1">{story.story}</span>
                              <RightOutlined className="h-4 w-4 flex-shrink-0" />
                            </Button>
                          </Checkbox>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              )}
            </List.Item>
          )}
        />
      )}
    </Card>
  </div>
  );


};