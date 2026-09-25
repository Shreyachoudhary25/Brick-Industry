import React from 'react';
import Hero from '../components/Hero';
import AboutIntro from '../components/AboutIntro';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import ProductionProcess from '../components/ProductionProcess';
import HomeGalleryCta from '../components/HomeGalleryCta';

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <AboutIntro />
      <FeaturedProducts />
      <WhyChooseUs />
      <ProductionProcess />
      <HomeGalleryCta />
    </div>
  );
}
