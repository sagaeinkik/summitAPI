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

Filer i services och controllers är döpta till singular med flit, för det kändes mer logiskt i mitt huvud. Routes och options är plural.

API:et är skapat med flera skyddslager vad gäller tomma fält och dylikt. Dels används Fastifys inbyggda valideringsschema i Options, dels används egna felmeddelanden. Mina egna är skrivna med svenska meddelanden, men engelska titlar, så det är lite blandat.

Jag har valt att priser (in- och utpriser) lagras som heltal. Man får avrunda örena till närmsta krona.

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

Användarnamn, företagsnamn och kategorinamn måste vara unika. Innan en ny rad kan läggas till kontrolleras först om det redan finns en rad med samma namn.  
Detta har gjorts case insensitive med `COLLATE utf8mb4_general_ci` i SELECT-frågorna för berörda tabeller.

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

Observera att för att kunna uppdatera eller radera en användare behöver man ha en token skapad med just det användarnamnet.

| Metod  |  Endpoint      |  Beskrivning                           | Token krävs          |
| ------ | -------------- | -------------------------------------- | -------------------- |
|  GET   | /users         |  Hämtar samtliga användare             | Nej                  |
|  GET   | /users/id=:id  |  Hämtar användare baserat på ID        | Nej                  |
| POST   |  /signup       |  Lägger till användare                 | Nej                  |
| POST   |  /login        |  Loggar in användare                   | Nej                  |
| PUT    |  /users/id=:id | Uppdaterar användare med specifikt ID  | Ja, användarspecifik |
| DELETE | /users/id=:id  |  Raderar användare med specifikt ID    | Ja, användarspecifik |

#### Kategorier

| Metod  |  Endpoint           |  Beskrivning                          | Token krävs |
| ------ | ------------------- | ------------------------------------- | ----------- |
|  GET   | /categories         |  Hämtar samtliga kategorier           | Nej         |
|  GET   | /categories/id=:id  |  Hämtar kategori baserat på ID        | Nej         |
| POST   |  /categories        |  Lägger till kategori                 | Ja          |
| PUT    |  /categories/id=:id | Uppdaterar kategori med specifikt ID  | Ja          |
| DELETE | /categories/id=:id  |  Raderar kategori med specifikt ID    | Ja          |

#### Leverantörer

| Metod  |  Endpoint          |  Beskrivning                            | Token krävs |
| ------ | ------------------ | --------------------------------------- | ----------- |
|  GET   | /suppliers         |  Hämtar samtliga leverantörer           | Nej         |
|  GET   | /suppliers/id=:id  |  Hämtar leverantör baserat på ID        | Nej         |
| POST   |  /suppliers        |  Lägger till leverantör                 | Ja          |
| PUT    |  /suppliers/id=:id | Uppdaterar leverantör med specifikt ID  | Ja          |
| DELETE | /suppliers/id=:id  |  Raderar leverantör med specifikt ID    | Ja          |

#### Produkter

| Metod  |  Endpoint                    |  Beskrivning                                             | Token krävs |
| ------ | ---------------------------- | -------------------------------------------------------- | ----------- |
|  GET   | /products                    |  Hämtar samtliga produkter                               | Nej         |
|  GET   | /products/id=:id             |  Hämtar produkt baserat på ID                            | Nej         |
|  GET   | /products/category=:category |  Hämtar produkter baserat på kategorinamn                | Nej         |
|  GET   | /products/supplier=:supplier |  Hämtar produkter baserat på leverantör (namn)           | Nej         |
| POST   |  /products                   |  Lägger till produkt                                     | Ja          |
| PUT    |  /products/id=:id            | Uppdaterar produkt med specifikt ID                      | Ja          |
| DELETE | /products/id=:id             |  Raderar produkt med specifikt ID                        | Ja          |
| DELETE | /products/category=:id       |  Raderar samtliga produkter i kategori - anges med ID    | Ja          |
| DELETE | /products/category=:id       |  Raderar samtliga produkter av leverantör - anges med ID | Ja          |

#### Logg

CRUD-funktionalitet saknas eftersom rader läggs till automatiskt med triggers.

| Metod |  Endpoint            |  Beskrivning                                                                 | Token krävs |
| ----- | -------------------- | ---------------------------------------------------------------------------- | ----------- |
|  GET  | /logs                |  Hämtar de 15 senaste logg-raderna                                           | Nej         |
|  GET  | /logs/action=:action |  Hämtar de 15 senaste loggarna av specifik handling (insert, update, delete) | Nej         |

### Exempel

Anrop görs till `/products/id=3`.

```
[
  {
    "product_id": 3,
    "product_name": "Åsnes Nansen",
    "size": "170",
    "extra": "Rottefella BC Magnum",
    "amount": 3,
    "in_price": 2377,
    "out_price": 5999,
    "category_name": "Turskidor",
    "supplier_name": "BackCountry AB"
  }
]
```
