# MQTT.js mit NodeJS
Einrichtung und Nutzung von MQTT.js mit NodeJS.

## Einrichtung
1. Node-App erstellen
```bash
mkdir test_mqtt
cd test_mqtt
touch client.js
```

2. MQTT.js global mit NPM installieren
```bash
npm install -g mqtt --save
```

3. Node-Client konfigurieren (in client.js kopieren)
```js
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')

client.on('connect', function () {
  console.log('Client connected! Subscribing to /lights')
  client.subscribe('lights')
  
  // Auskommentieren, um bei erfolgreicher Verbindung außerdem eine Test-Nachricht an /lights zu senden
  // client.publish('lights', '{"colorID": "1", "color": [255, 0, 255], "state": "on"}')  
})

client.on('message', function (topic, message) {
  if (topic !== 'lights') {
      return console.log('Skipping unhandled topic "' + topic + '" ...')
  }
  
  console.log('New Message:')
  console.log('-> ' + message.toString())
  
  // Einkommentieren, um Client nach Empfangen einer Nachrichten am Laufen zu lassen.
  // client.end()
})

```
4. Node-Client starten
```bash
node client.js
```
