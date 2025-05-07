import React from "react";
import Slider from "react-slick";
import "./WhyUs.css";

import img1 from "../../assets/img/carrucel/why5.jpeg";
import img2 from "../../assets/img/carrucel/why2.jpeg";
import img3 from "../../assets/img/carrucel/why3.jpeg";
import img4 from "../../assets/img/carrucel/why4.jpeg";

const slides = [
  { image: img1, alt: "Pérdida de cosechas", highlight: "PÉRDIDA DEL 30%", subtext: "cosechas sin diagnóstico temprano" },
  { image: img2, alt: "Pérdidas económicas", highlight: "34.500 MILLONES €", subtext: "en pérdidas anuales" },
  { image: img3, alt: "Recursos naturales", highlight: "RECURSOS DESPERDICIADOS", subtext: "agua + fertilizantes + pesticidas" },
  { image: img4, alt: "Detección temprana", highlight: "2 SEMANAS ANTES", subtext: "la diferencia entre éxito y fracaso" }
];

const WhyUs = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    pauseOnHover: true,
    beforeChange: () => {
      document.querySelectorAll('.text-content').forEach(content => {
        content.classList.add('fade-out');
      });
    },
    afterChange: () => {
      setTimeout(() => {
        document.querySelectorAll('.text-content').forEach(content => {
          content.classList.remove('fade-out');
          content.classList.add('fade-in');
          setTimeout(() => {
            content.classList.remove('fade-in');
          }, 1000);
        });
      }, 100);
    }
  };

  return (
    <section className="whyus-wrapper">
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
  );
};

export default WhyUs;
