import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavHeader from './components/NavHeader'
import Footer from '../home/components/Footer'
import Hero from '../home/components/Hero'
import About from './components/About'
import FeatureShowcase from '../auth/components/FeatureShowcase'
import Enrollment from './components/Enrollment'
import Program from '../home/components/Program'


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
            <FeatureShowcase />
            <Enrollment />
            <Program />
            <Footer />
        </div>
    )
}

export default Home

