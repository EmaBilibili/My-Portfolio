import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import MouseEffect from './components/MouseEffect';
import DualWorldOverlay from './components/DualWorldOverlay';
import CyberGrid from './components/CyberGrid';
import TurretDefense from './components/TurretDefense';

function App() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Interactive Background Effects */}
      <DualWorldOverlay />
      <CyberGrid />
      <MouseEffect />

      {/* Turret Defense System */}
      <TurretDefense />

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

