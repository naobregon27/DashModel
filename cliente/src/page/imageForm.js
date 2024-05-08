import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Form() {


    const [file, setFile] = useState();
    const [title, setTitle] = useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const file = e.target.files[0];
        console.log('Tipo MIME del archivo:', file.type); // Esto te mostrará el tipo MIME real
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // // Validar tipo de archivo
        // if (!file || !file.name.endsWith('.glb')) {
        //     alert('Por favor, sube un archivo GLB válido.');
        //     return;
        // }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try {
              await axios.post("https://dashmodel.onrender.com/api/images/upload", formData, {//deployado
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let percent = parseInt((loaded * 100) / total);
                    setUploadPercentage(percent);
                },
            });

            // Retroalimentación al usuario
            alert('Archivo cargado con éxito.');

            // Limpieza de estado
            setFile(null);
            setTitle('');
            setUploadPercentage(0);
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al subir el archivo.');
        }

        setLoading(false);
    };

    return (
        <div className="col-md-4 offset-md-4">
            <Navbar/>
            {loading && (
                <div className="progress rounded-0">
                    <div
                        className="progress-bar progress-bar-striped bg-success"
                        role="progressbar"
                        style={{ width: `${uploadPercentage}%` }}
                    >
                        {uploadPercentage}%
                    </div>
                </div>
            )}

            <div className="card bg-dark text-light rounded-0 p-4">
                <div className="card-body">
                    <h1 className="h3 card-title">Upload an Image</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Upload Input */}
                        <input
                            type="text"
                            className="form-control bg-dark text-light my-3"
                            placeholder="Write a title for your Photo"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="file"
                            className="form-control bg-dark text-light rounded-0 border border-secondary"
                            onChange={handleChange}
                        />
                        <div className="my-3">
                            <button
                                className="btn btn-success rounded-0 w-100"
                                disabled={loading || !file}
                            >
                                {!loading ? (
                                    "Upload"
                                ) : (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default Form