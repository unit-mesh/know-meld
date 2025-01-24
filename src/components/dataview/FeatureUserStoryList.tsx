import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox, Collapse, List, Radio, message } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { yamlToFeatureStories } from "@/utils/YamlToObject";
import { Feature, Story } from "@/app/genify.type";
import { WorkNodeProps } from "@/core/WorkNode";

const { Panel } = Collapse;

export default function FeatureUserStoryList({ contentInput, handleFinishAction }: WorkNodeProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [genFeatrueStoryDone, setGenFeatrueStoryDone] = useState<boolean>(true);
  const [FeatureStoryList, setFeatureStoryList] = useState<Feature[]>([]);

  useEffect(() => {
    const featureStories = yamlToFeatureStories(contentInput);
    if (featureStories) {
      setFeatureStoryList(featureStories);
      setGenFeatrueStoryDone(true);
    } else {
      message.error("Invalid YAML format");
      setGenFeatrueStoryDone(false);
    }
  }, [contentInput]);

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

  return (<div className="container w-full">
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
    <Button onClick={returnSelectedStories} disabled={!genFeatrueStoryDone || selectedStories.size == 0} type="primary">
      {"Generate AC"}
    </Button>
  </div>
  );


};