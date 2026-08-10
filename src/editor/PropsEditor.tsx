import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, HeaderSection } from "./components";
import { BOX_PROP_KEYS, BOX_PROP_VALUE_SUGGESTIONS } from "./propsEditorConstants";

const attrSelector = (path: string) => `[data-json-path="${path}"]`;

interface Props {
  selected: string | null;
  ratio: number;
  onClose: () => void;
}

const PropsEditorContainer = styled.div`
  max-height: 100vh;
  overflow: auto;
  background: white;
  top: 8px;
  right: 0;
  position: fixed;
  width: 400px;
  padding-right: 8px;
`;

const PropsEditor: React.FC<Props> = ({ selected, ratio, onClose }) => {
  const [propsRows, setPropsRows] = useState<Array<{ k: string; v: string }>>([]);
  const [styleRows, setStyleRows] = useState<Array<{ k: string; v: string }>>([]);

  useEffect(() => {
    if (!selected) return;
    const win = (window as any) || {};
    const node = win.__spreacte_node_map ? win.__spreacte_node_map[selected] : null;
    if (!node) return;
    const current = node.props || {};
    const props = Object.entries(current)
      .filter(([k]) => k !== "style")
      .map(([k, v]) => ({ k, v: JSON.stringify(v) }));
    const style =
      current.style && typeof current.style === "object"
        ? Object.entries(current.style).map(([k, v]) => ({ k, v: JSON.stringify(v) }))
        : [];
    console.log(ratio, node);
    setPropsRows(props.length ? props : [{ k: "", v: "" }]);
    setStyleRows(style.length ? style : [{ k: "", v: "" }]);
  }, [ratio, selected]);

  const applyPropsToElement = (el: HTMLElement | null, parsed: Record<string, any>) => {
    if (!el) return;
    const SPACING_MAP: Record<string, string[]> = {
      mt: ["marginTop"],
      mb: ["marginBottom"],
      ml: ["marginLeft"],
      mr: ["marginRight"],
      mx: ["marginLeft", "marginRight"],
      my: ["marginTop", "marginBottom"],
      pt: ["paddingTop"],
      pb: ["paddingBottom"],
      pl: ["paddingLeft"],
      pr: ["paddingRight"],
      px: ["paddingLeft", "paddingRight"],
      py: ["paddingTop", "paddingBottom"],
    };
    const NUM_STYLE_KEYS = new Set([
      "width",
      "height",
      "left",
      "top",
      "right",
      "bottom",
      "fontSize",
      "borderRadius",
      "gap",
      "rowGap",
      "colGap",
      "aspectRatio",
    ]);

    if (parsed.style && typeof parsed.style === "object") {
      Object.entries(parsed.style).forEach(([k, v]) => {
        if (typeof v === "number")
          el.style.setProperty(
            k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
            `${v}px`,
          );
        else
          el.style.setProperty(
            k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
            String(v),
          );
      });
    }

    Object.entries(parsed).forEach(([k, v]) => {
      if (k === "style") return;
      if (SPACING_MAP[k]) {
        SPACING_MAP[k].forEach((cssKey) => {
          if (typeof v === "number") el.style[cssKey as any] = `${v * ratio}px`;
          else el.style[cssKey as any] = String(v);
        });
        return;
      }
      if (NUM_STYLE_KEYS.has(k)) {
        if (typeof v === "number") el.style[k as any] = `${v * ratio}px`;
        else el.style[k as any] = String(v);
        return;
      }
      if (typeof v === "number") {
        el.style.setProperty(
          k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
          `${v * ratio}px`,
        );
        return;
      }
      try {
        if (typeof v === "string") el.setAttribute(k, v);
      } catch (err) {}
    });
  };

  const savePropsEditor = () => {
    if (!selected) return onClose();
    const win = (window as any) || {};
    const node = win.__spreacte_node_map ? win.__spreacte_node_map[selected] : null;
    if (!node) return onClose();

    const parsedProps: Record<string, any> = {};
    propsRows.forEach(({ k, v }) => {
      if (!k) return;
      try {
        parsedProps[k] = JSON.parse(v);
      } catch {
        parsedProps[k] = v;
      }
    });

    const parsedStyle: Record<string, any> = {};
    styleRows.forEach(({ k, v }) => {
      if (!k) return;
      try {
        parsedStyle[k] = JSON.parse(v);
      } catch {
        parsedStyle[k] = v;
      }
    });

    if (Object.keys(parsedStyle).length || Object.keys(flexLayout).length) {
      parsedProps.style = {
        ...parsedStyle,
        ...flexLayout,
      };
    }

    node.props = { ...(node.props || {}), ...parsedProps };
    const el = document.querySelector(attrSelector(selected)) as HTMLElement | null;
    applyPropsToElement(el, parsedProps);
    onClose();
    if (el) el.getBoundingClientRect();
  };

  const [flexLayout, setFlexLayout] = useState({});

  // if (!selected) return null;

  const [collapsed, setCollapsed] = useState(true);

  return (
    <PropsEditorContainer data-control="true">
      <HeaderSection onClick={() => setCollapsed((v) => !v)}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="#292D32"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
              stroke="#292D32"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
        Props Editor
      </HeaderSection>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button data-control="true" onClick={savePropsEditor}>
          Save
        </Button>
        <Button data-control="true" onClick={onClose}>
          Cancel
        </Button>
      </div>

      {collapsed && (
        <div style={{ marginTop: 12, padding: 4 }}>
          {propsRows.map((row, idx) => (
            <div
              key={`prop-${idx}`}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <input
                data-control="true"
                placeholder="key"
                list="box-prop-keys"
                value={row.k}
                onChange={(e) => {
                  const next = [...propsRows];
                  next[idx] = { ...next[idx], k: e.target.value };
                  setPropsRows(next);
                }}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "1px solid #e9e9e9",
                }}
              />
              <input
                data-control="true"
                placeholder="value (JSON or raw)"
                list={BOX_PROP_VALUE_SUGGESTIONS[row.k] ? `box-prop-values-${idx}` : undefined}
                value={row.v}
                onChange={(e) => {
                  const next = [...propsRows];
                  next[idx] = { ...next[idx], v: e.target.value };
                  setPropsRows(next);
                }}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "1px solid #e9e9e9",
                }}
              />
              <button
                data-control="true"
                onClick={() => {
                  const next = propsRows.filter((_, i) => i !== idx);
                  setPropsRows(next.length ? next : [{ k: "", v: "" }]);
                }}
                style={{
                  flexShrink: 0,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              {BOX_PROP_VALUE_SUGGESTIONS[row.k] ? (
                <datalist id={`box-prop-values-${idx}`}>
                  {BOX_PROP_VALUE_SUGGESTIONS[row.k].map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>
              ) : null}
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <button
              data-control="true"
              onClick={() => setPropsRows((s) => [...s, { k: "", v: "" }])}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              + Add prop
            </button>
          </div>

          <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid #e9e9e9" }}>
            <strong>Style</strong>
            {styleRows.map((row, idx) => (
              <div
                key={`style-${idx}`}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  alignItems: "center",
                }}
              >
                <input
                  data-control="true"
                  placeholder="style key"
                  value={row.k}
                  onChange={(e) => {
                    const next = [...styleRows];
                    next[idx] = { ...next[idx], k: e.target.value };
                    setStyleRows(next);
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: "1px solid #e9e9e9",
                  }}
                />
                <input
                  data-control="true"
                  placeholder="value (JSON or raw)"
                  value={row.v}
                  onChange={(e) => {
                    const next = [...styleRows];
                    next[idx] = { ...next[idx], v: e.target.value };
                    setStyleRows(next);
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: "1px solid #e9e9e9",
                  }}
                />
                <button
                  data-control="true"
                  onClick={() => {
                    const next = styleRows.filter((_, i) => i !== idx);
                    setStyleRows(next.length ? next : [{ k: "", v: "" }]);
                  }}
                  style={{
                    flexShrink: 0,
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.06)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <button
                data-control="true"
                onClick={() => setStyleRows((s) => [...s, { k: "", v: "" }])}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                + Add style
              </button>
            </div>
          </div>

          <datalist id="box-prop-keys">
            {BOX_PROP_KEYS.map((key) => (
              <option key={key} value={key} />
            ))}
          </datalist>

          <section>
            <div>
              <strong>Layout</strong>

              <span style={{ marginLeft: 16 }}>
                <label>Flex</label>
                <input type="checkbox" />
              </span>
            </div>
          </section>
        </div>
      )}
    </PropsEditorContainer>
  );
};

export default PropsEditor;
