"use client"
import React from 'react'
import { signOut } from 'next-auth/react';
const HomeCloudPage = () => {
  return (
    <div>
      HomeCloudPage
      <button onClick={() => signOut({callbackUrl:"/auth"})}>logout</button>
    </div>
  )
}

export default HomeCloudPage;
