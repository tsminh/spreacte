import { CSSProperties, ReactNode, useMemo } from "react";
import { useGlobalContext } from "./GlobalContext";

interface BoxProps {
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  width?: number;
  height?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  fontSize?: number;
  img?: string;
  aspectRatio?: number;
  className?: string;
  fwidth?: boolean;
  safeAreaTop?: boolean;
}

const mappingStyleKey = (key: string) =>
  ["p", "m"].includes(key[0]) && key.length === 2
    ? `${{ p: "padding", m: "margin" }[key[0]]}${{ l: "Left", r: "Right", b: "Bottom", t: "Top" }[key[1]]}`
    : key;

const notStyleKeys = ["onClick", "children", "className", "fwidth", "safeAreaTop"];

const Box: React.FC<BoxProps> = (props) => {
  const { ratio } = useGlobalContext();
  const newProps = useMemo(
    () => ({
      style: {
        ...Object.fromEntries(
          Object.entries(props)
            .filter(([k]) => !notStyleKeys.includes(k) && k !== "style")
            .map(([k, v]) => [mappingStyleKey(k), (v as number) * ratio]),
        ),
        ...(props.img
          ? {
              backgroundImage: `url(${process.env.PUBLIC_URL}/img/${props.img})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }
          : undefined),
        ...(props.safeAreaTop ? { top: `calc(var(--ot) + ${(props.top || 0) * ratio}px)` } : undefined),
        ...(props.fwidth ? { width: "var(--vw)" } : undefined),
        aspectRatio: props.aspectRatio,
        pointerEvents: props.onClick || !props.img ? "all" : ("none" as any),
        ...props.style,
      },
      ...Object.fromEntries(
        Object.entries(props)
          .filter(([k]) => notStyleKeys.includes(k))
          .map(([k, v]) => [k, v]),
      ),
    }),
    [props, ratio],
  );

  return <div {...newProps} />;
};
export default Box;
