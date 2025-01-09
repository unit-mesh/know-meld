"use client";

import React, { useCallback, useEffect } from "react";
import {
  AdviceView,
  AiActionExecutor,
  ArticlePrompts,
  ChangeForm,
  FacetType,
  MenuBubble,
  OutputForm,
  PromptAction,
  PromptsManager,
  setupExtensions,
  ToolbarMenu,
} from "@studio-b3/web-core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import MarkdownIt from "markdown-it";
import { useDebounce } from "use-debounce";
import { Theme } from "@radix-ui/themes";
import { Markdown } from "tiptap-markdown";
import { DOMSerializer } from "prosemirror-model";
import { htmlToMarkdown } from "@/util/markdown/office/MarkdownDocx";

const md = new MarkdownIt({ html: true });

export interface EditorWrapperProps {
  value: string;
  onChange?: (e: any) => void;
  placeholder?: string;
  showToolbar?: boolean;
  customBubbleActions?: GenifyEditorAction[];
  customSlashActions?: GenifyEditorAction[];
}

export interface GenifyEditorAction {
  name: string;
  action?: (editor: Editor) => Promise<void>;
}

export default function GenifyEditor({
                                       value,
                                       onChange,
                                       showToolbar,
                                       customBubbleActions,
                                       customSlashActions,
                                     }: EditorWrapperProps) {
  const actionExecutor: AiActionExecutor = new AiActionExecutor();
  actionExecutor.setEndpointUrl("/api/chat");

  const instance = PromptsManager.getInstance();
  const actions: PromptAction[] = customSlashActions?.map((action) => {
    return {
      name: action.name,
      i18Name: false,
      template: `123125`,
      facetType: FacetType.SLASH_COMMAND,
      outputForm: OutputForm.STREAMING,
      action: async (editor: any): Promise<void> => {
        if (action.action) {
          await action.action(editor);
        }

        return;
      },
    };
  }) || [];

  instance.updateActionsMap("article", ArticlePrompts.concat(actions));

  const editor: any = useEditor({
    extensions: setupExtensions(instance, actionExecutor).concat([
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ]),
    content: md.render(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose lg:prose-xl bb-editor-inner",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const schema = editor.state.schema;
        try {
          const serializer = DOMSerializer.fromSchema(schema);
          const serialized: HTMLElement | DocumentFragment = serializer.serializeFragment(editor.state.doc.content);

          const html: string = Array.from(serialized.childNodes)
            .map((node: ChildNode) => (node as HTMLElement).outerHTML)
            .join("");

          const markdown = htmlToMarkdown(html);
          onChange(markdown);
        } catch (e) {
          console.error(e);
        }
      }
    },
  });

  const [debouncedEditor] = useDebounce(editor?.state.doc.content, 5000);
  useEffect(() => {
    if (debouncedEditor) {
      try {
        localStorage.setItem("editor", JSON.stringify(editor?.getJSON()));
        console.info("Saved to localStorage");
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [debouncedEditor, editor]);

  const [isInitialized, setIsInitialized] = React.useState(false);
  useEffect(() => {
    if (value !== "") {
      editor?.commands?.setContent(md.render(value));
      return;
    }

    if (isInitialized) {
      return;
    }

    setIsInitialized(true);

    console.log("start to load from localStorage");

    const content = localStorage.getItem("editor");
    if (content) {
      try {
        const parsed = JSON.parse(content);
        parsed?.content?.forEach((item: any) => {
          if (item.content) {
            item.content.forEach((subItem: any) => {
              if (subItem.marks) {
                subItem.marks = subItem.marks.filter((mark: any) => mark.type !== "advice");
              }
            });
          }
        });

        editor?.commands?.setContent(parsed);
        if (parsed.content.length === 1) {
          if (!parsed.content[0].content) {
            editor?.commands?.setContent(md.render(value));
          }
        }
      } catch (e) {
        editor?.commands?.setContent(md.render(value));
        console.error(e);
      }
    }

    if (!!editor) {
      actionExecutor.setEditor(editor);
    }
  }, [editor, value]);

  const getCustomActions = useCallback(() => (customBubbleActions || []).map((action) => {
    return {
      name: action.name,
      template: "",
      facetType: FacetType.BUBBLE_MENU,
      changeForm: ChangeForm.DIFF,
      outputForm: OutputForm.TEXT,
      action: async () => {
        if (action.action) {
          await action.action(editor!);
        }
      },
    };
  }), [customBubbleActions, editor]);

  return (
    <div>
      <Theme className={"w-full flex"}>
        <div className={"w-full"}>
          <div className={"editor-main p-4 bg-white"}>
            {editor && showToolbar && <ToolbarMenu className={"toolbar-menu"} editor={editor} />}

            <EditorContent editor={editor} className="mt-4" />
            <div>{editor && <MenuBubble editor={editor} customActions={getCustomActions()} />}</div>
          </div>
        </div>

        {editor && <AdviceView editor={editor} />}
      </Theme>
    </div>
  );
}
