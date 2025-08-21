import React, { useState } from 'react';
import './VirtualKeyboard.css';

const VirtualKeyboard = ({ isVisible, onKeyPress, onClose, keyboardType = 'text' }) => {
  const [isShift, setIsShift] = useState(false);
  const [isCapsLock, setCapsLock] = useState(false);

  const textKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['123', 'space', '.', 'enter']
  ];

  const numericKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['ABC', '0', 'backspace']
  ];

  const symbolKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['#+=', '.', ',', '?', '!', "'", 'backspace'],
    ['ABC', 'space', '.', 'enter']
  ];

  const [currentLayout, setCurrentLayout] = useState(
    keyboardType === 'numeric' ? 'numeric' : 'text'
  );

  if (!isVisible) return null;

  const getKeys = () => {
    switch (currentLayout) {
      case 'numeric':
        return numericKeys;
      case 'symbols':
        return symbolKeys;
      default:
        return textKeys;
    }
  };

  const handleKeyPress = (key) => {
    if (key === 'shift') {
      setIsShift(!isShift);
    } else if (key === 'caps') {
      setCapsLock(!isCapsLock);
    } else if (key === '123') {
      setCurrentLayout('symbols');
    } else if (key === '#+=') {
      setCurrentLayout('symbols');
    } else if (key === 'ABC') {
      setCurrentLayout('text');
    } else if (key === 'backspace') {
      onKeyPress('\b');
    } else if (key === 'space') {
      onKeyPress(' ');
    } else if (key === 'enter') {
      onKeyPress('\n');
    } else {
      const finalKey = (isShift || isCapsLock) && currentLayout === 'text' 
        ? key.toUpperCase() 
        : key;
      onKeyPress(finalKey);
      
      if (isShift && !isCapsLock) {
        setIsShift(false);
      }
    }
  };

  const getKeyClass = (key) => {
    let className = 'virtual-key';
    
    if (key === 'space') className += ' virtual-key--space';
    if (key === 'backspace') className += ' virtual-key--backspace';
    if (key === 'enter') className += ' virtual-key--enter';
    if (key === 'shift') className += ` virtual-key--shift ${isShift ? 'virtual-key--active' : ''}`;
    if (['123', 'ABC', '#+='].includes(key)) className += ' virtual-key--function';
    
    return className;
  };

  const getKeyDisplay = (key) => {
    switch (key) {
      case 'backspace':
        return '⌫';
      case 'space':
        return 'space';
      case 'enter':
        return '↵';
      case 'shift':
        return '⇧';
      default:
        return (isShift || isCapsLock) && currentLayout === 'text' 
          ? key.toUpperCase() 
          : key;
    }
  };

  return (
    <div className="virtual-keyboard-overlay">
      <div className="virtual-keyboard">
        <div className="virtual-keyboard__header">
          <button className="virtual-keyboard__close" onClick={onClose}>
            <img src="/assets/close-gery.svg" alt="Close" />
          </button>
        </div>
        
        <div className="virtual-keyboard__keys">
          {getKeys().map((row, rowIndex) => (
            <div key={rowIndex} className="virtual-keyboard__row">
              {row.map((key, keyIndex) => (
                <button
                  key={`${rowIndex}-${keyIndex}`}
                  className={getKeyClass(key)}
                  onClick={() => handleKeyPress(key)}
                >
                  {getKeyDisplay(key)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;