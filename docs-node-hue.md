# Hue-Lichtsteuerung mit Node.js

Die Lichtsteuerung über Node.js läuft über die [node-hue-api](https://github.com/peter-murray/node-hue-api) Bibliothek.

## Einrichtung

### Node.js herunterladen und installieren
1. Node.js [hier](https://nodejs.org/en/download/) herunterladen
2. Node.js-Paket entpacken und installieren

### Node.js testen
In das Node.js Projekt wechseln:
```bash
cd node-hue-mqtt
```
Die Node.js Version überprüfen (um sicherzustellen, dass es korrekt installiert wurde)
```bash
node -v
```

### Node-Abhängigkeiten installieren (greift auf die `package.json` zu)
```bash
npm install
```

### Konfiguration Hue-Bridge
1. Sicherstellen, dass die Hue-Bridge im gleichen Netzwerk ist
2. [Diese](https://www.meethue.com/api/nupnp) Webseite aufrufen, um die IP-Adresse der Bridge zu ermitteln
3. Die IP-Adresse in der Client-Library in die `host` Variable schreiben, z.B. `const host = '192.168.0.1'`
4. Einen POST-Request mit dem `{"devicetype": "NodeAPI"}` Body auf die Adresse `http://<hue-ip>/api` ausführen
5. Den `username` kopieren und in der Client-Library in die `username` Variable schreiben, z.B. `const username = '<username>'`

### Node.js Client starten
```bash
node index.js
```

Fertig! Nun läuft der Node-Broker und kann die Topics `/lights/color` und `lights/toggle` empfangen und managen.
