// app/page.tsx
import { AboutSection } from "./components/about/AboutSection";
import { ContactSection } from "./components/contact/contact";
import { Footer } from "./components/footer/footer";
import { HeroSection } from "./components/home/home";
import { NavBar } from "./components/navbar/navbar";

export default function Home() {
  return (
    // Use a light background to complement the white navbar
    <main className="min-h-[200vh] bg-gray-50">
      <NavBar />     
      <HeroSection/>
      <AboutSection/>      
      <ContactSection/>
      <Footer/>
    </main>
  );
}