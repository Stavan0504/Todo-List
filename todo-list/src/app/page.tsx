"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  const { data: session } = useSession()
  if (!session) 
    return null;

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-4 w-2/4'>
        <Input placeholder=" Enter your Todo" />
        <Textarea placeholder="Enter the description" />
        <Button className='self-start'>Submit</Button>
      </div>
         
    </div>
  )
}

export default HomePage
