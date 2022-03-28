import React, { useContext, useRef } from 'react'
import StartHeader from '../components/StartHeader'
import AuthContext from '../context/AuthContext'
import './style/StartPage.css'
import "animate.css/animate.min.css";
import { AnimationOnScroll } from 'react-animation-on-scroll';
import the_best_vid from './style/images/the_best_vid.mp4'
import Footer from '../components/Footer'


const StartPage = () => {
    let {unexpectedLogoutError} = useContext(AuthContext)
    const seeHowItWorks = useRef();
    const executeScroll = () => {
        seeHowItWorks.current.scrollIntoView()
    }
    return (
        <>
            <StartHeader />
            {unexpectedLogoutError && <p className="start-page__logout_err">{unexpectedLogoutError}</p>}
            <main className='start-page'>
                <div className='start-page__beginning'>
                    <div className='start-page__title'>
                        <h1>Looking for a coding buddy?</h1>
                        <h2>You're in the right place.</h2>
                        <button onClick={executeScroll}>See how it works</button>
                    </div>
                    <div className='start-page__video'>
                        <video width="320" height="480" autoPlay muted loop>
                            <source src={the_best_vid}></source>
                            This video is incompatible with your browser.
                        </video>
                    </div>
                </div>
                <div className='start-page__sections' ref={seeHowItWorks}>
                    <AnimationOnScroll duration={2}
                    animateIn="animate__fadeInRight" animateOut='animate__fadeOutRight'>
                        <section className='start-page__section --first'>
                            <h3>How does it work?</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porttitor 
                                turpis non felis pellentesque mattis. Vivamus pellentesque, ipsum vel 
                                pharetra tempus, neque purus hendrerit mi, vel ornare ligula risus non nibh. 
                                Duis fermentum, velit at venenatis pellentesque, libero massa porttitor dolor, 
                                et venenatis quam turpis ut elit. Maecenas dignissim, risus vitae lacinia lacinia, 
                                diam purus porttitor orci, vitae posuere diam leo eget nulla. Curabitur laoreet 
                                blandit libero, sit amet semper lorem condimentum sed. Aenean efficitur 
                                tristique justo et suscipit. Pellentesque posuere eros eu urna elementum 
                                sodales. Pellentesque laoreet volutpat nisl, at dictum diam malesuada ac. Pellentesque 
                                suscipit viverra mattis. Ut vitae tortor consequat, faucibus velit sed, hendrerit tellus. 
                                Praesent id diam malesuada, viverra neque tempor, suscipit lacus. Fusce tempus convallis 
                                tellus ac vulputate. In sit amet faucibus est. Vestibulum lacinia a arcu vitae congue.</p>
                        </section>
                    </AnimationOnScroll>
                    <AnimationOnScroll duration={2}
                    animateIn="animate__fadeInLeft" animateOut='animate__fadeOutLeft'>
                        <section className='start-page__section --second'>
                            <h3>Can I find my buddy even if I don't have too many skills?</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porttitor 
                                turpis non felis pellentesque mattis. Vivamus pellentesque, ipsum vel 
                                pharetra tempus, neque purus hendrerit mi, vel ornare ligula risus non nibh. 
                                Duis fermentum, velit at venenatis pellentesque, libero massa porttitor dolor, et venenatis quam 
                                turpis ut elit. Maecenas dignissim, risus vitae lacinia lacinia, diam purus porttitor orci, vitae posuere 
                                diam leo eget nulla. Curabitur laoreet blandit libero, sit amet semper lorem condimentum sed. Aenean efficitur 
                                tristique justo et suscipit. Pellentesque posuere eros eu urna elementum sodales. Pellentesque laoreet volutpat nisl, 
                                at dictum diam malesuada ac. Pellentesque suscipit viverra mattis. Ut vitae tortor consequat, faucibus velit sed, hendrerit 
                                tellus. Praesent id diam malesuada, viverra neque tempor, suscipit lacus. Fusce tempus convallis tellus ac vulputate. In sit 
                                amet faucibus est. Vestibulum lacinia a arcu vitae congue.</p>
                        </section>
                    </AnimationOnScroll>
                </div>
            </main>
            <Footer/>
        </>
    )
}

export default StartPage
