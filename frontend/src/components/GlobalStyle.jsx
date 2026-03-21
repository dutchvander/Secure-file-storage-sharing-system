// src/components/GlobalStyle.jsx
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: #f2f2f2;
  }

  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .auth-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    width: 360px;
  }

  .btn-submit {
    width: 100%;
    padding: 0.8rem;
    margin-top: 1rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .field {
    margin-bottom: 1rem;
  }

  .field-error {
    color: red;
    font-size: 0.8rem;
  }
`;