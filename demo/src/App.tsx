import React, { useState } from "react";
import { GlobalContextProvider } from "@tsminh/spreacte";
import Editor from "@tsminh/spreacte/dist/esm/editor";

import DemoContent from "./DemoContent";

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
      <div style={{ width: 393, height: 650, border: "2px solid", borderRadius: 4, background: "#ffffff76" }}>
        <GlobalContextProvider
          mockWindowSize={{ width: 393, height: 650 }}
          fixedRatio={fixedRatio}
          width={360}
          imgRootPath="/images"
        >
          <DemoContent />
        </GlobalContextProvider>
      </div>
      <Editor />
    </div>
  );
};

export default App;
