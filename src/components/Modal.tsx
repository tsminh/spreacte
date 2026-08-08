import React, { createContext, useContext, useState, ReactNode } from "react";
import styled from "styled-components";

type ModalItem = {
  id: string;
  content: ReactNode;
  state: "enter" | "exit" | "entering";
};

const BASE_Z_INDEX = 1000;

interface ModalContextValue {
  open: (content: ReactNode) => string;
  close: (id?: string) => void;
  closeAll: () => void;
  stack: ModalItem[];
}

const MaskWrapper = styled.div<{ $state: "enter" | "exit" }>`
  background: rgba(0, 0, 0, 0.7);
  width: var(--vw);
  height: var(--vh);
  position: fixed;
  top: 0;
  left: 0;

  transition: 0.5s ease all;
  opacity: ${({ $state }) => ($state === "enter" ? 1 : 0)};
  transition: opacity 200ms ease;
`;

const ContentWrapper = styled.div<{ $state: "enter" | "exit" }>`
  width: var(--vw);
  height: var(--vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;

  opacity: ${({ $state }) => ($state === "enter" ? 1 : 0)};
  transform: ${({ $state }) => ($state === "enter" ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)")};

  transition:
    transform 200ms ease,
    opacity 200ms ease;
`;

const ModalContext = createContext<ModalContextValue | null>(null);

const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};

export default useModal;

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ModalItem[]>([]);

  const open = (content: ReactNode) => {
    const id = crypto.randomUUID();

    setStack((s) => [...s, { id, content, state: "entering" }]);

    requestAnimationFrame(() => {
      setStack((s) => s.map((m) => (m.id === id ? { ...m, state: "enter" } : m)));
    });

    return id;
  };

  const close = (id?: string) => {
    setStack((s) => {
      const targetId = id ?? s[s.length - 1]?.id;
      if (!targetId) return s;

      return s.map((m) => (m.id === targetId ? { ...m, state: "exit" } : m));
    });

    setTimeout(() => {
      setStack((s) => s.filter((m) => m.state !== "exit"));
    }, 200);
  };

  const closeAll = () => {
    setStack((s) => s.map((m) => ({ ...m, state: "exit" })));
    setTimeout(() => setStack([]), 200);
  };

  return (
    <ModalContext.Provider value={{ open, close, closeAll, stack }}>
      {children}
      {stack.map((modal, index) => {
        const isTop = index === stack.length - 1;

        return (
          <>
            <MaskWrapper
              data-mask-modal-id={modal.id}
              $state={modal.state}
              style={{ zIndex: BASE_Z_INDEX + index * 2 - 1, pointerEvents: isTop ? "auto" : "none" }}
            />
            <ContentWrapper
              data-modal-id={modal.id}
              $state={modal.state}
              style={{ zIndex: BASE_Z_INDEX + index * 2, pointerEvents: isTop ? "auto" : "none" }}
            >
              {modal.content}
            </ContentWrapper>
          </>
        );
      })}
    </ModalContext.Provider>
  );
};
