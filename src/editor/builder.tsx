import React from "react";
import Box from "../components/Box";
import * as utils from "../utils";

interface JsonNode {
  type: string;
  props?: Record<string, any>;
  children?: Array<JsonNode | string>;
  value?: string;
}

const COMPONENT_MAP: Record<string, React.ElementType> = {
  Box,
  h1: "h1",
  h2: "h2",
  p: "p",
  button: "button",
};

const evaluateExpression = (value: string) => {
  if (value === "utils.numberWithCommas(1234567)") {
    return utils.numberWithCommas(1234567);
  }

  if (value === "utils.isDev()") {
    return utils.isDev();
  }

  return null;
};

const createElement = (node: JsonNode | string, key?: number | string, path: string = "0"): React.ReactNode => {
  if (typeof node === "string") return node;
  if (node.type === "expression") return evaluateExpression(node.value ?? "");

  // ensure global node map and root reference exist
  const win = typeof window !== "undefined" ? (window as any) : undefined;
  if (win) {
    win.__spreacte_node_map = win.__spreacte_node_map || {};
  }

  const Component = COMPONENT_MAP[node.type] || node.type;
  const props = node.props || {};

  // attach data-json-path so editor can find and map DOM -> JSON node
  const propsWithPath = { ...(props as Record<string, any>), ["data-json-path"]: path };

  // store reference to node for editor to mutate
  if (win) {
    win.__spreacte_node_map[path] = node;
  }

  const children = (node.children || []).map((child, index) => createElement(child, index, `${path}/${index}`));

  return React.createElement(Component, { key, ...propsWithPath }, ...children);
};

export default function buildFromJson(structure: JsonNode) {
  const win = typeof window !== "undefined" ? (window as any) : undefined;
  if (win) {
    win.__spreacte_root_structure = structure;
    win.__spreacte_node_map = win.__spreacte_node_map || {};
  }

  return createElement(structure, 0, "0");
}
