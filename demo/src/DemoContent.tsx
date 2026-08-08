import React from "react";
import { buildFromJson } from "@tsminh/spreacte";
import structure from "./DemoContent.structure.json";

const DemoContent: React.FC = () => <>{buildFromJson(structure)}</>;

export default DemoContent;
