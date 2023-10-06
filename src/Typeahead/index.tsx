import React, {useState, useEffect, useCallback, useRef} from 'react'
import {styled} from '@mui/system'
import debounce from 'lodash.debounce'
import {TypeaheadProps, Cache} from '../types'
import TypeaheadOption from './TypeaheadOption'
import TypeaheadSelectedItem from './TypeaheadSelectedItem'
import TypeaheadInput from './TypeaheadInput'
import TypeaheadDropdown from './TypeaheadDropdown'

const Wrapper = styled('div')({
  position: 'relative',
})

const CustomInput = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
})

const Typeahead = <T,>({
  multiple = false,
  placeholder = '',
  delay = 300,
  onSelectItem,
  onDeleteItem,
  onSearch,
  labelKey,
  isLoading = false,
  renderListItem,
}: TypeaheadProps<T>) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [cache, setCache] = useState<Cache>({})
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const optionRefs = useRef<(HTMLElement | null)[]>([])
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        return
      }
      if (cache[query]) {
        // Use cached data if available
        setSuggestions(cache[query])
      } else {
        try {
          const results: any[] = await onSearch(query)
          if (results === undefined) {
            console.error('No results retrieved')
            return
          }

          setCache(prevCache => ({...prevCache, [query]: results}))
          setSuggestions(results)
          setShowDropdown(results.length > 0 && query !== '')
        } catch (error) {
          console.error('Failed to search:', error)
        }
      }
    }, delay),
    [onSearch, delay],
  )
  const filteredOptions =
    suggestions?.length > 0
      ? suggestions.filter(
          option => !selectedOptions.includes(option[labelKey]),
        )
      : []

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleRemoveOption = (optionToRemove: any) => {
    const arr = selectedOptions.filter(option => {
      if (typeof option === 'string') {
        return option !== optionToRemove
      } else {
        return option[labelKey] !== optionToRemove[labelKey]
      }
    })
    setSelectedOptions(arr)
    if (onDeleteItem) onDeleteItem(arr)
  }

  const handleOptionClick = useCallback(
    (option: any) => {
      const value = option[labelKey]
      let nextSelectedOptions

      if (multiple) {
        nextSelectedOptions = [...selectedOptions, value]
      } else {
        nextSelectedOptions = [value]
        setInputValue('')
        setSuggestions([])
      }

      setSelectedOptions(nextSelectedOptions)
      if (onSelectItem) onSelectItem(nextSelectedOptions)
    },
    [multiple, labelKey, selectedOptions, onSelectItem],
  )

  useEffect(() => {
    handleSearch(inputValue)
  }, [inputValue, handleSearch])

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filteredOptions.length)
  }, [filteredOptions])

  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }, [activeIndex])

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prevActiveIndex =>
        prevActiveIndex === filteredOptions.length - 1
          ? filteredOptions.length - 1
          : prevActiveIndex + 1,
      )
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prevActiveIndex =>
        prevActiveIndex === 0 ? 0 : prevActiveIndex - 1,
      )
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault()
      handleOptionClick(filteredOptions[activeIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setShowDropdown(false)
    }
  }

  return (
    <Wrapper>
      <CustomInput>
        {selectedOptions.map((option, idx) => (
          <TypeaheadSelectedItem
            key={idx}
            name={option}
            removeSelectedOption={() => handleRemoveOption(option)}
          />
        ))}
        <TypeaheadInput
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
        />
      </CustomInput>
      {isLoading && <div>Loading...</div>}
      {inputValue.length > 0 && (
        <TypeaheadDropdown
          showDropdown={showDropdown}
          resultsFound={filteredOptions.length > 0}
        >
          {filteredOptions.map((option, index: number) => (
            <TypeaheadOption
              ref={element => (optionRefs.current[index] = element)}
              key={option.id ? option.id : index}
              onClick={() => handleOptionClick(option)}
              renderListItem={option => renderListItem(option)}
              option={option}
              isHighlighted={activeIndex === index}
            />
          ))}
        </TypeaheadDropdown>
      )}
    </Wrapper>
  )
}

export default Typeahead
