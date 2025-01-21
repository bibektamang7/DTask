import React from 'react'

interface WorkspaceAuthProps {
    children: React.ReactNode,
}

export const WorkspaceAuth = ({children}: WorkspaceAuthProps) => {
  return (
      <div>
          {children}
    </div>
  )
}
