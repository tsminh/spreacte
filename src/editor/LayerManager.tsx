import React, { useState } from "react";
import Layers from "@react-spectrum/s2/icons/Layers";
import {
  ActionButton,
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
  DisclosureTitle,
  Text,
  ToggleButton,
} from "@react-spectrum/s2";
import ChevronRight from "@react-spectrum/s2/icons/ChevronRight";
import ChevronDown from "@react-spectrum/s2/icons/ChevronDown";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

type JsonNode = {
  type: string;
  props?: Record<string, any>;
  children?: Array<JsonNode | string>;
  value?: string;
};

const renderLabel = (node: any, path: string) => {
  if (!node) return <span style={{ color: "#999" }}>{path}</span>;
  return (
    <>
      <Text
        styles={style({
          fontWeight: "bold",
        })}
      >
        {node.type}
      </Text>
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
        <ToggleButton
          isQuiet
          size="M"
          onChange={() => {
            if (selected === path) onSelect?.(null);
            else onSelect?.(path);
          }}
          isSelected={selected === path}
        >
          {children.length > 0 ? (
            <ActionButton
              size="XS"
              // isQuiet
              onPress={() => {
                toggle(path);
              }}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronDown />}
            </ActionButton>
          ) : (
            <div style={{ width: 22 }} />
          )}
          <Text>{renderLabel(node, path)}</Text>
        </ToggleButton>

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
    <Disclosure defaultExpanded>
      <DisclosureHeader>
        <DisclosureTitle>
          <Layers styles={style({ alignSelf: "center" })} />
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
