import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../components/GlobalContext";

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

const Editor: React.FC = () => {
  const { ratio } = useGlobalContext();
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

  const editProps = () => {
    if (!selected) return;
    const win = (window as any) || {};
    const node = win.__spreacte_node_map ? win.__spreacte_node_map[selected] : null;
    if (!node) return;
    const current = node.props || {};
    const next = prompt("Edit JSON props for selected element:", JSON.stringify(current, null, 2));
    try {
      if (next) {
        const parsed = JSON.parse(next);
        node.props = parsed;
        // apply quick visual update
        const el = document.querySelector(attrSelector(selected)) as HTMLElement | null;
        if (el) {
          if (parsed.width) el.style.width = `${parsed.width * ratio}px`;
          if (parsed.height) el.style.height = `${parsed.height * ratio}px`;
          if (parsed.left) el.style.left = `${parsed.left * ratio}px`;
          if (parsed.top) el.style.top = `${parsed.top * ratio}px`;
        }
      }
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  const handleSave = () => {
    const win = (window as any) || {};
    const root = win.__spreacte_root_structure || null;
    if (!root) return alert("No structure found to save");
    downloadJson(root, "structure.edited.json");
  };

  return (
    <>
      <div style={{ position: "fixed", right: 12, top: 12, zIndex: 100000 }}>
        <button onClick={() => setEditing((s) => !s)} style={{ marginRight: 8 }}>
          {editing ? "Exit Edit" : "Edit"}
        </button>
        <button onClick={handleSave} style={{ marginRight: 8 }}>
          Save JSON
        </button>
        <button onClick={editProps} disabled={!selected}>
          Edit Props
        </button>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: !editing ? "auto" : "none",
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
              <div
                onMouseDown={handleResizeMouseDown}
                style={{
                  position: "absolute",
                  right: -8,
                  bottom: -8,
                  width: 16,
                  height: 16,
                  background: "#fff",
                  border: "2px solid #00f",
                  borderRadius: 2,
                  cursor: "nwse-resize",
                  pointerEvents: "all",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Editor;
