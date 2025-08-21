import React, { useState, useEffect } from 'react';
import VirtualKeyboard from './VirtualKeyboard';
import './Input.css';

const Input = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  showVirtualKeyboard = false,
  keyboardType = 'text',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (showVirtualKeyboard) {
      e.target.blur(); // Prevent native keyboard
      setShowKeyboard(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    if (onChange) onChange(e);
  };

  const handleVirtualKeyPress = (key) => {
    if (key === '\b') {
      // Backspace
      const newValue = value.slice(0, -1);
      if (onChange) {
        const event = { target: { value: newValue } };
        onChange(event);
      }
    } else if (key === '\n') {
      // Enter - close keyboard
      setShowKeyboard(false);
    } else {
      // Regular key
      const newValue = (value || '') + key;
      if (onChange) {
        const event = { target: { value: newValue } };
        onChange(event);
      }
    }
  };

  const handleKeyboardClose = () => {
    setShowKeyboard(false);
    setIsFocused(false);
  };

  const inputClasses = [
    'input-field',
    error && 'input-field--error',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'input-label',
    (isFocused || hasValue) && 'input-label--float',
    error && 'input-label--error'
  ].filter(Boolean).join(' ');

  return (
    <>
      <div className="input-wrapper">
        <div className="input-container">
          <input
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={inputClasses}
            placeholder={isFocused ? placeholder : ''}
            required={required}
            readOnly={showVirtualKeyboard}
            {...props}
          />
          {label && (
            <label className={labelClasses}>
              {label}{required && ' *'}
            </label>
          )}
          {showVirtualKeyboard && (
            <div className="virtual-keyboard-trigger">
              <img 
                src="/assets/Key-Board.svg" 
                alt="Virtual Keyboard" 
                className="keyboard-icon"
              />
            </div>
          )}
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
      
      {showVirtualKeyboard && (
        <VirtualKeyboard
          isVisible={showKeyboard}
          onKeyPress={handleVirtualKeyPress}
          onClose={handleKeyboardClose}
          keyboardType={keyboardType}
        />
      )}
    </>
  );
};

export default Input;