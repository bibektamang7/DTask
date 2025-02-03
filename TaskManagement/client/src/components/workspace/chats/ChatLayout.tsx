import React from 'react'
import { Outlet } from 'react-router'

const ChatLayout = () => {
  return (
    <section className='w-full max-h-screen overflow-hidden'>
        <Outlet/>
    </section>
  )
}

export default ChatLayout