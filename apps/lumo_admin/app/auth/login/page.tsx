"use-client"
import React from 'react'
import Login from '@/components/auth/Login'
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

const page = () => {

  return (
      <Suspense fallback={<Loader page='Login Page' />}>
        <Login/>
      </Suspense>
  )
}

export default page
