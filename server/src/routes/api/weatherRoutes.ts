import  { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;
  if (cityName) {
    try {
      const weatherData = await WeatherService.getWeatherForCity(cityName);
      res.json(weatherData);
      if (weatherData) {
        res.json(weatherData);
      
    
  // TODO: save city to search history
 await HistoryService.addCity(req.body.city);
    } else {
      res.status(404).json({ message: 'City not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching weather data' });
    }
  }
    else {
      res.status(400).json({ message: 'Invalid city name' });
    }
  });

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    await HistoryService.removeCity(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting city from search history' });
  }
});

export default router;
