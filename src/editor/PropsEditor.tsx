import React, { useEffect, useState } from "react";

const attrSelector = (path: string) => `[data-json-path="${path}"]`;

interface Props {
  selected: string | null;
  ratio: number;
  onClose: () => void;
}

const PropsEditor: React.FC<Props> = ({ selected, ratio, onClose }) => {
  const [propsRows, setPropsRows] = useState<Array<{ k: string; v: string }>>([]);

  useEffect(() => {
    if (!selected) return;
    const win = (window as any) || {};
    const node = win.__spreacte_node_map ? win.__spreacte_node_map[selected] : null;
    if (!node) return;
    const current = node.props || {};
    const rows = Object.entries(current).map(([k, v]) => ({ k, v: JSON.stringify(v) }));
    setPropsRows(rows.length ? rows : [{ k: "", v: "" }]);
  }, [selected]);

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

    node.props = { ...(node.props || {}), ...parsedProps };
    const el = document.querySelector(attrSelector(selected)) as HTMLElement | null;
    applyPropsToElement(el, parsedProps);
    onClose();
    if (el) el.getBoundingClientRect();
  };

  if (!selected) return null;

  return (
    <div
      data-control="true"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100%",
        width: 320,
        background: "#ffffff",
        zIndex: 100002,
        boxShadow: "-6px 0 12px rgba(0,0,0,0.06)",
        borderLeft: "1px solid #ececec",
        padding: 14,
        overflow: "auto",
        color: "#111",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: 14 }}>Props Editor</strong>
        <div>
          <button
            data-control="true"
            onClick={savePropsEditor}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "#111",
              fontSize: 13,
              cursor: "pointer",
              marginRight: 8,
            }}
          >
            Save
          </button>
          <button
            data-control="true"
            onClick={onClose}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid rgba(0,0,0,0.04)",
              color: "#666",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {propsRows.map((row, idx) => (
          <div
            key={idx}
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
              value={row.k}
              onChange={(e) => {
                const next = [...propsRows];
                next[idx] = { ...next[idx], k: e.target.value };
                setPropsRows(next);
              }}
              style={{
                flex: "0 0 110px",
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
      </div>
    </div>
  );
};

export default PropsEditor;
