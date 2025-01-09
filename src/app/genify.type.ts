
export interface Feature {
  id: string; // use uuidv4 to generate in parsing stage
  feature: string;
  stories: Story[];
}

export interface Story {
  id: string; // use uuidv4 to generate in parsing stage
  story: string;
}

export interface SystemInfo {
  id: number;
  systemName: string;
  systemIntroduction: string;
  architecture: string;
  domainKnowledge: string;
  repoUrl?: string;
  onlineUrl?: string;
  productFeatureTree: string;
  createdAt: Date;
  updatedAt: Date;
}

