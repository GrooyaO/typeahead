import React, {useState, useEffect, useCallback} from 'react'
import {styled} from '@mui/system'
import debounce from 'lodash.debounce'
import {TypeaheadProps, TypeaheadOption, Cache, Option} from '../types'
import CustomListItem from './CustomListItem'

const Wrapper = styled('div')({
  position: 'relative',
})

const CustomPaper = styled('div')({
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  position: 'absolute',
  zIndex: 1,
  width: '100%',
  maxHeight: '300px',
  overflow: 'auto',
})

const CustomList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
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

const CustomButton = styled('button')({
  background: '#f0f0f0',
  border: 'none',
  borderRadius: '4px',
  padding: '5px 10px',
  margin: '0 5px',
  cursor: 'pointer',
})

const Typeahead = <T,>({
  multiple = false,
  placeholder = '',
  delay = 300,
  onSearch,
  isLoading = false,
  renderListItem,
}: TypeaheadProps<T>) => {
  //input value
  const [inputValue, setInputValue] = useState('')
  //selected suggestions
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  //make suggestions m
  const [suggestions, setSuggestions] = useState<any[]>([])
  //cached suggestions... or query?
  const [cache, setCache] = useState<Cache>({})

  //do not rerun if value is same
  //debounce for 300ms
  //early quitting
  //caching
  const handleSearch = useCallback(
    debounce((query: string) => {
      if (!query) {
        return
      }
      if (cache[query]) {
        // Use cached data if available
        setSuggestions(cache[query])
      } else {
        onSearch(query).then((results: any[]) => {
          const newCache = {...cache, [query]: results}
          setCache(newCache)
          setSuggestions(results)
        })
      }
    }, delay),
    [onSearch, cache, delay],
  )
  //rerender when inputValue changes... possibility of using useRef for no rerender and then manually forcing rerenders
  useEffect(() => {
    handleSearch(inputValue)
  }, [inputValue])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleOptionClick = (option: TypeaheadOption) => {
    if (multiple) {
      setSelectedOptions([...selectedOptions, option.name])
    } else {
      setSelectedOptions([option.name])
      setInputValue('')
      setSuggestions([])
    }
  }
  //remove on option click
  const handleRemoveOption = (option: string) => {
    setSelectedOptions(selectedOptions.filter(o => o !== option))
  }
  //filter options based on
  const filteredOptions =
    suggestions.length > 0
      ? suggestions.filter(option => !selectedOptions.includes(option.name))
      : []

  return (
    <Wrapper>
      <CustomInput>
        {selectedOptions.map(option => (
          <CustomButton key={option} onClick={() => handleRemoveOption(option)}>
            {option} &times;
          </CustomButton>
        ))}
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{flex: 1, border: 'none', outline: 'none'}}
        />
      </CustomInput>
      {isLoading && <div>Loading...</div>}
      {inputValue.length > 0 ? (
        <CustomPaper>
          <CustomList>
            {filteredOptions.map((option: any, index: number) => (
              <CustomListItem
                key={index}
                onClick={() => handleOptionClick(option)}
              >
                {renderListItem(option)}
              </CustomListItem>
            ))}
          </CustomList>
        </CustomPaper>
      ) : (
        <p>No results....</p>
      )}
    </Wrapper>
  )
}

export default Typeahead
