import React, { useState } from "react";
import { Button, Card, Checkbox, Collapse, List, Radio } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

interface Story {
  id: string;
  story: string;
}

interface Feature {
  id: string;
  feature: string;
  stories: Story[];
}

interface StoriesProps {
  requirements: Feature[];
  productId: string;
  productInfo: string;
  genRequirementDone: boolean;
  handleForReturnHome: () => void;
  handleStorySelect: (story: Story, feature: Feature) => void;
  handleReturnSelectedStories: (stories: Story[], features: Feature[]) => void;
  enableHistoryCases?: boolean;
}

export default function FeatureStoryList(
  {
    productId,
    productInfo,
    requirements,
    genRequirementDone,
    handleForReturnHome,
    handleStorySelect,
    handleReturnSelectedStories,
    enableHistoryCases,
  }: StoriesProps) {
  const { t } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());

  const toggleFeatureSelection = (featureId: string) => {
    if (selectedFeature === featureId) {
      setSelectedFeature(null);
      setSelectedStories(new Set());
    } else {
      setSelectedFeature(featureId);
      const feature = requirements.find(f => f.id === featureId);
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

  const isFeatureSelected = (feature: Feature) => {
    return selectedFeature === feature.id;
  };

  const isStorySelected = (story: Story) => {
    return selectedStories.has(story.id);
  };

  const returnSelectedStories = () => {
    const selectedFeatureObj = requirements.find(f => f.id === selectedFeature);
    if (selectedFeatureObj) {
      const selectedStoriesArray = selectedFeatureObj.stories.filter(story => selectedStories.has(story.id));
      handleReturnSelectedStories(selectedStoriesArray, [selectedFeatureObj]);
    }
  };

  const [isRegenMode, setIsRegenMode] = useState(false);

  return (<>
      {!isRegenMode && <div className="container w-full px-4 py-8">
        <div className="mb-6">
          <Button
            icon={<PlusOutlined />}
            disabled={!selectedFeature}
            onClick={handleForReturnHome}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            {t("添加新需求")}
          </Button>
        </div>

        <Card
          title={t("需求列表")}
          className="w-full mx-auto"
          extra={
            <>
              {enableHistoryCases && <Button
                disabled={!genRequirementDone}
                onClick={() => {
                  setIsRegenMode(true);
                }}
              >
                {t("生成用例（参考历史）")}
              </Button>
            }
              <Button onClick={returnSelectedStories} disabled={!genRequirementDone} className="ml-4" type="primary">
                {t("新用例生成")}
              </Button>
            </>
          }
        >
          {requirements && requirements.length > 0 && (
            <List
              dataSource={requirements}
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
                                  onClick={() => handleStorySelect(story, feature)}
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
      }
    </>
  );
}
;
