import React from 'react'
import Login from '@/components/auth/Login'
import { Suspense } from 'react';


const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Login/>
      </Suspense>
    </div>
  )
}

export default page
