"use client";

import "client-only";
import React, { useCallback, useEffect, useRef, useState } from "react";
import svgPanZoom from "svg-pan-zoom";
import { Row, Col, Button } from "antd";
import mermaid from "mermaid";
import { v4 as uuidv4 } from "uuid";

const uuid = () => `mermaid-${uuidv4().toString()}`;

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

export default function MermaidRender({ graphDefinition }: { graphDefinition: string }) {
  const [instance, setInstance] = useState<SvgPanZoom.Instance | null>(null);

  const lastGraphDefinition = useRef<string | null>(null);

  const enableZoom = useCallback(() => {
    instance?.enablePan();
    instance?.enableZoom();
  }, [instance]);

  const disableZoom = useCallback(() => {
    instance?.disablePan();
    instance?.disableZoom();
  }, [instance]);

  const resetZoom = useCallback(() => {
    instance?.fit();
    instance?.center();
  }, [instance]);

  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = React.useState(false);
  const currentId = uuid();

  const downloadSVG = useCallback(() => {
    const svg = ref.current!.innerHTML;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    downloadBlob(blob, `myimage.svg`);
  }, []);

  useEffect(() => {
    if (!ref.current || !graphDefinition) return;
    mermaid.initialize({
      startOnLoad: true,
      mindmap: {
        useWidth: 800,
      },
    });

    if (lastGraphDefinition.current === graphDefinition) return;
    mermaid.render(currentId, graphDefinition, ref.current)
      .then(({ svg, bindFunctions }) => {
        ref.current!.innerHTML = svg;
        bindFunctions?.(ref.current!);

        // set height for svg
        const svgElement = ref.current!.querySelector("svg");
        svgElement?.setAttribute("height", "100%");
        svgElement?.setAttribute("width", "100%");

        setInstance(() => {
          const instance = svgPanZoom(ref.current!.querySelector("svg")!);
          instance.fit();
          instance.zoom(1);
          instance.center();
          instance.disablePan();
          instance.disableZoom();
          return instance;
        });
      })
      .catch((e) => {
        console.info(e);
        // NOTE(CGQAQ): there's a bug in mermaid will always throw an error:
        //  Error: Diagram error not found.
        // we need to check if the svg is rendered.
        // if rendered, we can ignore the error.
        // ref: https://github.com/mermaid-js/mermaid/issues/4140
        if (ref.current?.querySelector("svg") == null) {
          setHasError(true);
        }
      });

    lastGraphDefinition.current = graphDefinition;
  }, [graphDefinition]);

  useEffect(() => {
    const handleSpaceDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        enableZoom();
      }
    };

    const handleSpaceUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        disableZoom();
      }
    };
    document.addEventListener("keydown", handleSpaceDown);
    document.addEventListener("keyup", handleSpaceUp);

    return () => {
      document.removeEventListener("keydown", handleSpaceDown);
      document.removeEventListener("keyup", handleSpaceUp);
    };
  }, [enableZoom, disableZoom]);

  if (hasError || !graphDefinition) return <code className={"mermaid"}>{graphDefinition}</code>;
  return (
    <>
      <Row justify="end" className="text-gray-400 font-bold">
        <Col>
          * hold space to pan & zoom
        </Col>
      </Row>
      <div
        ref={ref}
        style={{ width: "100%", height: "600px" }}
        onPointerDown={(event) => {
          ref.current?.querySelector("svg")?.setPointerCapture(event.pointerId);
        }}
      ></div>
      <Row gutter={16}>
        <Col>
          <Button onClick={resetZoom}>Reset Pan & Zoom</Button>
        </Col>
        <Col>
          <Button onClick={downloadSVG}>Download SVG</Button>
        </Col>
      </Row>
    </>
  );
}
