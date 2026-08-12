declare module "@tsminh/spreacte/dist/esm/editor" {
  import React from "react";
  const component: React.ComponentType<any>;
  export default component;
}

declare module "@react-spectrum/s2/Provider" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}
