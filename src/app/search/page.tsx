import React from 'react'
import SearchPage from "@/components/mainPage/SearchPage"
import { Suspense } from 'react';


const page = () => {
  return (
    <div>
      <Suspense>
        <SearchPage />
      </Suspense>
    </div>
  )
}

export default page