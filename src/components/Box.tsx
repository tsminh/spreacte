import { CSSProperties, ReactNode, useMemo } from "react";
import { useGlobalContext } from "./GlobalContext";

type SpacingKey = "mt" | "mb" | "ml" | "mr" | "pt" | "pb" | "pl" | "pr" | "px" | "py" | "mx" | "my";

type StyleNumberProps = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  fontSize?: number;
  aspectRatio?: number;
  borderRadius?: number;
  gap?: number;
  rowGap?: number;
  colGap?: number;
} & Partial<Record<SpacingKey, number>>;

interface BoxProps extends StyleNumberProps {
  onClick?: () => void;
  children?: ReactNode;

  style?: CSSProperties;
  className?: string;

  img?: string;
  fwidth?: boolean;
  safeAreaTop?: boolean;
}

const SPACING_MAP: Record<string, string[]> = {
  mt: ["marginTop"],
  mb: ["marginBottom"],
  ml: ["marginLeft"],
  mr: ["marginRight"],
  mx: ["marginLeft", "marginRight"],
  my: ["marginTop", "marginBottom"],

  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  pr: ["paddingRight"],
  px: ["paddingLeft", "paddingRight"],
  py: ["paddingTop", "paddingBottom"],
};

const NON_STYLE_KEYS = new Set(["onClick", "children", "className", "style", "img", "fwidth", "safeAreaTop"]);
const IGNORED_DOM_KEYS = new Set(["fwidth", "safeAreaTop", "img", "style"]);

const getImageStyle = ({ img, imgRootPath }: { img?: string; imgRootPath: string }) =>
  !img
    ? undefined
    : {
        backgroundImage: img.startsWith("http")
          ? `url(${img})`
          : `url(${[process.env.PUBLIC_URL, imgRootPath, img].filter((e) => !!e).join("/")})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      };

const Box: React.FC<BoxProps> = (props) => {
  const { ratio, imgRootPath } = useGlobalContext();
  const newProps = useMemo(
    () => ({
      style: {
        ...Object.fromEntries(
          Object.entries(props)
            .filter(([k]) => !NON_STYLE_KEYS.has(k) && k !== "style")
            .flatMap(([k, v]) => {
              if (SPACING_MAP[k]) return SPACING_MAP[k].map((cssKey) => [cssKey, v * ratio]);
              return [[k, v * ratio]];
            }),
        ),
        ...getImageStyle({ img: props.img, imgRootPath }),
        ...(props.safeAreaTop ? { top: `calc(var(--ot) + ${(props.top ?? 0) * ratio}px)` } : undefined),
        ...(props.fwidth ? { width: "var(--vw)" } : undefined),
        aspectRatio: props.aspectRatio,
        pointerEvents: props.onClick || !props.img ? "all" : ("none" as any),
        ...props.style,
      },
      ...Object.fromEntries(
        Object.entries(props)
          .filter(([k]) => NON_STYLE_KEYS.has(k) && !IGNORED_DOM_KEYS.has(k))
          .map(([k, v]) => [k, v]),
      ),
    }),
    [imgRootPath, props, ratio],
  );

  return <div {...newProps} />;
};
export default Box;
