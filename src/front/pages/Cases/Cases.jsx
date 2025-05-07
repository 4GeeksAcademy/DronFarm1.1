import React from "react";
import "./Cases.css"; 
import Fact1 from "../../assets/img/Cases/Fact1.jpg"; 
import Fact2 from "../../assets/img/Cases/Fact2.jpg"; 
import Fact3 from "../../assets/img/Cases/Fact3.jpg"; 

const Cases = () => {
  return (
    <div className="cases-container fade-in">
      <h1 className="cases-title">C</h1>
      
      <div className="cases-grid">
        <div className="case-card">
          <img src={Fact1} alt="Viñedos en La Rioja" className="case-image" />
          <h3>Viñedos de La Rioja</h3>
          <p>Detección temprana de infecciones por hongos con drones térmicos, reduciendo pérdidas en un 20%.</p>
        </div>

        <div className="case-card">
          <img src={Fact2} alt="Olivos en Castilla-La Mancha" className="case-image" />
          <h3>Olivos en Castilla-La Mancha</h3>
          <p>Identificación de estrés hídrico, logrando un ahorro de agua del 25% y reducción de costos energéticos.</p>
        </div>

        <div className="case-card">
          <img src={Fact3} alt="Cultivos de tomate en Murcia" className="case-image" />
          <h3>Tomates en Murcia</h3>
          <p>Detección temprana de plagas, reduciendo el uso de pesticidas en un 30% y ahorrando 5.000€ por hectárea.</p>
        </div>
      </div>

      <p className="cases-footer">La agricultura del siglo XXI necesita tecnología del siglo XXI, y eso es exactamente lo que ofrecemos con DronFarm.</p>
    </div>
  );
};

export default Cases;
