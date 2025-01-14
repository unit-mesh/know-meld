import { WorkNodeProps } from "@/core/WorkNode";
import { StreamingMarkdownCodeBlock } from "@/utils/markdown/streaming/StreamingMarkdownCodeBlock";
import { Button, Card } from "antd";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import MarkdownMindMapRender from "../mindmap/MarkdownMindMapRender";

export default function UseCaseGenerate({ contentInput, handleFinishAction }: WorkNodeProps) {
    const { requirements, selectedFeatureStories } = contentInput;

    const [acMindmap, setAcMindmap] = useState<string>("");
    const [editorMindmap, setEditorMindmap] = useState<string>("");
    const [umlCompleted, setUmlCompleted] = useState<boolean>(false);

    const generateAIContent = async () => {
        setUmlCompleted(false);
        setAcMindmap("");

        let umlContent = "";

        const outline = requirements;

        const url = "/api/business/mind-map";
        const umlRes: Response = await fetch(url, {
            method: "POST",
            headers: { Accept: "text/event-stream" },
            body: JSON.stringify({
                requirement_doc_outlines: outline,
                product: "productInfo",
                feature: selectedFeatureStories?.feature,
                story: selectedFeatureStories?.stories?.map((story: { story: string; }) => story.story).join("\n"),
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
                console.log('umlContent', umlContent);

                const codeBlock = StreamingMarkdownCodeBlock.parse(umlContent);
                setAcMindmap(codeBlock.text);
                setEditorMindmap(codeBlock.text);
            }
        }

        setUmlCompleted(true);
    };

    return (
        <div className="container w-full px-4 py-8">
            <Card
                title={selectedFeatureStories?.feature}
                className="w-full shadow-lg rounded-lg overflow-hidden"
                styles={{
                    header: { backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
                    body: { padding: "24px" },
                }}>
                <p className="text-gray-600 leading-relaxed">
                    {selectedFeatureStories?.stories?.map((story: { story: string }) => story.story).join(", ")}
                </p>
                <div className="w-full">
                    <div className="flex justify-between mb-4">
                        <Button onClick={generateAIContent} className="mt-4">
                            {"Generate"}
                        </Button>
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
            </Card>
        </div>
    );

}