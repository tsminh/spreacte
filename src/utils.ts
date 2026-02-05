export function numberWithCommas(x = 0) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(".");
}

export const isDev = () => window.location.hostname.includes("localhost");

export const measureWindowSize = () => {
  document.documentElement.style.setProperty("--vw", `${window.innerWidth}px`);
  document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
};
