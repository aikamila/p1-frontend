import React from 'react'
import logo from './style/images/shangify_logo.png'
import brand_name from './style/images/shangify_brand_name.png'
import './style/Logo.css'

const Logo = () => {
  return (
    <>
        <img className="logo__img1" src={logo} alt="shangify brand logo"></img>
        <img className="logo__img2" src={brand_name} alt=""></img>
    </>
  )
}

export default Logo