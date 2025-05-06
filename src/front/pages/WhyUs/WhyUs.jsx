import React from "react";
import Slider from "react-slick";
import "./WhyUs.css";

import img1 from "../../assets/img/carrucel/foto1.jpg";
import img2 from "../../assets/img/carrucel/foto2.jpg";



const slides = [
  {
    image: img1,
    alt: "Monitoreo NDVI",
    caption: "Detectá el vigor de tus cultivos y anticipá problemas a tiempo.",
  },
  {
    image: img2,
    alt: "Fertilización por zonas",
    caption: "Aplicación variable de fertilizantes para ahorrar insumos.",
  },
  {
    image: img1,
    alt: "Detección de estrés hídrico",
    caption: "Localizá zonas con falta de riego antes de que afecte tu producción.",
  },
  {
    image: img2,
    alt: "Análisis de rendimiento zonal",
    caption: "Maximizá tu cosecha con información precisa por sector.",
  },
];

const WhyUs = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <section className="landing-container">
      <h2 className="carousel-title">¿Por qué DronFarm?</h2>
      <div className="carousel-wrapper">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <div key={idx} className="carousel-slide">
              <img src={slide.image} alt={slide.alt} className="carousel-image" />
              <div className="carousel-caption">{slide.caption}</div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default WhyUs;
