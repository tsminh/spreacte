import styled from "styled-components";

export const HeaderSection = styled.div`
  border-top: 2px solid #094bae;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  font-weight: 500;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #20202012;
  }
}
`;

export const Button = styled.button`
  border: none;
  background: white;
  padding: 4px 8px;
  height: 24px;
  border-radius: 8px;
`;
