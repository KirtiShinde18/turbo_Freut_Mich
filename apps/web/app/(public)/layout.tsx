"use client"
import React, { useEffect } from "react"
import PublicNavbar from "../_components/PublicNavbar"
import Footer from "../_components/Footer"

const Layout = ({ children }: { children: React.ReactNode }) => {


  return (
    <>
    <PublicNavbar/>
    {children}
    <Footer/>
    </>

  )
}

export default Layout