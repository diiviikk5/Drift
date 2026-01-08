"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";

export function RetroToggle({ checked, onChange }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <StyledWrapper>
            <label className="switch">
                <input
                    className="cb"
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span className="toggle">
                    <span className="left">off</span>
                    <span className="right">on</span>
                </span>
            </label>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    font-size: 14px;
    position: relative;
    display: inline-block;
    width: 4.5em;
    height: 2.2em;
    user-select: none;
  }

  /* Hide default HTML checkbox */
  .switch .cb {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .toggle {
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: #1e293b;
    border-radius: 0.15em;
    transition: 0.4s;
    text-transform: uppercase;
    font-weight: 700;
    overflow: hidden;
    box-shadow: -0.25em 0 0 0 #1e293b, -0.25em 0.25em 0 0 #1e293b,
      0.25em 0 0 0 #1e293b, 0.25em 0.25em 0 0 #1e293b, 0 0.25em 0 0 #1e293b;
  }

  .toggle > .left {
    position: absolute;
    display: flex;
    width: 50%;
    height: 88%;
    background-color: #f8fafc;
    color: #1e293b;
    left: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    transform-origin: right;
    transform: rotateX(10deg);
    transform-style: preserve-3d;
    transition: all 150ms;
    font-size: 0.65em;
  }

  .left::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #cbd5e1;
    transform-origin: center left;
    transform: rotateY(90deg);
  }

  .left::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #64748b;
    transform-origin: center bottom;
    transform: rotateX(90deg);
  }

  .toggle > .right {
    position: absolute;
    display: flex;
    width: 50%;
    height: 88%;
    background-color: #f8fafc;
    color: #94a3b8;
    right: 1px;
    bottom: 0;
    align-items: center;
    justify-content: center;
    transform-origin: left;
    transform: rotateX(10deg) rotateY(-45deg);
    transform-style: preserve-3d;
    transition: all 150ms;
    font-size: 0.65em;
  }

  .right::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #cbd5e1;
    transform-origin: center right;
    transform: rotateY(-90deg);
  }

  .right::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #64748b;
    transform-origin: center bottom;
    transform: rotateX(90deg);
  }

  .switch input:checked + .toggle > .left {
    transform: rotateX(10deg) rotateY(45deg);
    color: #94a3b8;
  }

  .switch input:checked + .toggle > .right {
    transform: rotateX(10deg) rotateY(0deg);
    color: #6366f1;
  }
`;

// Alternative theme toggle with sun/moon icons in retro style
export function RetroThemeToggle({ isDark, onToggle }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ThemeToggleWrapper>
            <label className="switch">
                <input
                    className="cb"
                    type="checkbox"
                    checked={isDark}
                    onChange={onToggle}
                />
                <span className="toggle">
                    <span className="left">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    </span>
                    <span className="right">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </span>
                </span>
            </label>
        </ThemeToggleWrapper>
    );
}

const ThemeToggleWrapper = styled.div`
  .switch {
    font-size: 14px;
    position: relative;
    display: inline-block;
    width: 4.5em;
    height: 2.2em;
    user-select: none;
  }

  .switch .cb {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle {
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: #1e293b;
    border-radius: 0.15em;
    transition: 0.4s;
    overflow: hidden;
    box-shadow: -0.25em 0 0 0 #1e293b, -0.25em 0.25em 0 0 #1e293b,
      0.25em 0 0 0 #1e293b, 0.25em 0.25em 0 0 #1e293b, 0 0.25em 0 0 #1e293b;
  }

  .icon {
    width: 14px;
    height: 14px;
  }

  .toggle > .left {
    position: absolute;
    display: flex;
    width: 50%;
    height: 88%;
    background-color: #fef3c7;
    color: #f59e0b;
    left: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    transform-origin: right;
    transform: rotateX(10deg);
    transform-style: preserve-3d;
    transition: all 150ms;
  }

  .left::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #fde68a;
    transform-origin: center left;
    transform: rotateY(90deg);
  }

  .left::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #d97706;
    transform-origin: center bottom;
    transform: rotateX(90deg);
  }

  .toggle > .right {
    position: absolute;
    display: flex;
    width: 50%;
    height: 88%;
    background-color: #312e81;
    color: #a5b4fc;
    right: 1px;
    bottom: 0;
    align-items: center;
    justify-content: center;
    transform-origin: left;
    transform: rotateX(10deg) rotateY(-45deg);
    transform-style: preserve-3d;
    transition: all 150ms;
  }

  .right::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #4338ca;
    transform-origin: center right;
    transform: rotateY(-90deg);
  }

  .right::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #1e1b4b;
    transform-origin: center bottom;
    transform: rotateX(90deg);
  }

  .switch input:checked + .toggle > .left {
    transform: rotateX(10deg) rotateY(45deg);
  }

  .switch input:checked + .toggle > .right {
    transform: rotateX(10deg) rotateY(0deg);
  }
`;
