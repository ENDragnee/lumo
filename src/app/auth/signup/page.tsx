import React from 'react'
import { Suspense } from 'react';
import Signup from '@/components/signup'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Signup/>
      </Suspense>
    </div>
  )
}

export default page