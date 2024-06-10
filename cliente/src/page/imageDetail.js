import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import QRCodeGenerator from '../components/qr';
import '@google/model-viewer';
import Navbar from "../components/Navbar";

import "./imagenDetail.css"

const Detail = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const [image, setImage] = useState({
    title: "",
    url: "",
    id: "",
    medidas: "",
    slug: ""
  });
  const params = useParams();

  useEffect(() => {
    (async () => {
      const slug = params.slug;
      if (!slug) {
        console.error('Slug inválido:', params.slug);
        return;
      }
      const res = await axios.get(`http://localhost:4000/api/images/${slug}`);
      setImage(res.data);
    })();
  }, [params.slug]);

  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/images/${image.slug}`);//deployado
    navigate('/gallery');
  }

  // const startAR = () => {
  //   // Abre la cámara del dispositivo
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then(function (stream) {
  //       // La cámara está activa, puedes hacer algo con el flujo de video si lo deseas
  //       console.log("Cámara activada");
  //     })
  //     .catch(function (error) {
  //       // Si hay un error al acceder a la cámara
  //       console.error("Error al acceder a la cámara:", error);
  //     });
  // };

  function cerrarCartel() {
    // Oculta el cartel
    document.querySelector('.popup').style.display = 'none';
  }


  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div class="popup">
          <p>Debes estar entre 1.5 metro a 2 metros de distancia para visualizar en el tamaño aproximado </p>
          <button onClick={cerrarCartel}>Entendido</button>
        </div>
        <Navbar />
        <br />
        <div className="card bg-dark">

          <model-viewer
            src={image.url}
            alt={image.title}
            style={{ width: '100%', height: '500px' }}
            auto-rotate
            camera-controls
            ar
            ar-modes="scene-viewer webxr quick-look"
            tone-mapping="commerce"
            shadow-intensity="1"
            camera-orbit="0deg 45deg 2m"
            disable-zoom
          ></model-viewer>

          {/* <button className="btn btn-outline-primary" onClick={startAR}>Ver en tu espacio</button> */}

          <div className="card-body">
            <h1 className="diga">{image.title}</h1>
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              <span className="material-icons">delete</span>
            </button>
          </div>
        </div>
        <button onClick={() => setModalVisible(true)} className="aloja btn btn-primary">
          Codigo QR
        </button>
        {modalVisible && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', backgroundColor: 'lightgray' }} className="bg-success p-2 text-dark bg-opacity-50 rounded">

            <QRCodeGenerator />
            <button onClick={() => setModalVisible(false)} className="btn btn-danger cerrar">
              Cerrar ventana
            </button>
          </div>
        )}
        {/* <QRCodeGenerator /> */}
      </div>
    </div>
  );
};

export default Detail;
