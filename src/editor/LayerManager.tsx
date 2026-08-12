import React, { useState } from "react";
import styled from "styled-components";
import { HeaderSection } from "./components";
import Layers from "@react-spectrum/s2/icons/Layers";
import { Accordion, Disclosure, DisclosureHeader, DisclosurePanel, DisclosureTitle } from "@react-spectrum/s2";

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

type Props = {
  onSelect?: (path: string | null) => void;
  selected?: string | null;
};

const LayerManager: React.FC<Props> = ({ onSelect, selected }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const root = (typeof window !== "undefined" ? (window as any).__spreacte_root_structure : null) as JsonNode | null;

  const toggle = (path: string) => setCollapsed((c) => ({ ...c, [path]: !c[path] }));

  const renderNode = (node: any, path: string) => {
    const isCollapsed = !!collapsed[path];
    const children = (node && node.children) || [];

    return (
      <div key={path} style={{ paddingLeft: 8 }}>
        <div
          onClick={() => onSelect && onSelect(path)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 6px",
            cursor: onSelect ? "pointer" : "default",
            background: selected === path ? "rgba(24,144,255,0.08)" : "transparent",
            borderRadius: 4,
          }}
        >
          {children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(path);
              }}
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
    <Disclosure>
      <DisclosureHeader>
        <DisclosureTitle>
          <Layers />
          Layers
        </DisclosureTitle>
      </DisclosureHeader>
      <DisclosurePanel>
        <div style={{ padding: 4 }}>{renderNode(root, "0")}</div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default LayerManager;
