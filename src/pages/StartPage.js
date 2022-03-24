import React, { useContext, useRef } from 'react'
import StartHeader from '../components/StartHeader'
import AuthContext from '../context/AuthContext'
import './style/StartPage.css'
import "animate.css/animate.min.css";
import { AnimationOnScroll } from 'react-animation-on-scroll';
import the_best_vid from './style/images/the_best_vid.mp4'


const StartPage = () => {
    const seeHowItWorks = useRef();
    const executeScroll = () => {
        seeHowItWorks.current.scrollIntoView()

    }
    let {unexpectedLogoutError} = useContext(AuthContext)
    return (
        <>
        <StartHeader />
        {unexpectedLogoutError && <p>{unexpectedLogoutError}</p>}

        <main className='start-page'>
            <div className='start-page__beginning'>
            <video width="640" height="480" autoPlay muted loop>
                <source src={the_best_vid}></source>
                This video is incompatible with your browser.
            </video>
            <h1>You always wanted to change the world.</h1>
            <h2>We made it possible for YOU.</h2>
            <button onClick={executeScroll}>See how it works</button>
            </div>
            <div className='start-page__sections' ref={seeHowItWorks}>
            <AnimationOnScroll duration={2}
            animateIn="animate__bounceIn">
            <section className='start-page__section1'>
                <h3>What is this app really about?</h3>
                {/* use headers in the appropriate manner - accessibility */}
                <p>We believe that all people are capable of great things.
                    Most of them are too scared or too doubtful to realize their
                    plans. It doesn't matter whether you would like to start 
                    a charity organization or maybe set up your own company - we
                    know that we are all sstronger together. We give you an amazing
                    opportunity to put your dreams into action with <nobr>like-minded</nobr>, 
                     <nobr>goal-oriented</nobr> people.
                </p>
            </section>
            </AnimationOnScroll>
            <AnimationOnScroll duration={2}
            animateIn="animate__bounceIn">
            <section className='start-page__section2'>
                <h3>How can I start?</h3>
                <p>Sign up, verify your email and start - it's as simple as that!
                    You can share your ideas publically or take a look at
                    other people's posts - you can either comment or simply look
                    for inspiration. Unleash your potential!</p>
            </section>
            </AnimationOnScroll>
            </div>
        </main>
        </>
    )
}

export default StartPage
