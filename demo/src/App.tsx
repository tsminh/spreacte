import React, { useState } from "react";
import { GlobalContextProvider, useGlobalContext } from "@tsminh/spreacte";
import Editor from "@tsminh/spreacte/dist/esm/editor";
import DemoContent from "./DemoContent";

const EditorContainer = () => {
  const { ratio } = useGlobalContext();
  return <Editor ratio={ratio} />;
};

const App: React.FC = () => {
  const [fixedRatio, setFixedRatio] = useState(false);
  return (
    <div className="demo-shell">
      <div style={{ position: "fixed", right: 0, bottom: 0, fontSize: 12 }}>
        Config:
        <div>
          Fixed ratio: <input type="checkbox" checked={fixedRatio} onChange={(e) => setFixedRatio(e.target.checked)} />
        </div>
        <div>Width: 360</div>
      </div>
      <div
        style={{
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 393,
            height: 650,
            border: "2px solid",
            borderRadius: 4,
            background: "#ffffff76",
            overflow: "auto",
          }}
        >
          <GlobalContextProvider
            mockWindowSize={{ width: 393, height: 650 }}
            fixedRatio={fixedRatio}
            width={360}
            imgRootPath="/images"
          >
            <DemoContent />
          </GlobalContextProvider>
        </div>
        <EditorContainer />
      </div>
    </div>
  );
};

export default App;
