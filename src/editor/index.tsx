import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropsEditor from "./PropsEditor";
import LayerManager from "./LayerManager";
import JSONViewer from "./JSONViewer";
import { Button } from "./components";

const downloadJson = (obj: any, filename = "structure.json") => {
  const dataStr = JSON.stringify(obj, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const attrSelector = (path: string) => `[data-json-path="${path}"]`;

const ControllerContainer = styled.div`
  display: flex;
  position: absolute;
  right: -8px;
  bottom: -8px;
  pointer-events: all;

  > div {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      pointer-events: none;
    }
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const Editor: React.FC<{ ratio: number }> = ({ ratio }) => {
  const THIS_IS_BUILD_CHECK = "IF_THIS_IS_IN_BUNDLE_THEN_IT_IS_INCLUDED";
  console.log(ratio);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [overlayRect, setOverlayRect] = useState<DOMRect | null>(null);
  const dragState = useRef<any>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      const { type, startX, startY, startRect, path } = dragState.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const el = document.querySelector(attrSelector(path)) as HTMLElement | null;
      if (!el) return;

      if (type === "drag") {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        // update overlay to follow transformed element
        setOverlayRect(el.getBoundingClientRect());
      }

      if (type === "resize") {
        const newW = Math.max(10, startRect.width + dx);
        const newH = Math.max(10, startRect.height + dy);
        el.style.width = `${newW}px`;
        el.style.height = `${newH}px`;
        setOverlayRect(el.getBoundingClientRect());
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!dragState.current) return;
      const { type, startX, startY, startRect, path } = dragState.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const win = (window as any) || {};
      const node = win.__spreacte_node_map ? win.__spreacte_node_map[path] : null;
      const el = document.querySelector(attrSelector(path)) as HTMLElement | null;

      if (el) {
        // clear transform/inline adjustments and write values back to json node
        if (type === "drag") {
          el.style.transform = "";
          // compute numeric props using ratio
          const left = (startRect.left + dx - (el.offsetParent as HTMLElement)?.getBoundingClientRect().left) / ratio;
          const top = (startRect.top + dy - (el.offsetParent as HTMLElement)?.getBoundingClientRect().top) / ratio;
          if (node) {
            node.props = node.props || {};
            node.props.left = Math.round(left);
            node.props.top = Math.round(top);
          }
        }

        if (type === "resize") {
          const newW = Math.max(10, startRect.width + dx) / ratio;
          const newH = Math.max(10, startRect.height + dy) / ratio;
          if (node) {
            node.props = node.props || {};
            node.props.width = Math.round(newW);
            node.props.height = Math.round(newH);
          }
        }
      }
      dragState.current = null;
      // refresh overlay rect once drag finishes
      if (el) setOverlayRect(el.getBoundingClientRect());
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [ratio]);

  useEffect(() => {
    if (!editing) {
      setSelected(null);
      setOverlayRect(null);
    }
  }, [editing]);

  // keep overlayRect in sync with the selected element and on scroll/resize
  useEffect(() => {
    if (!editing || !selected) {
      setOverlayRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(attrSelector(selected)) as HTMLElement | null;
      setOverlayRect(el ? el.getBoundingClientRect() : null);
    };

    updateRect();
    const onScroll = () => requestAnimationFrame(updateRect);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [editing, selected]);

  // listen on the document for mousedown to select/start-drag elements
  useEffect(() => {
    const onDocMouseDown = (ev: MouseEvent) => {
      if (!editing) return;
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      if (target.getAttribute("data-control") === "true") return;
      const el = target.closest("[data-json-path]") as HTMLElement | null;
      if (!el) {
        // clicked outside any editable element -> deselect
        setSelected(null);
        return;
      }

      // start drag
      ev.stopPropagation();
      ev.preventDefault();
      const path = el.getAttribute("data-json-path") || null;
      if (!path) return;
      setSelected(path);
      const rect = el.getBoundingClientRect();
      dragState.current = { type: "drag", startX: ev.clientX, startY: ev.clientY, startRect: rect, path };
    };

    document.addEventListener("mousedown", onDocMouseDown, true);
    return () => document.removeEventListener("mousedown", onDocMouseDown, true);
  }, [editing]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!editing) return;
    const target = e.target as HTMLElement;
    const el = target.closest("[data-json-path]") as HTMLElement | null;
    if (!el) return;
    e.stopPropagation();
    e.preventDefault();
    const path = el.getAttribute("data-json-path") || null;
    if (!path) return;
    const rect = el.getBoundingClientRect();
    dragState.current = { type: "resize", startX: e.clientX, startY: e.clientY, startRect: rect, path };
  };

  const [propsEditorOpen, setPropsEditorOpen] = useState(false);

  useEffect(() => {
    if (!selected) setPropsEditorOpen(false);
  }, [selected]);

  const openPropsEditor = () => {
    if (!selected) return;
    setPropsEditorOpen(true);
  };

  const handleSave = () => {
    const win = (window as any) || {};
    const root = win.__spreacte_root_structure || null;
    if (!root) return alert("No structure found to save");
    downloadJson(root, "structure.edited.json");
  };

  return (
    <>
      <div data-debug={THIS_IS_BUILD_CHECK} style={{ position: "fixed", left: 4, top: 2, zIndex: 100000 }}>
        <Button onClick={() => setEditing((s) => !s)} style={{ marginRight: 8 }}>
          {editing ? "Exit Edit" : "Edit"}
        </Button>
        <Button onClick={handleSave} style={{ marginRight: 8 }}>
          Save JSON
        </Button>
      </div>

      {editing && (
        <div style={{ position: "fixed", width: 250, top: 30, left: 0, paddingLeft: 8, background: "white" }}>
          <LayerManager />
          <JSONViewer />
        </div>
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 99999,
        }}
      >
        {editing && selected && overlayRect && (
          <div ref={overlayRef} style={{ position: "fixed", zIndex: 100001, pointerEvents: "none" }}>
            <div
              style={{
                position: "fixed",
                left: overlayRect.left,
                top: overlayRect.top,
                width: overlayRect.width,
                height: overlayRect.height,
                boxSizing: "border-box",
                border: "2px dashed #00f",
                pointerEvents: "none",
              }}
            >
              <ControllerContainer>
                <div data-control="true" onClick={openPropsEditor}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M18.9445 9.1875L14.9445 5.1875M18.9445 9.1875L13.946 14.1859C13.2873 14.8446 12.4878 15.3646 11.5699 15.5229C10.6431 15.6828 9.49294 15.736 8.94444 15.1875C8.39595 14.639 8.44915 13.4888 8.609 12.562C8.76731 11.6441 9.28735 10.8446 9.946 10.1859L14.9445 5.1875M18.9445 9.1875C18.9445 9.1875 21.9444 6.1875 19.9444 4.1875C17.9444 2.1875 14.9445 5.1875 14.9445 5.1875M20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12C3.5 5.5 5.5 3.5 12 3.5"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <div
                  data-control
                  onMouseDown={handleResizeMouseDown}
                  style={{
                    cursor: "nwse-resize",
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill="var(--ci-primary-color, #000000)"
                        d="M404.687,212.686l-50.51,50.51L248.805,157.823l50.841-50.843L272.666,80H80V272l27.313,27.314,50.982-50.981L263.667,353.706l-51.313,51.313L239.333,432H432V240ZM400,400H262.627l46.3-46.294L158.295,203.078,112,249.373V112H249.373L203.55,157.823,354.177,308.451,400,262.627Z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </ControllerContainer>
            </div>
          </div>
        )}
      </div>
      <PropsEditor selected={selected} ratio={ratio} onClose={() => setPropsEditorOpen(false)} />
    </>
  );
};

export default Editor;
