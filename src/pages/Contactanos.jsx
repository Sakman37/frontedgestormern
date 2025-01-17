/* global Email */
import React, { useState } from "react";
import '../styles/contactanos.css';
const Contacto = () => {
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault(); // Prevenir el envío real del formulario

    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const correo = formData.get("correo");
    const asunto = formData.get("asunto");
    const mensaje = formData.get("mensaje");

    // Enviar correo usando SMTP.js
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "pruebasnido@gmail.com", // Cambia por tu usuario de ElasticEmail
      Password: "02D64F066A10C7E536E336CC2B99FB11EAD5", // Cambia por tu contraseña de ElasticEmail
      To: "pruebasnido@gmail.com", // Cambia por el correo destinatario
      From: "pruebasnido@gmail.com", // Cambia por tu correo remitente
      Subject: asunto,
      Body: `
      <h4>Nuevo mensaje de contacto</h4>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `,
  })
    .then(() => {
      setMensajeEnviado(true);
      e.target.reset();
      setTimeout(() => setMensajeEnviado(false), 5000);
    })
    .catch((error) => {
      alert("Error al enviar el correo: " + error);
    });
};

return (
    <section className="contacto py-5">
      <div className="container">
        <h2 className="text-center mb-4">Contáctanos</h2>
        <div className="row">
          {/* Formulario de contacto */}
          <div className="col-md-6 mb-4">
            <form onSubmit={manejarEnvio}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  name="correo"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="asunto" className="form-label">
                  Asunto
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="asunto"
                  name="asunto"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label">
                  Mensaje
                </label>
                <textarea
                  className="form-control"
                  id="mensaje"
                  name="mensaje"
                  rows="4"
                  required
                ></textarea>
              </div>
            <button type="submit" className="btn btn-primary">
                Enviar Mensaje
            </button>

            </form>
            {mensajeEnviado && (
              <div className="alert alert-success mt-4" role="alert">
                ¡Gracias por escribirnos! Nos pondremos en contacto contigo pronto.
              </div>
            )}
            
            
          </div>

          {/* Información de contacto */}
          <div className="col-md-6">
            <div className="contact-info">
              <h4 className="mb-3">Información de Contacto</h4>
              <p>
                <strong>Dirección:</strong> Papayal, Palmira, Valle del Cauca
              </p>
              <p>
                <strong>Teléfono:</strong> +57 301 2339487
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="sakman37xd@gmail.com">
                    sakman37xd@gmail.com

                </a>
              </p>
              
              <p>
                <a
                
                >
                  
                </a>
                
                <a
                  
                >
                  
                </a>
                
                <a
                  
                >
                  
                </a>
              </p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15932.359413361799!2d-76.5212768!3d3.327976!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a1df68efbd65%3A0x5cd25776a8ad1743!2sZONAMERICA!5e0!3m2!1ses!2sco!4v1732642407671!5m2!1ses!2sco"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;