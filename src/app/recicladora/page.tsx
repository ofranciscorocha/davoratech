'use client';
import Header from "@/components/recicladora/Header";
import HeroSection from "@/components/recicladora/HeroSection";
import AboutSection from "@/components/recicladora/AboutSection";
import ServicesSection from "@/components/recicladora/ServicesSection";
import FlowSection from "@/components/recicladora/FlowSection";
import CoverageSection from "@/components/recicladora/CoverageSection";
import CertificatesSection from "@/components/recicladora/CertificatesSection";
import PartnersSection from "@/components/recicladora/PartnersSection";
import ContactSection from "@/components/recicladora/ContactSection";
import Footer from "@/components/recicladora/Footer";
import './recicladora.css';

export default function RecicladoraPage() {
    return (
        <div id="recicladora-root" className="min-h-screen bg-white selection:bg-[#76b139] selection:text-white scroll-smooth">
            <Header />
            <main className="overflow-hidden">
                <HeroSection />
                <div className="relative">
                    <AboutSection />
                    <ServicesSection />
                    <FlowSection />
                    <CoverageSection />
                    <CertificatesSection />
                    <PartnersSection />
                    <ContactSection />
                </div>
            </main>
            <Footer />
        </div>
    );
}
