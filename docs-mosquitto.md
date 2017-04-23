# MQTT auf dem Raspberry Pi
Wir nutzen Mosquitto für das Raspberry-PI Betriebssystem "Raspian".

## Befehle

### Benötigte Befehle
Die folgenden Befehle werden benötigt, um Mosquitto auf dem Raspberry-PI zu nutzen.

#### Mosquitto installieren
```bash
sudo apt-get install -y mosquitto mosquitto-clients
```

#### MQTT Subscriber starten und auf Kanal "lights" Nachrichten erwarten
```bash
mosquitto_sub -h localhost -v -t lights
```
Der Port kann über `-p` geändert werden. Der Default-Port ist 1883.

#### MGTT-Channel testen, indem als Publisher agiert wird
```bash
mosquitto_pub -h localhost -t lights -m "\{\"colorID\": \"1\", \"color\": [255, 0, 255], \"state\": \"on\"\}"\
```
Falls eine Authorisierung verwendet wird, müssen die Parameter `--username` und `--pw` übergeben wird.

### Optionale Befehle

#### Mosquitto als Daemon starten (optional mit `-p` für den Port)
```bash
mosquitto -d
```

#### Aktuell verbundene Clients ausgeben
```bash
mosquitto_sub -d -t '$SYS/broker/clients/active'
```
Siehe [$SYS-Dokumentation](https://mosquitto.org/man/mosquitto-8.html) für alle möglichen $SYS-subscribe-Befehle

#### Mosquitto Nutzer erstellen und löschen:
```bash
mosquitto_passwd -c /etc/mosquitto/passwd my_user
```
```bash
mosquitto_passwd -D /etc/mosquitto/passwd my_user
```

### Mosquitto Passwort setzen
```bash
mosquitto_passwd -b /etc/mosquitto/passwd my_user my_password
```

## Wildcard-Syntax
Es gibt zwei Arten von Wildcards: `+` und `#`:
- `+`: Genutzt wird ein Hierarchie-Level, z.b. `lights/+/status/+`, um den Status aller Lichter gleichzeitig zu empfangen
- `#`: Genutzt werden alle verbleibenden Hierarchie-Levels, z.B. `lights/#`, um alle Lichter und Stati zu empfangen.

## Relevante Konfigurationen
- `allow_anonymous` (def: `true`)
- `allow_duplicate_messages` (def: `true`)
- `log_dest` (def: `stdout`, möglich: `stdout`, `stderr`, `syslog` und `topic`)
- `persistence` (def: `false`)

## Relevante Dateien

`/etc/mosquitto/mosquitto.conf`
Konfigurationsdatei von Mosquitto

`/var/lib/mosquitto/mosquitto.db`
Datenbank an gespeicherten Nachrichten (wenn aktiviert)

`/etc/hosts.allow` und `/etc/hosts.deny`
Host-Zugriffskontrolle durch TCP-Protokoll


## Quellen
- https://mosquitto.org/documentation/
