import React from 'react'
import { Suspense } from 'react';
// import Signup from '@/components/signup'
import Signup from "@/components/auth/SignUp"
import Loader from '@/components/ui/loader';
const page = () => {
  return (
      <Suspense fallback={<Loader />}>
        <Signup/>
      </Suspense>
  )
}

export default page