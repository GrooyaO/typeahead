import styled from '@emotion/styled'
import React, {ReactNode, MouseEventHandler} from 'react'

interface CustomListItemProps {
  children: ReactNode
  onClick: MouseEventHandler
}

const ListItem = styled('a')({
  display: 'block',
  width: '100%',
  height: '35px',
  padding: '10px 0',
  cursor: 'pointer',
  '&:hover': {
    background: '#f0f0f0',
  },
})

const CustomListItem: React.FunctionComponent<CustomListItemProps> = ({
  children,
  onClick,
}) => <ListItem onClick={onClick}>{children}</ListItem>

export default CustomListItem
