import React, { useState } from "react";
import styled from "styled-components";
import { HeaderSection } from "./components";

type JsonNode = {
  type: string;
  props?: Record<string, any>;
  children?: Array<JsonNode | string>;
  value?: string;
};

const LayerManagerContainer = styled.div`
  max-height: 70vh;
  overflow: auto;
  background: #fff;
`;

const renderLabel = (node: any, path: string) => {
  if (!node) return <span style={{ color: "#999" }}>{path}</span>;
  return (
    <>
      <strong style={{ marginRight: 6, color: "red" }}>{node.type}</strong>
      <span style={{ color: "#666", fontSize: 12 }}>{`[${path}]`}</span>
    </>
  );
};

const LayerManager: React.FC = () => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const root = (typeof window !== "undefined" ? (window as any).__spreacte_root_structure : null) as JsonNode | null;

  const toggle = (path: string) => setCollapsed((c) => ({ ...c, [path]: !c[path] }));

  const renderNode = (node: any, path: string) => {
    const isCollapsed = !!collapsed[path];
    const children = (node && node.children) || [];

    return (
      <div key={path} style={{ paddingLeft: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 6px",
            cursor: "default",
          }}
        >
          {children.length > 0 ? (
            <button
              onClick={() => toggle(path)}
              style={{
                width: 16,
                height: 16,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                border: "none",
                background: "none",
              }}
            >
              {isCollapsed ? "▸" : "▾"}
            </button>
          ) : (
            <div style={{ width: 22 }} />
          )}
          <div style={{ flex: 1 }}>{renderLabel(node, path)}</div>
        </div>

        {!isCollapsed && (
          <div style={{ marginLeft: 12, borderLeft: "1px dashed #eee", paddingLeft: 8 }}>
            {children.map((child: any, idx: number) => {
              const childPath = `${path}/${idx}`;
              return (
                <div key={childPath}>
                  {typeof child === "string" ? (
                    <div style={{ padding: "2px 6px", color: "#666", fontSize: 13 }}>{String(child).slice(0, 60)}</div>
                  ) : (
                    renderNode(child, childPath)
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const [vis, setVis] = useState(true);

  if (!root) {
    return (
      <div
        style={{
          position: "fixed",
          left: 12,
          top: 56,
          width: 320,
          maxHeight: "60vh",
          overflow: "auto",
          background: "#fff",
          padding: 8,
          zIndex: 100000,
        }}
      >
        <div style={{ color: "#666" }}>No structure found</div>
      </div>
    );
  }

  return (
    <LayerManagerContainer>
      <HeaderSection onClick={() => setVis((v) => !v)}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M20 10L12 5L4 10L12 15L20 10Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
            <path
              d="M20 14L12 19L4 14"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
        Layers
      </HeaderSection>
      {vis && <div style={{ padding: 4 }}>{renderNode(root, "0")}</div>}
    </LayerManagerContainer>
  );
};

export default LayerManager;
