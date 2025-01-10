import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, message, Modal, Tooltip, Upload, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { Editor } from "@tiptap/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { MarkdownParser } from "@/../node_modules/tiptap-markdown/src/parse/MarkdownParser";
import saveAs from "file-saver";

import { docxToMarkdown, markdownToDocx } from "@/utils/markdown/office/MarkdownDocx";
import GenifyEditor from "@/components/editor/GenifyEditor";

const { TextArea } = Input;

interface AttachmentProps {
  fileList: UploadFile[],
  manualDocument: string,
  splitStory: () => void,
  productInfo?: string,
  isUseSmartEditor?: boolean
}

export const RequirementEditor = ({
                             fileList,
                             manualDocument,
                             splitStory,
                             productInfo,
                             isUseSmartEditor,
                           }: AttachmentProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const [localReq, setLocalReq] = useState(manualDocument);

  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    localStorage.setItem("product-info", productInfo || "");
  }, [productInfo]);

  const callRefine = async (req: string, product: string, editor: Editor) => {
    const response = await fetch("/api/agents/requirement/refine", {
      method: "POST",
      body: JSON.stringify({
        requirement: req,
        product: product,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let allText = "";
    let buffer = "";
    console.info(response.body);

    /// insert to new line
    editor.setEditable(false);
    editor.chain().focus()?.insertContentAt(editor.state.selection, "\n").run();
    editor.setEditable(true);

    const originalSelection = editor.state.selection;
    await response.body?.pipeThrough(new TextDecoderStream()).pipeTo(
      new WritableStream({
        write: (chunk) => {
          allText += chunk;
          buffer = buffer.concat(chunk);

          if (buffer.includes("\n")) {
            try {
              const pos = {
                from: editor.state.selection.to,
                to: editor.state.selection.to,
              };
              editor.chain().focus()?.insertContentAt(pos, buffer).run();

              const newPos = {
                from: editor.state.selection.to,
                to: editor.state.selection.to,
              };
              editor.chain().focus()?.insertContentAt(newPos, "\n").run();
              buffer = "";
            } catch (e) {
              console.error(e);
            }
          }
        },
      }),
    );

    if (buffer.length > 0) {
      const pos = { from: editor.state.selection.to, to: editor.state.selection.to };
      editor.chain().focus()?.insertContentAt(pos, buffer).run();
    }

    const pos = { from: editor.state.selection.to, to: editor.state.selection.to };
    editor.chain().focus()?.insertContentAt(pos, buffer).run();

    const markdownNode = new MarkdownParser(editor, { html: true }).parse(allText);

    editor.chain().focus()?.deleteRange({
      from: originalSelection.from,
      to: editor.state.selection.to,
    }).run();

    editor.chain().insertContentAt(editor.state.selection, markdownNode).run();

    editor.setEditable(true);
  };

  const getActions = useCallback(() => {
    return [{
      name: "需求文档设计细化",
      action: async (editor: any) => {
        let doc: string = "";
        if (manualDocument.length === 0) {
          doc = localStorage.getItem("attachment-editor") || "";
        } else {
          doc = manualDocument;
        }

        if (doc.length === 0) {
          message.error("请先填写需求文档");
          return Promise.resolve();
        }

        let info: string = "";
        if (productInfo) {
          info = productInfo;
        } else {
          info = localStorage.getItem("product-info") || "";
        }

        if (info?.length === 0) {
          message.error("请先填写产品信息");
          return Promise.resolve();
        }

        await callRefine(doc, info, editor);
      },
    },
    ];
  }, [callRefine, localReq, productInfo]);

  const download = async (text: string) => {
    const buffer: any = await markdownToDocx(text);
    saveAs(buffer, "requirement.docx");
  };

  const handleFileUpload = async (file: RcFile | undefined) => {
    if (!file) {
      message.error("No file uploaded!");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const md = await docxToMarkdown(arrayBuffer, isUseSmartEditor);

      setLocalReq(md);
      //// upload to local storage
      localStorage.setItem("attachment-editor", md);
      message.success("Document converted successfully!");
    } catch (error) {
      console.error("Error converting document:", error);
      message.error("Failed to convert document. Please try again.");
    }
  };

  return (<div className="w-full mx-auto justify-between mt-4">
      <Card
        title={"编辑需求文档"}
        extra={
          <div className="space-x-4">
            <Tooltip title={"上传文档"}>
              <Button
                icon={<UploadOutlined />}
                onClick={showModal}
                type="primary"
                ghost
              />
            </Tooltip>
            <Tooltip title={"下载需求文档"}>
              <Button
                type="primary"
                onClick={() => download(localReq)}
                ghost
              >
                {"下载 (.docx)"}
              </Button>
            </Tooltip>
          </div>
        }
      >
        {isUseSmartEditor && <GenifyEditor
          showToolbar={true}
          value={localReq}
          onChange={(value) => {
            localStorage.setItem("attachment-editor", value);
            setLocalReq(value);
          }}
          customSlashActions={getActions()}
        />}

        {!isUseSmartEditor && <TextArea
          value={localReq}
          rows={20}
          onChange={(e) => {
            localStorage.setItem("attachment-editor", e.target.value);
            setLocalReq(e.target.value);
          }}
        />}
        <div className="flex justify-between mt-4">
          <Button type="primary"
                  disabled={localReq.length === 0 || hasClicked}
                  onClick={() => {
                    setHasClicked(true);
                    splitStory();
                  }}>
            {"保存并继续"}
          </Button>
        </div>

        <Modal
          title={"上传需求文档"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Upload.Dragger
            fileList={fileList}
            beforeUpload={(file: File) => {
              const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              if (!isDocx) {
                message.error("You can only upload DOCX files!");
              }
              return isDocx || Upload.LIST_IGNORE;
            }}
            onChange={(info) => {
              handleFileUpload(info.file?.originFileObj);
              handleCancel();
            }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined className="text-4xl" />
            </p>
            <p className="ant-upload-text">{"点击或拖拽文件到此区域上传"}</p>
            <p className="ant-upload-hint">
              {"支持单个或批量上传，严禁上传公司数据或其他敏感文件"}
            </p>
          </Upload.Dragger>
        </Modal>
      </Card>
    </div>
  );
};
