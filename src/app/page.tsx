'use client';

import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="container mx-auto p-4 align-center mt-4">
      <Title level={1} className="text-3xl font-bold text-center">What would you like to do today?</Title>
      <Paragraph className="text-center">
        KnowMeld is an AI-powered knowledge management platform that helps you organize and access your knowledge.
      </Paragraph>
    </div>
  );
}
