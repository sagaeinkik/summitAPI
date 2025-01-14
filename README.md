# Projektuppgift "Summit"

av Saga Einarsdotter Kikajon för kursen DTnågonting, Fullstacksutveckling med Ramverk, på Mittuniversitetet 2024.

## Information

API:et är framtaget för en lagerhanteringsapplikation för ett fiktivt företag som säljer vintersportutrustning.

Det är skapat med Fastify som ramverk tillsammans med @fastify/mysql, ett core plugin. Jag har inte använt ORM i utvecklingen.

Dependencies:

-   Fastify - huvudramverk
-   @fastify/mysql - core plugin för att ansluta till mysql
-   @fastify/cors - core plugin för att tillåta cors
-   bcrypt - hashning av lösenord
-   jsonwebtoken - generera tokens för autentisering

Dev dependencies:

-   nodemon - hot reloading
-   dotenv - miljövariabler

### Filstruktur

```
api/
├── services/  <- Häri ligger SQL-frågor mot olika scheman
│   └── userService.js osv
│
├── controllers/ <- Häri ligger funktionerna
│   └── user.controller.js osv
│
├── routes/ <- Häri ligger router-filer
│   ├── users.routes.js osv
│   │
│   └── options/ <- Häri ligger options-filer för hur routerna hanteras
│       └── users.options.js osv
│
├── utils/ <- Häri ligger autentiseringfunktioner, errorfunktioner osv
│   └── errMsg.js osv
│
└── server.js <- Här startas app
```

## API

Det finns totalt fem scheman (products, categories, suppliers, users samt log) och en vy (products_view) i databasen. Denna vy liknar products-schemat med skillnaden att den inkluderar leverantörnamn och kategorinamn snarare än ID som foreign keys.  
Products, categories och suppliers har tre triggers vardera som alla loggar inserts, updates och deletes i log-schemat.

### Användning

Installera alla paket:

```
npm install
```

Skript för databas:

```
node install.js
```

Skapa JWT-secret key till .env-variabel:

```
node generateJwt.js
```

Starta applikation:

```
npm run dev
```

### Endpoints

#### Användare

Observera att för att kunna uppdatera eller radera en användare behöver man ha en token skapad för just det användarnamnet.

| Metod  |  Endpoint   |  Beskrivning                           |
| ------ | ----------- | -------------------------------------- |
|  GET   | /users      |  Hämtar samtliga användare             |
|  GET   | /users/:id  |  Hämtar användare baserat på ID        |
| POST   |  /signup    |  Lägger till användare                 |
| POST   |  /login     |  Loggar in användare                   |
| PUT    |  /users/:id | Uppdaterar användare med specifikt ID  |
| DELETE | /users/:id  |  Raderar användare med specifikt ID    |

#### Kategorier

Observera att man måste autentisera sig med en giltig token för att lägga till, uppdatera eller radera kategorier.

| Metod  |  Endpoint        |  Beskrivning                          |
| ------ | ---------------- | ------------------------------------- |
|  GET   | /categories      |  Hämtar samtliga kategorier           |
|  GET   | /categories/:id  |  Hämtar kategori baserat på ID        |
| POST   |  /categories     |  Lägger till kategori                 |
| PUT    |  /categories/:id | Uppdaterar kategori med specifikt ID  |
| DELETE | /categories/:id  |  Raderar kategori med specifikt ID    |

#### Leverantörer

| Metod  |  Endpoint       |  Beskrivning                            |
| ------ | --------------- | --------------------------------------- |
|  GET   | /suppliers      |  Hämtar samtliga leverantörer           |
|  GET   | /suppliers/:id  |  Hämtar leverantör baserat på ID        |
| POST   |  /suppliers     |  Lägger till leverantör                 |
| PUT    |  /suppliers/:id | Uppdaterar leverantör med specifikt ID  |
| DELETE | /suppliers/:id  |  Raderar leverantör med specifikt ID    |

#### Produkter

#### Logg

### Exempel
