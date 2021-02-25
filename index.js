const { leerInput, inquirerMenu, pausa, listPlaces } = require('./helpers/inquirer');
const Searches = require('./models/searches');
require('dotenv').config();


const main = async () => {

  const searches = new Searches();
  let opt = 0;

  do {

    opt = await inquirerMenu();

    switch (opt) {
      case 1:

        // Mostrar mensaje:
        const locale = await leerInput('Ciudad: ');

        // Buscar los lugares
        const places = await searches.getCity(locale);

        // Seleccionar el lugar
        const id = await listPlaces(places);
        if (id === '0') continue;

        const { nombre, lng, lat } = places.find(v => v.id === id);
        searches.setHistorial(nombre);

        const { desc, min, max, temp } = await searches.weatherPlaces(lat, lng);

        // console.log(weather);

        console.clear();
        console.log('\nInformacion de la ciudad\n');
        console.log('Ciudad: ', nombre);
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Temperatura: ', temp);
        console.log('Minima: ', min);
        console.log('Maxima: ', max);
        console.log('Descripcion: ', desc)

        break;

      case 2:

        console.log('');
        searches.historyCapitalized.forEach((place, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx}. ${place}`);
        })

        break

    }


    if (opt !== 0) await pausa();


  } while (opt !== 0)

}


main();