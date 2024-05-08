import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import QRCodeGenerator from '../components/qr';
import '@google/model-viewer';

import "./imagenDetail.css"

const Detail = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const [image, setImage] = useState({
    title: "",
    url: "",
    id: "",
  });
  const params = useParams();

  useEffect(() => {
    (async () => {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        console.error('Invalid id:', params.id);
        return;
      }
      const res = await axios.get("https://dashmodel.onrender.com/api/images/" + id);//deployado
      setImage(res.data);
    })();
  }, [params.id]);

  const handleDelete = async () => {
    await axios.delete("https://dashmodel.onrender.com/api/images/" + params.id);//deployado
    navigate('/');
  }

  const startAR = () => {
    // Abre la cámara del dispositivo
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        // La cámara está activa, puedes hacer algo con el flujo de video si lo deseas
        console.log("Cámara activada");
      })
      .catch(function (error) {
        // Si hay un error al acceder a la cámara
        console.error("Error al acceder a la cámara:", error);
      });
  };

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

          <button className="btn btn-outline-primary" onClick={startAR}>Ver en tu espacio</button>

          <div className="card-body">
            <h1>{image.title}</h1>
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              <span className="material-icons">delete</span>
            </button>
          </div>
        </div>
        <button onClick={() => setModalVisible(true)} className="btn btn-primary">
          Genera codigo QR
        </button>
        {modalVisible && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', backgroundColor: 'lightgray' }} className="bg-success p-2 text-dark bg-opacity-50 rounded">
            <p>Esta es una ventana más pequeña.</p>
            <QRCodeGenerator />
            <button onClick={() => setModalVisible(false)} className="btn btn-outline-danger">
              Cerrar ventana
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
