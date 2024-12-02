import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button';
import { useRouter } from "next/navigation"
import { ModeToggle } from './ui/modetoggle';

const Navbar = () => {
  const { data: session } = useSession()
  const Router = useRouter()
  
  if (!session) 
    return null;

  return (
      <nav className='flex justify-around p-4'>
          <span className='text-3xl font-bold'>Todo List</span>
          <ul className='flex gap-4'>
            <li>
              <div className='flex flex-col'>
                <p className='text-sm'>{session?.user?.name }</p>
                <p className='text-sm'>{session?.user?.email}</p>
              </div>
            </li>
            <li>
              <Button onClick={() => {
                signOut()
                Router.push('/signin') 
              }}>Logout</Button>
            </li>
          </ul>
      </nav>   
  )
}

export default Navbar
