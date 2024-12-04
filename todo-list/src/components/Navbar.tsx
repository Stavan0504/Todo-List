import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button';


const Navbar = () => {

  const handleSignOut = () => {
    signOut({ callbackUrl: "/signin" }); // Replace '/your-desired-path' with your actual page
  };
  
  const { data: session } = useSession()

  if (!session)
    return null;

  return (
    <nav className='flex justify-around p-4'>
      <span className='text-3xl font-bold'>Todo List</span>
      <ul className='flex gap-4'>
        <li>
          <div className='flex flex-col'>
            <p className='text-sm'>{session?.user?.name}</p>
            <p className='text-sm'>{session?.user?.email}</p>
          </div>
        </li>
        <li>
          <Button onClick={handleSignOut}>Logout</Button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
