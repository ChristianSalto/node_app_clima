const fs = require('fs');
const axios = require('axios');



class Searches {

  history = [];
  dbPath = './db/database.json';

  constructor() {
    this.readDB();
  }

  get historyCapitalized() {
    return this.history.map(v => {
      let place = v.split(' ');
      place = place.map(v => v[0].toUpperCase() + v.substring(1))

      return place.join(' ')
    })
  }

  get paramsMapbox() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'language': 'es'
    }
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric',
      lang: 'es'
    }
  }

  async getCity(locale = '') {

    try {


      const instance = await axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${locale}.json`,
        params: this.paramsMapbox,
      })

      const response = await instance.get();
      return response.data.features.map(value => ({
        id: value.id,
        nombre: value.place_name,
        lng: value.center[0],
        lat: value.center[1]
      }))


      return [];

    } catch (error) {

      console.log(error);
    }

  }


  async weatherPlaces(lat = '', lon = '') {


    try {

      const instance = await axios.create({
        baseURL: `http://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon }
      });


      const response = await instance.get();
      const { weather, main } = response.data;

      // console.log(response.data);

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      };

    } catch (error) {
      console.log(error)
    }
  }

  setHistorial(place = '') {


    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }

    this.history = this.history.slice(0, 5);

    this.history.unshift(place.toLocaleLowerCase());

    this.saveDB();

  }


  saveDB() {

    const payload = {
      history: this.history
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));

  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) null;

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

    const data = JSON.parse(info);
    const { history } = data;


    this.history = history
  }

}

module.exports = Searches;