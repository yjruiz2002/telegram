const { Telegraf } = require('telegraf');
const firebase = require('firebase/app');
require('firebase/database');

// Import the getDatabase function from the firebase/database module
const { getDatabase, ref, get } = require('firebase/database');

const bot = new Telegraf('6872352005:AAHedgmUMYc9PeHuetnCLsxjfJ2Phoq50rw');

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyCJL6YfOQ_cNrLWla8praOgF03Z2BxKOXQ",
authDomain: "tesis-final-84a29.firebaseapp.com",
databaseURL: "https://tesis-final-84a29-default-rtdb.firebaseio.com",
projectId: "tesis-final-84a29",
storageBucket: "tesis-final-84a29.appspot.com",
messagingSenderId: "751823933609",
appId: "1:751823933609:web:672b19593e37faddd999b8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = getDatabase();

const messageRef = ref(db, 'sensores/DHT11');
const messageRefLuz = ref(db, 'sensores/Luz');
const messageAcuse1 = ref(db, 'sensores/ACUSES1');
const messageAcuse2 = ref(db, 'sensores/ACUSES2');

bot.start((ctx) => {
    ctx.reply("Bienvenido al bot diseñado para la tesis 'DISEÑO DE PROTOTIPO DE RED LORAWAN DESTINADA AL MONITOREO Y ALERTA REMOTO CPN SENSORES APLICADO EN GRANDES ESPACIOS ABIERTOS A TRAVÉS DE TECNOLOGIA IOT'");
    ctx.reply("Fui Diseñado para enviar actualizaciones de los sensores de la red cada 20 minutos de manera automática, además cuento con los siguientes comandos:");
    ctx.reply("'/update' para recibir la ultima actualización disponible de los sensores\n '/calidad' para recibir la información referente a la calidad del enlace en ese momento \n '/mensajes' para recibir los mensajes generados en la red \n\n Recuerde que todo esto es la informacion resumida, si quiere verlo de manera mas completa y mas funciones visite la página web 'https://tesislorasantateresa.site/'"); 
});

bot.command('update', (ctx) => {
    Promise.all([
        get(messageRef),
        get(messageRefLuz)
      ])
      .then(([temperatureSnapshot, soilSnapshot]) => {
        if (temperatureSnapshot.exists() && soilSnapshot.exists()) {
          const temperatureData = temperatureSnapshot.val();
          const soilData = soilSnapshot.val();
          var fecha = new Date(); // Obtiene la fecha y hora actual
          fecha.setUTCHours(fecha.getUTCHours() - 4); // Ajusta la hora a la zona horaria de Venezuela (GMT-4)
          console.log(fecha);
          var dia = fecha.getUTCDate(); // Obtiene el día (1-31)
          var mes = fecha.getUTCMonth() + 1; // Obtiene el mes (0-11) y se le suma 1
          var year = fecha.getUTCFullYear(); // Obtiene el año de cuatro dígitos
      
          const lastChildText = JSON.stringify(soilData);
          const obj = JSON.parse(lastChildText);
          const tiempoValues = [];
          const luzValues = [];

          for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const luz = obj[key].deteccion;
                    luzValues.push(luz);
                }
            }
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const tiempo = obj[key].tiempo;
                    tiempoValues.push(tiempo);
                }
            }

            const valuest = Object.values(tiempoValues);
            const posiciones = [];

            for (var i = 0; i < valuest.length; i++) {
                var hora = valuest[i].split(',');
                var horanew = hora[0].replace(/^\(/, '');
                var mesnew = hora[1].replace(/^\ /, '');
                var dianew = hora[2].replace(/^\ /, '');
                if(horanew == year.toString()){
                    if(mesnew == mes.toString()){
                        if(dianew == dia.toString()){
                            posiciones.push(i);
                        }
                    }
                }
            }

            const values = Object.values(luzValues);
            var contadorLuz = 0;
            var valores = [];
            for (var i = 0; i < posiciones.length; i++) {
                var nuevo = "Esta recibiendo Luz Directa";
                if ("Esta recibiendo Luz Directa" === luzValues[posiciones[i]]) {
                    contadorLuz = contadorLuz + 20;
                }
                valores.push(luzValues[posiciones[i]]);
            }
          const horasNew = contadorLuz / 60;
          const horasNewRedondeada = horasNew.toFixed(1);
          const temperatureKeys = Object.keys(temperatureData);
          const temperatureLastKey = temperatureKeys[temperatureKeys.length - 1];
          const temperatureLastChild = temperatureData[temperatureLastKey];
          const temperatureObject = JSON.parse(JSON.stringify(temperatureLastChild));
          const temperature = parseFloat(temperatureObject.temperatura);
          const humidity = parseFloat(temperatureObject.humedad);
          const temperatureTime = temperatureObject.tiempo;
      
          const soilKeys = Object.keys(soilData);
          const soilLastKey = soilKeys[soilKeys.length - 1];
          const soilLastChild = soilData[soilLastKey];
          const soilObject = JSON.parse(JSON.stringify(soilLastChild));
          const soilHumidity = parseFloat(soilObject.suelo);
          const luz = soilObject.deteccion;
          const soilTime = soilObject.tiempo;
      
          const temperatureTimeMatch = temperatureTime.match(/\((.*?)\)/)[1];
          const soilTimeMatch = soilTime.match(/\((.*?)\)/)[1];
          const temperatureTimeValues = temperatureTimeMatch.split(", ");
          const soilTimeValues = soilTimeMatch.split(", ");
      
          const temperatureYear = parseInt(temperatureTimeValues[0]);
          const temperatureMonth = parseInt(temperatureTimeValues[1]);
          const temperatureDay = parseInt(temperatureTimeValues[2]);
          const temperatureHour = parseInt(temperatureTimeValues[3]);
          const temperatureMinute = parseInt(temperatureTimeValues[4]);
      
          const soilYear = parseInt(soilTimeValues[0]);
          const soilMonth = parseInt(soilTimeValues[1]);
          const soilDay = parseInt(soilTimeValues[2]);
          const soilHour = parseInt(soilTimeValues[3]);
          const soilMinute = parseInt(soilTimeValues[4]);
      
          const temperatureDate = new Date(temperatureYear, temperatureMonth - 1, temperatureDay, temperatureHour, temperatureMinute);
          const soilDate = new Date(soilYear, soilMonth - 1, soilDay, soilHour, soilMinute);
      
          const temperatureFormattedDate = temperatureDate.toLocaleDateString();
          const temperatureFormattedTime = temperatureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const soilFormattedDate = soilDate.toLocaleDateString();
          const soilFormattedTime = soilDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
          const message = `DATOS OBTENIDOS DE LOS SENSORES\n
          Temperatura: \u{1F321}\u{FE0F} ${temperature}°C\n
          Humedad: \u{1F4A7} ${humidity}%\n
          Última actualización: ${temperatureFormattedDate} ${temperatureFormattedTime}\n
          Humedad del suelo: \u{1F331} ${soilHumidity}%\n
          Tiempo de intensidad de luz recibida: \u{2600}\u{FE0F} ${horasNewRedondeada} h\n
          Última actualización: ${soilFormattedDate} ${soilFormattedTime}`;          
          ctx.reply(message);
        } else {
          ctx.reply("No data available in the database.");
        }
      })
      .catch((error) => {
        console.error("Error reading the message:", error);
        ctx.reply("An error occurred while reading the data from the database.");
      });
});


bot.command('mensajes', (ctx) => {
  Promise.all([
      get(messageRef),
      get(messageRefLuz)
    ])
    .then(([temperatureSnapshot, soilSnapshot]) => {
      if (temperatureSnapshot.exists() && soilSnapshot.exists()) {
        var messageTemperatura = "";
        var messageHumedad = "";
        var messageLuz = "";
        var messageHumedadSuelo = "";
        const temperatureData = temperatureSnapshot.val();
        const soilData = soilSnapshot.val();
        var fecha = new Date(); // Obtiene la fecha y hora actual
        fecha.setUTCHours(fecha.getUTCHours() - 4); // Ajusta la hora a la zona horaria de Venezuela (GMT-4)
        console.log(fecha);
        var dia = fecha.getUTCDate(); // Obtiene el día (1-31)
        var mes = fecha.getUTCMonth() + 1; // Obtiene el mes (0-11) y se le suma 1
        var year = fecha.getUTCFullYear(); // Obtiene el año de cuatro dígitos
    
        const lastChildText = JSON.stringify(soilData);
        const obj = JSON.parse(lastChildText);
        const tiempoValues = [];
        const luzValues = [];

        for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                  const luz = obj[key].deteccion;
                  luzValues.push(luz);
              }
          }
          for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                  const tiempo = obj[key].tiempo;
                  tiempoValues.push(tiempo);
              }
          }

          const valuest = Object.values(tiempoValues);
          const posiciones = [];

          for (var i = 0; i < valuest.length; i++) {
              var hora = valuest[i].split(',');
              var horanew = hora[0].replace(/^\(/, '');
              var mesnew = hora[1].replace(/^\ /, '');
              var dianew = hora[2].replace(/^\ /, '');
              if(horanew == year.toString()){
                  if(mesnew == mes.toString()){
                      if(dianew == dia.toString()){
                          posiciones.push(i);
                      }
                  }
              }
          }

          const values = Object.values(luzValues);
          var contadorLuz = 0;
          var valores = [];
          for (var i = 0; i < posiciones.length; i++) {
              var nuevo = "Esta recibiendo Luz Directa";
              if ("Esta recibiendo Luz Directa" === luzValues[posiciones[i]]) {
                  contadorLuz = contadorLuz + 20;
              }
              valores.push(luzValues[posiciones[i]]);
          }
        const horasNew = contadorLuz / 60;
        const horasNewRedondeada = horasNew.toFixed(1);
        const temperatureKeys = Object.keys(temperatureData);
        const temperatureLastKey = temperatureKeys[temperatureKeys.length - 1];
        const temperatureLastChild = temperatureData[temperatureLastKey];
        const temperatureObject = JSON.parse(JSON.stringify(temperatureLastChild));
        const temperature = parseFloat(temperatureObject.temperatura);
        const humidity = parseFloat(temperatureObject.humedad);
        const temperatureTime = temperatureObject.tiempo;
    
        const soilKeys = Object.keys(soilData);
        const soilLastKey = soilKeys[soilKeys.length - 1];
        const soilLastChild = soilData[soilLastKey];
        const soilObject = JSON.parse(JSON.stringify(soilLastChild));
        const soilHumidity = parseFloat(soilObject.suelo);
        const luz = soilObject.deteccion;
        const soilTime = soilObject.tiempo;
    
        const temperatureTimeMatch = temperatureTime.match(/\((.*?)\)/)[1];
        const soilTimeMatch = soilTime.match(/\((.*?)\)/)[1];
        const temperatureTimeValues = temperatureTimeMatch.split(", ");
        const soilTimeValues = soilTimeMatch.split(", ");
    
        const temperatureYear = parseInt(temperatureTimeValues[0]);
        const temperatureMonth = parseInt(temperatureTimeValues[1]);
        const temperatureDay = parseInt(temperatureTimeValues[2]);
        const temperatureHour = parseInt(temperatureTimeValues[3]);
        const temperatureMinute = parseInt(temperatureTimeValues[4]);
    
        const soilYear = parseInt(soilTimeValues[0]);
        const soilMonth = parseInt(soilTimeValues[1]);
        const soilDay = parseInt(soilTimeValues[2]);
        const soilHour = parseInt(soilTimeValues[3]);
        const soilMinute = parseInt(soilTimeValues[4]);
    
        const temperatureDate = new Date(temperatureYear, temperatureMonth - 1, temperatureDay, temperatureHour, temperatureMinute);
        const soilDate = new Date(soilYear, soilMonth - 1, soilDay, soilHour, soilMinute);
    
        const temperatureFormattedDate = temperatureDate.toLocaleDateString();
        const temperatureFormattedTime = temperatureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const soilFormattedDate = soilDate.toLocaleDateString();
        const soilFormattedTime = soilDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (temperature >= 0 && temperature <= 23) {
          messageTemperatura = "¡Atención! Temperaturas insuficientes. Riesgo para cultivo. Esto puede retrasar o detener la maduración de la caña de azúcar!";
        } else if (temperature >= 24 && temperature <= 33) {
          messageTemperatura = "¡Excelente condición! Temperatura óptima para el cultivo.";
        } else if (temperature >= 34 && temperature <= 100)  {
          messageTemperatura = "¡Atencion! Temperaturas excesivas. Riesgo para cultivo. Calor excesivo acelera la descomposición de los tallos!";
        }
        if (humidity >= 0 && humidity <= 55) {
          messageHumedad = "¡Atención! Condiciones de humedad ambiental insuficientes para el cultivo de caña de azúcar.";
        } else if (humidity >= 56 && humidity <= 75) {
          messageHumedad = "Las condiciones de humedad ambiental son óptimas para el cultivo de caña de azúcar.";
        } else if (humidity >= 76 && humidity <= 100)  {
          messageHumedad = "¡Atención! Condiciones de humedad ambiental excesivas para el cultivo de caña de azúcar.";
        }
        if (soilHumidity >= 0 && soilHumidity <= 48) {
          messageHumedadSuelo = "¡Atención! Humedad del suelo insuficiente. Riesgo para cultivo. Esto puede causar marchitamiento, menor rendimiento y calidad de los tallos!";
        } else if (soilHumidity >= 49 && soilHumidity <= 80) {
          messageHumedadSuelo = "¡Óptima humedad del suelo! Condiciones ideales para la caña de azúcar";
        } else if (soilHumidity >= 81 && soilHumidity <= 100)  {
          messageHumedadSuelo = "¡Atencion! Humedad del suelo excesiva. Riesgo para cultivo. Puede provocar problemas de aireación en las raíces, promover el desarrollo de enfermedades en los tallos!";
        }
        if (horasNewRedondeada >= 0 && horasNewRedondeada <= 6) {
          messageLuz = "No ha recibido suficientes horas de luz directa en el día.";
        } else if (horasNewRedondeada >= 7 && horasNewRedondeada <= 8) {
          messageLuz = "Ha recibido suficientes horas de luz directa en el día.";
        } else if (horasNewRedondeada>=9) {
          messageLuz = "¡Atención! Exceso de luz directa en el día.";
        }
        const message = `DATOS OBTENIDOS DE LOS SENSORES\n
        Temperatura: \u{1F321}\u{FE0F} ${messageTemperatura}\n
        Humedad: \u{1F4A7} ${messageHumedad}\n
        Última actualización: ${temperatureFormattedDate} ${temperatureFormattedTime}\n
        Humedad del suelo: \u{1F331} ${messageHumedadSuelo}\n
        Tiempo de intensidad de luz recibida: \u{2600}\u{FE0F} ${messageLuz}\n
        Última actualización: ${soilFormattedDate} ${soilFormattedTime}`;

        ctx.reply(message);
      } else {
        ctx.reply("No data available in the database.");
      }
    })
    .catch((error) => {
      console.error("Error reading the message:", error);
      ctx.reply("An error occurred while reading the data from the database.");
    });
});

bot.command('calidad', (ctx) => {
    Promise.all([
        get(messageAcuse1),
        get(messageAcuse2)
      ])
      .then(([messageAcuse1Snapshot, messageAcuse2Snapshot]) => {
        if (messageAcuse1Snapshot.exists() && messageAcuse2Snapshot.exists()) {
            const children = messageAcuse1Snapshot.val();

            const keys = Object.keys(children);
            const lastKey = keys[keys.length - 1];
            const lastChild = children[lastKey];
            const lastChildText = JSON.stringify(lastChild);
            const objeto = JSON.parse(lastChildText);
            const potencia_rx = objeto['potencia_rx'];
            const newpotencia = JSON.stringify(potencia_rx);
            const tiempo = objeto['tiempo'];
            console.log("newpotencia", potencia_rx, tiempo);
            //console.log("time", time); // Imprime la fecha formateada
            
            var valores = tiempo.match(/\((.*?)\)/)[1];
            var lista = valores.split(", ");
            console.log("time", lista); // Imprime la fecha formateada
            var año = parseInt(lista[0]);
            var mes = parseInt(lista[1]);
            var dia = parseInt(lista[2]);
            var hora = parseInt(lista[3]);
            var minuto = parseInt(lista[4]);
            var fecha = new Date(año, mes - 1, dia, hora, minuto); // Restamos 1 al mes porque los meses en JavaScript comienzan desde 0
            var formatoFecha = fecha.toLocaleDateString();
            var formatoHora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtiene el formato de fecha local del navegador
            //console.log("time", formatoFecha); // Imprime la fecha formateada
            var value = newpotencia.replace(/"/g, ""); 

            const children2 = messageAcuse2Snapshot.val();

            const keys2 = Object.keys(children2);
            const lastKey2 = keys2[keys2.length - 1];
            const lastChild2 = children2[lastKey2];
            const lastChildText2 = JSON.stringify(lastChild2);
            const objeto2 = JSON.parse(lastChildText2);
            const potencia_rx2 = objeto2['potencia_rx'];
            const newpotencia2 = JSON.stringify(potencia_rx2);
            const tiempo2 = objeto2['tiempo'];
            console.log("newpotencia2", potencia_rx2, tiempo2);
            //console.log("time", time); // Imprime la fecha formateada
            
            var valores2 = tiempo2.match(/\((.*?)\)/)[1];
            var lista2 = valores2.split(", ");
            console.log("time", lista2); // Imprime la fecha formateada
            var año2 = parseInt(lista2[0]);
            var mes2 = parseInt(lista2[1]);
            var dia2 = parseInt(lista2[2]);
            var hora2 = parseInt(lista2[3]);
            var minuto2 = parseInt(lista2[4]);
            var fecha2 = new Date(año2, mes2 - 1, dia2, hora2, minuto2); // Restamos 1 al mes porque los meses en JavaScript comienzan desde 0
            var formatoFecha2 = fecha2.toLocaleDateString();
            var formatoHora2 = fecha2.toLocaleTimeString([], { hour2: '2-digit', minute2: '2-digit' }); // Obtiene el formato de fecha local del navegador
            //console.log("time", formatoFecha); // Imprime la fecha formateada
            var value2 = newpotencia2.replace(/"/g, ""); 
      
            const message = `CALIDAD DEL ENLACE\n
            Sensores de humedad y temperatura: ${value} dbm\n
            Última actualización: ${formatoFecha} ${formatoHora}\n
            Sensores de humedad del suelo e intensidad de luz: ${value2} dbm\n
            Última actualización: ${formatoFecha2} ${formatoHora2}`;       
            ctx.reply(message);
        } else {
          ctx.reply("No data available in the database.");
        }
      })
      .catch((error) => {
        console.error("Error reading the message:", error);
        ctx.reply("An error occurred while reading the data from the database.");
      });
});

bot.on('message', (ctx) => {
    console.log(`Received message from ${ctx.message.chat.id}`);
    // Do something with the message and chat ID
  });

const schedule = require('node-schedule');

schedule.scheduleJob('*/20 * * * *', () => {
    Promise.all([
        get(messageRef),
        get(messageRefLuz)
      ])
      .then(([temperatureSnapshot, soilSnapshot]) => {
        if (temperatureSnapshot.exists() && soilSnapshot.exists()) {
          const temperatureData = temperatureSnapshot.val();
          const soilData = soilSnapshot.val();
          var fecha = new Date(); // Obtiene la fecha y hora actual
          fecha.setUTCHours(fecha.getUTCHours() - 4); // Ajusta la hora a la zona horaria de Venezuela (GMT-4)
          console.log(fecha);
          var dia = fecha.getUTCDate(); // Obtiene el día (1-31)
          var mes = fecha.getUTCMonth() + 1; // Obtiene el mes (0-11) y se le suma 1
          var year = fecha.getUTCFullYear(); // Obtiene el año de cuatro dígitos
      
          const lastChildText = JSON.stringify(soilData);
          const obj = JSON.parse(lastChildText);
          const tiempoValues = [];
          const luzValues = [];

          for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const luz = obj[key].deteccion;
                    luzValues.push(luz);
                }
            }
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const tiempo = obj[key].tiempo;
                    tiempoValues.push(tiempo);
                }
            }

            const valuest = Object.values(tiempoValues);
            const posiciones = [];

            for (var i = 0; i < valuest.length; i++) {
                var hora = valuest[i].split(',');
                var horanew = hora[0].replace(/^\(/, '');
                var mesnew = hora[1].replace(/^\ /, '');
                var dianew = hora[2].replace(/^\ /, '');
                if(horanew == year.toString()){
                    if(mesnew == mes.toString()){
                        if(dianew == dia.toString()){
                            posiciones.push(i);
                        }
                    }
                }
            }

            const values = Object.values(luzValues);
            var contadorLuz = 0;
            var valores = [];
            for (var i = 0; i < posiciones.length; i++) {
                var nuevo = "Esta recibiendo Luz Directa";
                if ("Esta recibiendo Luz Directa" === luzValues[posiciones[i]]) {
                    contadorLuz = contadorLuz + 20;
                }
                valores.push(luzValues[posiciones[i]]);
            }
          const horasNew = contadorLuz / 60;
          const horasNewRedondeada = horasNew.toFixed(1);
          const temperatureKeys = Object.keys(temperatureData);
          const temperatureLastKey = temperatureKeys[temperatureKeys.length - 1];
          const temperatureLastChild = temperatureData[temperatureLastKey];
          const temperatureObject = JSON.parse(JSON.stringify(temperatureLastChild));
          const temperature = parseFloat(temperatureObject.temperatura);
          const humidity = parseFloat(temperatureObject.humedad);
          const temperatureTime = temperatureObject.tiempo;
      
          const soilKeys = Object.keys(soilData);
          const soilLastKey = soilKeys[soilKeys.length - 1];
          const soilLastChild = soilData[soilLastKey];
          const soilObject = JSON.parse(JSON.stringify(soilLastChild));
          const soilHumidity = parseFloat(soilObject.suelo);
          const luz = soilObject.deteccion;
          const soilTime = soilObject.tiempo;
      
          const temperatureTimeMatch = temperatureTime.match(/\((.*?)\)/)[1];
          const soilTimeMatch = soilTime.match(/\((.*?)\)/)[1];
          const temperatureTimeValues = temperatureTimeMatch.split(", ");
          const soilTimeValues = soilTimeMatch.split(", ");
      
          const temperatureYear = parseInt(temperatureTimeValues[0]);
          const temperatureMonth = parseInt(temperatureTimeValues[1]);
          const temperatureDay = parseInt(temperatureTimeValues[2]);
          const temperatureHour = parseInt(temperatureTimeValues[3]);
          const temperatureMinute = parseInt(temperatureTimeValues[4]);
      
          const soilYear = parseInt(soilTimeValues[0]);
          const soilMonth = parseInt(soilTimeValues[1]);
          const soilDay = parseInt(soilTimeValues[2]);
          const soilHour = parseInt(soilTimeValues[3]);
          const soilMinute = parseInt(soilTimeValues[4]);
      
          const temperatureDate = new Date(temperatureYear, temperatureMonth - 1, temperatureDay, temperatureHour, temperatureMinute);
          const soilDate = new Date(soilYear, soilMonth - 1, soilDay, soilHour, soilMinute);
      
          const temperatureFormattedDate = temperatureDate.toLocaleDateString();
          const temperatureFormattedTime = temperatureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const soilFormattedDate = soilDate.toLocaleDateString();
          const soilFormattedTime = soilDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
          const message = `DATOS OBTENIDOS DE LOS SENSORES\n
          Temperatura: \u{1F321}\u{FE0F} ${temperature}°C \n
          Humedad: \u{1F4A7} ${humidity}%\n
          Última actualización: ${temperatureFormattedDate} ${temperatureFormattedTime}\n
          Humedad del suelo: \u{1F331} ${soilHumidity}%\n
          Tiempo de intensidad de luz recibida: \u{2600}\u{FE0F} ${horasNewRedondeada} h\n
          Última actualización: ${soilFormattedDate} ${soilFormattedTime}`;
          bot.telegram.sendMessage('-4191864911', message); // Replace 'VALID_CHAT_ID' with the actual chat ID of a user
        } else {
            bot.telegram.sendMessage('-4191864911', "No data available in the database."); // Replace 'VALID_CHAT_ID' with the actual chat ID of a user
        }
      })
      .catch((error) => {
        console.error("Error reading the message:", error);
        bot.telegram.sendMessage('-4191864911', "An error occurred while reading the data from the database."); // Replace 'VALID_CHAT_ID' with the actual chat ID of a user
      });
    
  });


bot.launch();
