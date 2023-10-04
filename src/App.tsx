import {useState} from 'react'
import {styled} from '@mui/system'
import Typeahead from './Typeahead'
import {Response, User} from './types'

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

function App() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string) => {
    setIsLoading(true)
    return fetch(
      `https://api.github.com/search/users?q=${query}+in:login&page=1&per_page=50`,
    )
      .then(resp => resp.json())
      .then((data: Response) => {
        setIsLoading(false)
        return data.items
      })
  }

  return (
    <AppContainer>
      <Typeahead
        multiple={true}
        placeholder="Type a github user name"
        isLoading={isLoading}
        onSearch={handleSearch}
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
    </AppContainer>
  )
}

export default App
