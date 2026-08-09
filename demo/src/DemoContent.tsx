import React, { useEffect, useState } from "react";
import { buildFromJson } from "@tsminh/spreacte";
import structure from "./DemoContent.structure.json";

const DemoContent: React.FC = () => {
  const [data, setData] = useState(structure);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (!["LAYER"].includes(event.data?.type)) return;
      setData(event.data.data);
    });
  }, []);

  return <>{buildFromJson(data)}</>;
};

export default DemoContent;
