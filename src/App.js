import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, TextField, List, ListItem, ListItemText, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import sol from './Img/Tiempo/sol.png';
import lluvia from './Img/Tiempo/lluvia.png';
import nubes from './Img/Tiempo/nubes.png';
import tormenta from './Img/Tiempo/tormenta.png';

function App() {
  const initialProcesses = [
    { id: 1, name: 'Proceso 1' },
    // Agrega más procesos aquí
  ];

  const [processes, setProcesses] = useState(initialProcesses);
  const [searchText, setSearchText] = useState('');

  const handleLaunchProcess = (processId) => {
    console.log(`Lanzando proceso con ID ${processId}`);
  };

  const [weatherData, setWeatherData] = useState([]);

  // Estado para almacenar las coordenadas
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    // Obtener coordenadas de latitud y longitud
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        error => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  }, []);


  useEffect(() => {
    if (coordinates) {
      const apiKey = '3ddb47eb2b794415759270a2ba624a0a';
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          console.error(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }
  }, [coordinates]);

  const filteredProcesses = processes.filter(
    process => process.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Relanzado Procesos</h1>
        {/* <TextField
          label="EL Tiempo"
          variant="outlined"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        /> */}

        {weatherData.main ? (
          <List>
            {filteredProcesses.map(process => (
              <ListItem key={process.id}>
                <Card sx={{ maxWidth: 350 }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={sol}
                    alt="Descripción de la imagen"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {weatherData.name}<br />
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Temperatura: {weatherData.main.temp}°C<br />
                      Temperatura Máxima: {weatherData.main.temp_max}°C<br />
                      Temperatura Mínima: {weatherData.main.temp_min}°C<br />
                      Descripción: {weatherData.weather[0].description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleLaunchProcess(process.id)}
                    >
                      Lanzar
                    </Button>
                  </CardActions>
                </Card>
              </ListItem>
            ))}
          </List>
        ) : (
          <div>Cargando datos de clima...</div>
        )}
      </header>
    </div>
  );
}

export default App;
