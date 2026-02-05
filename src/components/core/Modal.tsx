import { ReactNode, useEffect, useMemo } from "react";
import { disablePageScroll, enablePageScroll } from "@fluejs/noscroll";
import styled, { css } from "styled-components";

interface IModal {
  open?: boolean;
  onClose?: () => void;
}

const MaskWrapper = styled.div<{ $open?: boolean }>`
  background: rgba(0, 0, 0, 0.7);
  width: var(--vw);
  height: var(--vh);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  transition: 0.5s ease all;
  ${({ $open }) => css`
    opacity: ${!$open ? 0 : 1};
    pointer-events: ${$open ? "all" : "none"};
  `}
`;

const ContentWrapper = styled.div<{ $open?: boolean }>`
  width: var(--vw);
  height: var(--vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: 0.2s ease all;
  ${({ $open }) => css`
    opacity: ${!$open ? 0 : 1};
    pointer-events: ${$open ? "all" : "none"};
    transform: translateY(${$open ? 0 : 20}px) scale(${$open ? 1 : 0.9});
  `}
`;

const Modal: React.FC<IModal & { children?: ReactNode }> = ({ open, children }) => {
  const mid = useMemo(() => Math.floor(Math.random() * 1000), []);
  useEffect(() => {
    if (open) disablePageScroll();
    else enablePageScroll();
  }, [open]);

  return (
    <>
      <MaskWrapper data-mid={mid} $open={open} />
      <ContentWrapper data-mid={mid} $open={open}>
        {children}
      </ContentWrapper>
    </>
  );
};

export default Modal;
