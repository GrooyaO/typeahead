import {styled} from '@mui/system'
import {ReactNode} from 'react'

type OptionType = Record<string | number, unknown>

interface TypeaheadOptionProps {
  option: OptionType
  renderListItem: (option: OptionType) => ReactNode
  onClick: (option: OptionType) => void
  isHighlighted: boolean
}
const CustomListItem = styled('a')({
  display: 'block',
  width: '100%',
  height: '35px',
  padding: '10px 0',
  cursor: 'pointer',
  '&:hover': {
    background: '#f0f0f0',
  },
})

const TypeaheadOption: React.FC<TypeaheadOptionProps> = ({
  option,
  renderListItem,
  onClick,
  isHighlighted,
}) => {
  return (
    <CustomListItem
      style={isHighlighted ? {backgroundColor: '#eee'} : {}}
      onClick={() => onClick(option)}
    >
      {renderListItem(option)}
    </CustomListItem>
  )
}

export default TypeaheadOption
