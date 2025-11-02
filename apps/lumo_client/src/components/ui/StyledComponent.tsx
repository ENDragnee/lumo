import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  from {
    box-shadow: 0 0 5px var(--glow-light),
                0 0 10px var(--glow-light),
                0 0 15px var(--glow-main),
                0 0 20px var(--glow-main);
  }
  to {
    box-shadow: 0 0 10px var(--glow-light),
                0 0 20px var(--glow-light),
                0 0 30px var(--glow-main),
                0 0 40px var(--glow-main);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid currentColor;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite, ${glow} 2s ease-in-out infinite alternate;
`;

