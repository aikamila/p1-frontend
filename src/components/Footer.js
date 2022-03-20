import React from 'react'
import "./style/Footer.css"

const Footer = () => {
  const date = new Date()
  return (
    <footer role="contentinfo" className='footer__background'>
        <div className='footer__container'>
            <span>&copy;Copyright {date.getFullYear()}</span>
        </div>
    </footer>
  )
}

export default Footer