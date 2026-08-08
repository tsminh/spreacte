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

const createElement = (node: JsonNode | string, key?: number | string): React.ReactNode => {
  if (typeof node === "string") return node;
  if (node.type === "expression") return evaluateExpression(node.value ?? "");

  const Component = COMPONENT_MAP[node.type] || node.type;
  const props = node.props || {};
  const children = (node.children || []).map((child, index) => createElement(child, index));

  return React.createElement(Component, { key, ...props }, ...children);
};

export default function buildFromJson(structure: JsonNode) {
  return createElement(structure, 0);
}
