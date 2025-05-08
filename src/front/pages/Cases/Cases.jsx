import React from "react";
import Slider from "react-slick";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Cases.css";

import Fact1 from "../../assets/img/Cases/Fact4.jpg";
import Fact2 from "../../assets/img/Cases/Fact2.jpg";
import Fact3 from "../../assets/img/Cases/Fact6.jpg";

const slides = [
  {
    image: Fact1,
    alt: "Viñedos en La Rioja",
    highlight: "VIÑEDOS DE LA RIOJA",
    subtext: "Detección temprana de hongos, reduciendo pérdidas en un 20%.",
  },
  {
    image: Fact2,
    alt: "Olivos en Castilla-La Mancha",
    highlight: "OLIVOS EN CASTILLA-LA MANCHA",
    subtext: "Ahorro de agua del 25% y reducción de costos energéticos.",
  },
  {
    image: Fact3,
    alt: "Cultivos de tomate en Murcia",
    highlight: "TOMATES EN MURCIA",
    subtext: "Reducción del uso de pesticidas en un 30% y ahorro de 5.000€/ha.",
  },
];

const Cases = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="cases-page-background">
      <Navbar />
      <section className="cases-wrapper">
        <div className="carousel-container">
          <Slider {...settings}>
            {slides.map((slide, idx) => (
              <div key={idx} className="carousel-slide">
                <img src={slide.image} alt={slide.alt} className="carousel-image" />
                <div className="carousel-overlay" />
                <div className="text-content">
                  <h2 className="highlight">{slide.highlight}</h2>
                  <p className="subtext">{slide.subtext}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cases;
