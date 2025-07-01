import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router'

const HomePage = () => {
  return (
    <>
    <div className='flex flex-col items-center'>
        <h1 className='font-extrabold text-5xl mx-auto p-12'>Personalize your trips</h1>
        <Link to={'/create-trip'}>
            <Button>Create a trip</Button>
        </Link>
    </div>
    </>
  )
}

export default HomePage