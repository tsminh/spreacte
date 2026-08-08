import React, { useState } from "react";
import { GlobalContextProvider } from "@tsminh/spreacte";
import Editor from "@tsminh/spreacte/dist/esm/editor";

import DemoContent from "./DemoContent";

const App: React.FC = () => {
  const [fixedRatio, setFixedRatio] = useState(false);
  return (
    <GlobalContextProvider fixedRatio={fixedRatio} width={360} imgRootPath="/images">
      <div className="demo-shell">
        <div>
          Config:
          <div>
            Fixed ratio:{" "}
            <input type="checkbox" checked={fixedRatio} onChange={(e) => setFixedRatio(e.target.checked)} />
          </div>
          <div>Width: 360</div>
        </div>
        <DemoContent />
        {/* <Editor /> */}
      </div>
    </GlobalContextProvider>
  );
};

export default App;
