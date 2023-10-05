import {styled} from '@mui/system'
import React from 'react'

interface TypeaheadDropdownProps {
  showDropdown: boolean
  children: React.ReactNode
  resultsFound: boolean
}
const CustomList = styled('div')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
})

const CustomPaper = styled('div')({
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  position: 'absolute',
  zIndex: 1,
  backgroundColor: '#fff',
  width: '100%',
  maxHeight: '300px',
  overflow: 'auto',
})
const TypeaheadDropdown: React.FC<TypeaheadDropdownProps> = ({
  showDropdown,
  children,
  resultsFound,
}) => {
  return showDropdown ? (
    <CustomPaper>
      <CustomList>{resultsFound ? children : <p>No results</p>}</CustomList>
    </CustomPaper>
  ) : null
}

export default TypeaheadDropdown
