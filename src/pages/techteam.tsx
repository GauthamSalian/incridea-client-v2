import { motion } from 'framer-motion'
import Slideshow from '../components/slideshow/slideshow'

export default function TechTeamPage() {
  const teamImages = [
    '/temp_event_bg.png',
    '/temp_event_bg.png',
    '/temp_event_bg.png',
  ];

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');`}
      </style>
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/temp_event_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <section className="flex flex-col items-center w-full py-12 px-4">
        <Slideshow 
          images={teamImages} 
          autoplayDelay={4000}
        />
        
        {/* Animated Title - Fade Up */}
        <motion.h1 
          className="font-['Michroma'] text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mt-12 text-white tracking-wider"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            delay: 0.5 
          }}
        >
          TECH TEAM
        </motion.h1>
      </section>
    </>
  )
}
