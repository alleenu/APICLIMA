import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";


const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=e63b78ed5e414ddb8c2204510230905&lang=es&q=`;


export default function App() {
  const [ciudad, establecerCiudad] = useState("");
  const [error, setError] = useState({
    error: false,
    mensaje: "",
  });
  const [cargando, setLoading] = useState(false);
  const [tiempo, establecerTiempo] = useState({
    ciudad: "",
    país: "",
    temperatura: 0,
    condición: "",
    conditionText: "",
    icono: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, mensaje: "" });
    setLoading(true);

    try {
      if (!ciudad.trim()) throw { mensaje: "El campo ciudad es obligatorio" };

      const res = await fetch(API_WEATHER + ciudad);
      const datos = await res.json();

      if (datos.error) {
        throw { mensaje: datos.error.mensaje };
      }

      console.log(datos);

      establecerTiempo({
        ciudad: datos.ubicación.nombre,
        país: datos.ubicación.país,
        temperatura: datos.actual.temp_c,
        condición: datos.condición.actual.código,
        conditionText: datos.condición.actual.texto,
        icono: datos.condición.actual.icono,
      });
    } catch (error) {
      console.log(error);
      setError({ error: true, mensaje: error.mensaje });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="ciudad"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={ciudad}
          onChange={(e) => establecerCiudad(e.target.value)}
          error={error.error}
          helperText={error.mensaje}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={cargando}
          loadingIndicator="Buscando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {tiempo.ciudad && (
        <Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }}>
          <Typography variant="h4" component="h2">
            {tiempo.ciudad}, {tiempo.país}
          </Typography>
          <Box component="img" alt={tiempo.conditionText} src={tiempo.icono} sx={{ margin: "0 auto" }} />
          <Typography variant="h5" component="h3">
            {tiempo.temperatura} °C
          </Typography>
          <Typography variant="h6" component="h4">
            {tiempo.conditionText}
          </Typography>
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
        Desarrollado por:{" "}
        <a href="https://www.weatherapi.com/" title="Weather API">
          WeatherAPI.com
        </a>
      </Typography>
    </Container>




  );
}

