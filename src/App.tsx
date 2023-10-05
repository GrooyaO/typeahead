import {useState, useCallback} from 'react'
import {styled} from '@mui/system'
import Typeahead from './Typeahead'

const AppContainer = styled('div')`
  justify-content: center;
  height: 100vh;
  @media (min-width: 768px) {
    max-width: 768px;
    margin: 0 auto;
  }
  @media (min-width: 992px) {
    max-width: 992px;
  }
  @media (min-width: 1200px) {
    max-width: 1200px;
  }
`
const StyledButton = styled('button')`
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`

const UserList = styled('ul')`
  list-style-type: none;
  padding: 0;
  margin: 0;
  li {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  img {
    vertical-align: middle;
    height: 35px;
    margin-right: 10px;
    width: 35px;
  }
`

type User = {
  avatar_url: string
  login: string
  id: number
}
interface Response {
  items: User[]
}

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<User[]>([])
  const [error, setError] = useState<null | string>(null)

  const handleSelect = (selectedOptions: User[]) => {
    setSelectedOptions(selectedOptions)
  }

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}+in:login&page=1&per_page=50`,
      )
      const data: Response = await response.json()
      setIsLoading(false)
      return data.items
    } catch (error) {
      setIsLoading(false)
      setError('Failed to fetch users')
      return []
    }
  }
  const fetchUsers = async (selectedOptions: any[]) => {
    setError(null)
    try {
      const promises = selectedOptions.map((option: string) =>
        fetch(`https://api.github.com/users/${option}`).then(res => res.json()),
      )
      let users = await Promise.all(promises)
      users = users.map((user: any) => ({
        avatar_url: user.avatar_url,
        login: user.login,
        id: user.id,
      }))
      setSelectedOptions(users)
    } catch (error) {
      setError('Failed to fetch users')
    }
  }

  return (
    <AppContainer>
      <Typeahead
        labelKey="login"
        multiple={true}
        placeholder="Type a github user name"
        isLoading={isLoading}
        onSearch={handleSearch}
        onSelect={handleSelect}
        renderListItem={(option: any) => (
          <>
            <img
              alt={option.login}
              src={option.avatar_url}
              style={{
                verticalAlign: 'middle',
                height: '35px',
                marginRight: '10px',
                width: '35px',
              }}
            />
            <span>{option.login}</span>
          </>
        )}
      />
      {error && <p>{error}</p>}
      <StyledButton onClick={() => fetchUsers(selectedOptions)}>
        Fetch Users
      </StyledButton>
      <UserList>
        {selectedOptions.length > 0 &&
          selectedOptions.map((user: User) => (
            <li key={user.id}>
              <img src={user.avatar_url} alt={user.login} />
              <h2>{user.login}</h2>
            </li>
          ))}
      </UserList>
    </AppContainer>
  )
}

export default App
