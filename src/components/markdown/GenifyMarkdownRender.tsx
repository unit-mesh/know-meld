// MIT License
//
// Copyright (c) 2020 Mustafa Turhan
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import MermaidWrapper from "@/components/mermaid/MermaidWrapper";
import PlantUMLRenderer from "@/components/plantuml/PlantUMLRenderer";
import { Button, message } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";

const defaults = {
  p: (props: any) => {
    const { children } = props;
    return <p className="mb-2">{children}</p>;
  },
  em: (props: any) => {
    const { children } = props;
    return <em>{children}</em>;
  },
  blockquote: (props: any) => {
    const { children } = props;
    return (
      <blockquote className="p-2 bg-gray-100 rounded text-gray-600">
        {children}
      </blockquote>
    );
  },
  del: (props: any) => {
    const { children } = props;
    return <del>{children}</del>;
  },
  hr: () => <hr className="my-4 border-t border-gray-300" />,
  a: (props: any) => <a className="text-blue-600 underline" {...props} />,
  img: (props: any) => <img className="max-w-full h-auto" {...props} />,
  text: (props: any) => {
    const { children } = props;
    return <span>{children}</span>;
  },
  ul: (props: any) => {
    const { ordered, children, depth } = props;
    let listStyle = "list-disc";
    if (ordered) listStyle = "list-decimal";
    if (depth === 1) listStyle = "list-circle";
    return (
      <ul className={`pl-4 ${listStyle} space-y-2`} {...props}>
        {children}
      </ul>
    );
  },
  ol: (props: any) => {
    const { ordered, children, depth } = props;
    let listStyle = "list-decimal";
    if (depth === 1) listStyle = "list-circle";
    return (
      <ol className={`pl-4 ${listStyle} space-y-2`} {...props}>
        {children}
      </ol>
    );
  },
  li: (props: any) => {
    const { children, checked } = props;
    return (
      <li className={`list-none ${checked !== null ? "pl-6" : ""}`}>
        {checked !== null ? (
          <input type="checkbox" checked={checked} readOnly className="mr-2" />
        ) : null}
        {children}
      </li>
    );
  },
  heading: (props: any) => {
    const { children } = props;
    const level = parseInt(props.node.tagName.replace("h", ""), 10);
    const HeadingTag = `h${level}`;

    const sizeClasses = {
      1: "text-4xl font-extrabold",
      2: "text-3xl font-bold",
      3: "text-2xl font-semibold",
      4: "text-xl font-semibold",
      5: "text-lg font-medium",
      6: "text-base font-medium",
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return <HeadingTag className={`${sizeClasses[level] || "text-base"} my-2`}>
      {children}
    </HeadingTag>;
  },
  pre: (props: any) => {
    const { children } = props;
    return <pre className="p-4 bg-gray-200 rounded">{children}</pre>;
  },
  table: (props: any) => <table className="min-w-full border" {...props} />,
  thead: (props: any) => <thead className="bg-gray-100" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b" {...props} />,
  td: (props: any) => {
    const { children } = props;
    const renderedChildren = React.Children.map(children, child => {
      if (typeof child === "string") {
        return child.split("<br>").map((text, index) => (
          <React.Fragment key={index}>
            {text}
            {index < child.split("<br>").length - 1 && <br />}
          </React.Fragment>
        ));
      }
      return child;
    });

    return <td className="p-2 border">{renderedChildren}</td>;
  },
  th: (props: any) => <th className="p-2 border font-semibold text-left" {...props} />,
};

export default function GenifyMarkdownRender({ content, isShowCopyButton: isShowCopyButton = true }: {
  content: any,
  isShowCopyButton?: boolean
}) {
  function getHighlighter(match: RegExpExecArray, props: any, children: any) {
    const language = match[1];

    if (language == "mermaid") {
      return <MermaidWrapper graphDefinition={children} />;
    }

    if (language == "plantuml" || language == "puml" || language == "uml") {
      return <PlantUMLRenderer value={children} />;
    }

    return (
      <SyntaxHighlighter language={language} wrapLongLines={true} {...props}>
        {children}
      </SyntaxHighlighter>
    );
  }

  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      message.success("内容已复制到剪贴板");
    } catch (err) {
      console.error("复制文本失败: ", err);
      message.error("复制失败，请重试");
    }
  };

  return (
    <>
      {isShowCopyButton && <Button
        type="text"
        size="middle"
        icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
        className="absolute top-0 right-0 transition-opacity"
        onClick={copyToClipboard}
      />}
      <ReactMarkdown
        unwrapDisallowed={true}
        remarkPlugins={[remarkGfm]}
        components={{
          p: defaults.p,
          em: defaults.em,
          blockquote: defaults.blockquote,
          del: defaults.del,
          hr: defaults.hr,
          a: defaults.a,
          img: defaults.img,
          text: defaults.text,
          ul: defaults.ul,
          ol: defaults.ol,
          li: defaults.li,
          h1: defaults.heading,
          h2: defaults.heading,
          h3: defaults.heading,
          h4: defaults.heading,
          h5: defaults.heading,
          h6: defaults.heading,
          table: defaults.table,
          thead: defaults.thead,
          tbody: defaults.tbody,
          tr: defaults.tr,
          td: defaults.td,
          th: defaults.th,
          code(props: any) {
            const { node, inline, className, children } = props;
            const match = /language-(\w+)/.exec(className || "");
            // we had replace \n to \n\n for markdown to works, but it will cause a bug in syntax highlighter, so we need to return it back.
            const code = String(children)?.replace(/\n$/, "");

            return !inline && match ? (getHighlighter(match, props, code)) : (
              <code className={className + " " + "plaintext"} {...props}>
                {code}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
}
