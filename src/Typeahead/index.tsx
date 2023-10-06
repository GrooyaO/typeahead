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
  // Declare state variables and their setter functions
  const [inputValue, setInputValue] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [cache, setCache] = useState<Cache>({})
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showDropdown, setShowDropdown] = React.useState(false)
  // Reference to currently selected option
  const optionRefs = useRef<(HTMLElement | null)[]>([])
  // Perform search when input changes, using debounce to limit frequency
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      // Return if there's no query
      if (!query) {
        return
      }
      if (cache[query]) {
        // Use cached data if available
        setSuggestions(cache[query])
      } else {
        try {
          // Perform the search
          const results: any[] = await onSearch(query)
          if (results === undefined) {
            console.error('No results retrieved')
            return
          }
          // Update cache and suggestions
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
  // Filter out already selected options from suggestions
  const filteredOptions =
    suggestions?.length > 0
      ? suggestions.filter(
          option => !selectedOptions.includes(option[labelKey]),
        )
      : []
  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }
  // Remove an option from selection
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
  // Handle option selection
  const handleOptionClick = useCallback(
    (option: any) => {
      const value = option[labelKey]
      let nextSelectedOptions
      // Add/replace selected options
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
  // Perform search each time input value changes
  useEffect(() => {
    handleSearch(inputValue)
  }, [inputValue, handleSearch])
  // Update references list when options change
  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filteredOptions.length)
  }, [filteredOptions])
  // Scroll into view when active index changes
  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }, [activeIndex])
  // Handle keyboard events on the input
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
