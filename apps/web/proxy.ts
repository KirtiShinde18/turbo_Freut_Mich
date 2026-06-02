import { NextRequest, NextResponse } from 'next/server'
import React from 'react'

const proxy = (req: NextRequest) => {
    const { pathname } = req.nextUrl
  const token = req.cookies.get("ADMIN")?.value
  if(pathname.startsWith("/admin") && !token){
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export default proxy