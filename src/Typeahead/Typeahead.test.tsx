import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import Typeahead from '../Typeahead'
import {TypeaheadProps} from '../types'

describe('Typeahead', () => {
  let mockTypeaheadProps: TypeaheadProps<any>

  beforeEach(() => {
    mockTypeaheadProps = {
      onSelectItem: jest.fn(),
      onDeleteItem: jest.fn(),
      labelKey: 'key',
      multiple: false,
      placeholder: 'Search...',
      delay: 300,
      onSearch: jest.fn(() => new Promise(res => res([]))),
      isLoading: false,
      renderListItem: jest.fn(),
    }
  })

  test('renders without crashing', () => {
    const {container} = render(<Typeahead {...mockTypeaheadProps} />)
    expect(container).toBeInTheDocument()
  })

  test('handles input change', () => {
    render(<Typeahead {...mockTypeaheadProps} />)
    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, {target: {value: 'test'}})
    expect(input).toHaveValue('test')
  })

  test('executes onSearch when input changes', async () => {
    render(<Typeahead {...mockTypeaheadProps} />)
    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, {target: {value: 'test'}})
    await waitFor(() => expect(mockTypeaheadProps.onSearch).toHaveBeenCalled())
  })
})
