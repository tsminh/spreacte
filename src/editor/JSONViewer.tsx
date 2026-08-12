import React from "react";
import styled from "styled-components";
import { Disclosure, DisclosureHeader, DisclosurePanel, DisclosureTitle } from "@react-spectrum/s2";
import Code from "@react-spectrum/s2/icons/Code";

type JsonNode = {
  type: string;
  props?: Record<string, any>;
  children?: Array<JsonNode | string>;
  value?: string;
};

const JsonBlock = styled.pre`
  margin: 0;
  padding: 12px;
  max-height: 300px;
  overflow: auto;
  white-space: pre;
  background: #fafafa;
  color: #111;
  border-radius: 0 0 8px 8px;
  font-size: 13px;
  line-height: 1.4;
`;

const EmptyMessage = styled.div`
  padding: 12px;
  color: #666;
`;

const JSONViewer = () => {
  const root = (typeof window !== "undefined" ? (window as any).__spreacte_root_structure : null) as JsonNode | null;

  return (
    <Disclosure>
      <DisclosureHeader>
        <DisclosureTitle>
          <Code />
          JSON
        </DisclosureTitle>
      </DisclosureHeader>
      <DisclosurePanel>
        {root ? (
          <JsonBlock>{JSON.stringify(root, null, 2)}</JsonBlock>
        ) : (
          <EmptyMessage>No JSON structure found</EmptyMessage>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default JSONViewer;
