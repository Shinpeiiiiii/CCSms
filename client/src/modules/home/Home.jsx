import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavHeader from './components/NavHeader'
import Footer from '../home/components/Footer'
import Hero from '../home/components/Hero'
import About from './components/About'
import Program from '../home/components/Program'
import Enrollment from './components/Enrollment'


const Home = () => {
    const location = useLocation()

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '')
            const element = document.getElementById(id)
            if (element) {
                // Short timeout to guarantee elements are rendered
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' })
                }, 150)
                return () => clearTimeout(timer)
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [location])

    return (
        <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
            <NavHeader />
            <Hero />
            <About />
            <Enrollment />
            <Program />
            <Footer />
        </div>
    )
}

export default Home
