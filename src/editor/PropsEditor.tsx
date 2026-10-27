import React, { useEffect, useState } from "react";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { BOX_PROP_KEYS, BOX_PROP_VALUE_SUGGESTIONS } from "./propsEditorConstants";
import {
  ComboBox,
  ComboBoxItem,
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
  DisclosureTitle,
  Button,
  ActionButton,
  Text,
  Divider,
  Header,
} from "@react-spectrum/s2";
import Delete from "@react-spectrum/s2/icons/Delete";
import Add from "@react-spectrum/s2/icons/Add";
import Settings from "@react-spectrum/s2/icons/Settings";

const attrSelector = (path: string) => `[data-json-path="${path}"]`;

interface Props {
  selected: string | null;
  ratio: number;
  onClose: () => void;
}

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

    console.log(parsed);

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
        if (typeof v === "string") {
          el.setAttribute(k, v);
          if (k === "img") el.style.setProperty("background-image", `url(${v})`);
        }
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
    // window.postMessage({
    //   type: "LAYER",
    //   data: {
    //     userId: "12345",
    //     theme: "dark",
    //   },
    // });
  };

  const [flexLayout, setFlexLayout] = useState({});

  // if (!selected) return null;

  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      data-control="true"
      className={style({
        position: "fixed",
        right: 0,
        top: 0,
        width: 300,
        backgroundColor: "layer-2",
        fontFamily: "sans",
      })}
    >
      <Disclosure defaultExpanded>
        <DisclosureHeader>
          <DisclosureTitle>
            <Settings styles={style({ alignSelf: "center" })} />
            <Header>Props Editor</Header>
          </DisclosureTitle>
        </DisclosureHeader>

        <DisclosurePanel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button data-control="true" onPress={savePropsEditor}>
              Save
            </Button>
            <Button data-control="true" onPress={onClose}>
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
                  <ComboBox
                    data-control="true"
                    placeholder="key"
                    allowsCustomValue
                    inputValue={row.k}
                    onInputChange={(k) => {
                      const next = [...propsRows];
                      next[idx] = { ...next[idx], k };
                      setPropsRows(next);
                    }}
                    styles={style({
                      flexShrink: 0,
                      width: 100,
                    })}
                  >
                    {BOX_PROP_KEYS?.map((e) => (
                      <ComboBoxItem>{e}</ComboBoxItem>
                    ))}
                  </ComboBox>
                  <ComboBox
                    allowsCustomValue
                    data-control="true"
                    placeholder="value (JSON or raw)"
                    inputValue={row.v}
                    onInputChange={(v) => {
                      const next = [...propsRows];
                      next[idx] = { ...next[idx], v };
                      setPropsRows(next);
                    }}
                    styles={style({
                      flexGrow: 1,
                    })}
                  >
                    {BOX_PROP_VALUE_SUGGESTIONS[row.k]?.map((e) => (
                      <ComboBoxItem>{e}</ComboBoxItem>
                    ))}
                  </ComboBox>
                  <ActionButton
                    data-control="true"
                    onPress={() => {
                      const next = propsRows.filter((_, i) => i !== idx);
                      setPropsRows(next.length ? next : [{ k: "", v: "" }]);
                    }}
                  >
                    <Delete />
                  </ActionButton>
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <ActionButton data-control="true" onPress={() => setPropsRows((s) => [...s, { k: "", v: "" }])}>
                  <Add />
                  <Text>Add prop</Text>
                </ActionButton>
              </div>

              <Divider styles={style({ marginY: 24 })} />

              <div style={{}}>
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
                  <ActionButton data-control="true" onPress={() => setStyleRows((s) => [...s, { k: "", v: "" }])}>
                    <Add />
                    <Text>Add style</Text>
                  </ActionButton>
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
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default PropsEditor;
