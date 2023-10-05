import {styled} from '@mui/system'

interface TypeaheadSelectedItemProps {
  name: string
  removeSelectedOption: (option: string) => void
}

const CustomButton = styled('button')({
  display: 'flex',
  background: '#f0f0f0',
  border: 'none',
  borderRadius: '4px',
  padding: '5px 10px',
  margin: '0 5px',
  cursor: 'pointer',
})

const TypeaheadSelectedItem: React.FC<TypeaheadSelectedItemProps> = ({
  name,
  removeSelectedOption,
}) => {
  return (
    <CustomButton onClick={() => removeSelectedOption(name)}>
      <span>{name}</span>
      <span>&times;</span>
    </CustomButton>
  )
}

export default TypeaheadSelectedItem
