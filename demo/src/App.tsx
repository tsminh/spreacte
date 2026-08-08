import React, { useState } from "react";
import { Box, GlobalContextProvider, useModal, utils } from "@tsminh/spreacte";

const DemoContent: React.FC = () => {
  const modal = useModal();

  return (
    <Box width={200} height={200} pt={16} px={20} style={{ background: "#14213d", borderRadius: 24 }} safeAreaTop>
      <h1>spreacte Demo</h1>
      <p>{`Number format: ${utils.numberWithCommas(1234567)}`}</p>
      <button
        onClick={() => {
          modal.open(
            <Box
              width={200}
              height={200}
              pt={16}
              px={20}
              style={{ background: "#fca311", borderRadius: 24, color: "#000" }}
            >
              <h2>Modal opened</h2>
              <p>Close when you are ready.</p>
              <button onClick={() => modal.close()}>Close</button>
            </Box>,
          );
        }}
      >
        Open Modal
      </button>
      <p>{`Dev mode: ${utils.isDev()}`}</p>
    </Box>
  );
};

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
