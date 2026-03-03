import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import MouseEffect from './components/MouseEffect';
import FloatingPixels from './components/FloatingPixels';
import GameHUD from './components/GameHUD';
import TurretDefense from './components/TurretDefense';

function App() {
  return (
    <div className="bg-background min-h-screen text-white selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Effects */}
      <FloatingPixels />
      <TurretDefense />
      <MouseEffect />

      {/* Arcade HUD */}
      <GameHUD />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </div>
    </div>
  );
}

export default App;
