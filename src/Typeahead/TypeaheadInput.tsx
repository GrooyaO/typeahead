import React from 'react'
interface TypeaheadInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}
const TypeaheadInput: React.FC<TypeaheadInputProps> = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
}) => {
  return (
    <input
      onKeyDown={onKeyDown}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{flex: 1, border: 'none', outline: 'none'}}
    />
  )
}

export default TypeaheadInput
