"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

// Retro Box Button with press-down effect
export function RetroBoxButton({ children, onClick, className = "" }) {
    return (
        <RetroBoxWrapper className={className}>
            <motion.div
                className="box-button"
                onClick={onClick}
                whileTap={{ scale: 0.98 }}
            >
                <div className="button">
                    <span>{children}</span>
                </div>
            </motion.div>
        </RetroBoxWrapper>
    );
}

const RetroBoxWrapper = styled.div`
  .box-button {
    cursor: pointer;
    border: 3px solid #1a1a2e;
    background-color: #2a2a4a;
    padding-bottom: 8px;
    transition: 0.1s ease-in-out;
    user-select: none;
    border-radius: 8px;
  }

  .button {
    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    border: 3px solid #fff;
    padding: 12px 32px;
    border-radius: 4px;
  }

  .button span {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: #0f172a;
  }

  .box-button:active {
    padding-bottom: 0;
    transform: translateY(8px);
  }

  .box-button:hover .button {
    background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  }
`;

// Unique Masked Button with expanding fill effect
export function MaskedButton({ children, onClick, className = "" }) {
    return (
        <MaskedWrapper className={className}>
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span>{children}</span>
            </motion.button>
        </MaskedWrapper>
    );
}

const MaskedWrapper = styled.div`
  button {
    border: none;
    position: relative;
    width: 200px;
    height: 73px;
    padding: 0;
    z-index: 2;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='868' width='2500' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='868' width='2500' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    -webkit-mask-size: 100%;
    mask-size: 100%;
    cursor: pointer;
    background-color: #e2e8f0;
    transform: translateY(8px);
  }

  button:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0px 0 0 0 white;
    transition: all 0.5s ease;
  }

  button:hover:after {
    box-shadow: 0px -13px 56px 12px rgba(99, 102, 241, 0.6);
  }

  button span {
    position: absolute;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    left: 50%;
    top: 39%;
    letter-spacing: 3px;
    text-align: center;
    transform: translate(-50%, -50%);
    color: #0f172a;
    transition: all 0.5s ease;
    text-transform: uppercase;
  }

  button:hover span {
    color: white;
  }

  button:before {
    content: '';
    position: absolute;
    width: 0;
    height: 100%;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.5s ease;
  }

  button:hover:before {
    width: 100%;
  }
`;

// Clean minimal button with text reveal effect
export function TextRevealButton({ children, onClick, className = "" }) {
    return (
        <TextRevealWrapper className={className}>
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="text">{children}</span>
                <span className="hover-text">{children}</span>
            </motion.button>
        </TextRevealWrapper>
    );
}

const TextRevealWrapper = styled.div`
  button {
    position: relative;
    padding: 16px 40px;
    background: transparent;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  button:hover {
    border-color: #6366f1;
  }

  .text {
    position: relative;
    z-index: 2;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: #f8fafc;
    transition: all 0.3s ease;
  }

  .hover-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 100%);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: #6366f1;
    opacity: 0;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  button:hover .text {
    transform: translateY(-100%);
    opacity: 0;
  }

  button:hover .hover-text {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

// Glitch text effect button
export function GlitchButton({ children, onClick, className = "" }) {
    return (
        <GlitchWrapper className={className}>
            <motion.button
                onClick={onClick}
                whileTap={{ scale: 0.98 }}
            >
                <span className="text" data-text={children}>{children}</span>
            </motion.button>
        </GlitchWrapper>
    );
}

const GlitchWrapper = styled.div`
  button {
    position: relative;
    padding: 16px 40px;
    background: #0f172a;
    border: 2px solid #1e293b;
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  button:hover {
    border-color: #6366f1;
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
  }

  .text {
    position: relative;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #f8fafc;
    text-transform: uppercase;
  }

  button:hover .text {
    animation: glitch 0.3s infinite;
  }

  button:hover .text::before,
  button:hover .text::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  button:hover .text::before {
    color: #ff00ff;
    animation: glitch-1 0.2s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  }

  button:hover .text::after {
    color: #00ffff;
    animation: glitch-2 0.2s infinite;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  }

  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }

  @keyframes glitch-1 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-3px, 0); }
    40% { transform: translate(3px, 0); }
    60% { transform: translate(-3px, 0); }
    80% { transform: translate(3px, 0); }
  }

  @keyframes glitch-2 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(3px, 0); }
    40% { transform: translate(-3px, 0); }
    60% { transform: translate(3px, 0); }
    80% { transform: translate(-3px, 0); }
  }
`;


