import React, { useState } from "react";
import { GlobalContextProvider } from "@tsminh/spreacte";
import DemoContent from "./DemoContent";

const App: React.FC = () => {
  const [fixedRatio, setFixedRatio] = useState(false);
  return (
    <GlobalContextProvider
      editorConfig={{ savePath: "test" }}
      fixedRatio={fixedRatio}
      width={360}
      imgRootPath="/images"
    >
      <div className="demo-shell">
        <div>
          Config:
          <div>
            Fixed ratio:{" "}
            <input type="checkbox" checked={fixedRatio} onChange={(e) => setFixedRatio(e.target.checked)} />
          </div>
        </div>
        <DemoContent />
      </div>
    </GlobalContextProvider>
  );
};

export default App;
