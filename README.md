# Eksamens-App

Dette er en React-baseret webapplikation designet til at hjælpe eksaminatorer med at administrere og afholde mundtlige eksamener. Applikationen er bygget som en Single Page Application (SPA) med TypeScript og Vite.

**GitLab:**

## Features

- **Dashboard:** Et centralt overblik over kommende eksamener.
- **Opret Eksamen**: Mulighed for at oprette nye eksamener med specifikke detaljer som kursusnavn, dato, antal spørgsmål og eksamenstid.
- **Tilføj Studerende:** Tilknyt studerende til en specifik eksamen i den rækkefølge, de skal eksamineres i.
- **Interaktiv Eksamensafholdelse:** En dedikeret side til selve eksamen, som inkluderer:
  - Tilfældig trækning af spørgsmål.
  - Nedtællingstimer.
  - Mulighed for at tage noter undervejs.
  - Registrering af karakter og faktisk eksamenstid.
  - Automatisk logik, der genoptager fra den korrekte studerende.
- **Eksamenshistorik:** En oversigt over afsluttede eksamener med mulighed for at se detaljerede resultater pr. studerende samt et beregnet karaktergennemsnit.
- **Filtrering og Sortering:** Avancerede muligheder for at filtrere og sortere i eksamenshistorikken.

## Teknologier

- **Frontend:** React, TypeScript, Vite
- **Routing:** React Router
- **Styling:** CSS Modules
- **Backend (simuleret):** json-server

## Kørsel af Applikationen

Der er to måder at køre applikationen på: lokalt til udvikling eller via Docker for en nem og isoleret opsætning.

**Metode 1: Lokal Udvikling**
**Forkrav:**

- Node.js (v16 eller nyere)
- npm (følger med Node.js)

**Installation og Kørsel:**

1. Klon/installer projektet og installer afhængigheder:

```bash
git clone <din-repository-url>
cd eksamens-app
npm install
```

2. **Start den simulerede backend-server:**
   Åbn en ny terminal og kør følgende kommando fra projektets rodmappe. Lad denne terminal køre i baggrunden.

```bash
npx json-server --watch db.json --port 3001
```

3. Start React-applikationen:
   I din oprindelige terminal, kør:

```bash
npm run dev
```

Applikationen er nu tilgængelig på http://localhost:5173 (eller en anden port, som Vite angiver).

**Metode 2: Kørsel med Docker (Anbefalet til præsentation)**
Denne metode bygger og kører både frontend og backend i isolerede Docker-containere. Det er den nemmeste måde at køre appen på en anden maskine.

**Forkrav:**

Docker Desktop

**Kørsel:**

1. Klon/installer projektet:

```bash
git clone <din-repository-url>
cd eksamens-app
```

2. Byg og start containerne:
   Kør følgende kommando fra projektets rodmappe. Docker vil automatisk downloade, bygge og starte alt, hvad der er nødvendigt.

```bash
docker-compose up --build
```

- Første gang kan dette tage et par minutter. Efterfølgende starter det meget hurtigere.

3. Åbn applikationen:
   Applikationen er nu tilgængelig på `http://localhost:8080`.

4. Stop applikationen:
   Tryk `Ctrl + C` i terminalen for at stoppe containerne.

## Brugerflow til Test

For at teste appens kernefunktionalitet kan du følge dette flow:

1. Opret en eksamen:

- På Dashboard-siden, tryk på "Opret Ny Eksamen".
- Udfyld formularen og tryk "Opret".

2. Tilføj studerende:

- Find den nye eksamen på dashboardet.

- Tryk på "Tilføj Studerende" og tilføj 2-3 studerende.

- Klik på selve kortet for at se listen af tilmeldte studerende i en modal.

3. Afhold eksamen:

- Tryk på "Start Eksamen" for den oprettede eksamen.

- For den første studerende:
  - Tryk "Træk Spørgsmål".
  - Tryk "Start Eksamination". Timeren starter.
  - Indtast noter i tekstfeltet.
  - Tryk "Slut Eksamination".
  - Vælg en karakter fra dropdown-menuen.
  - Tryk "Gem og Næste Studerende".

4. Genoptag eksamen:

- Appen viser nu den næste studerende i rækken.
- Gå tilbage til dashboardet via "Tilbage til Dashboard"-linket.
- Klik "Start Eksamen" igen for den samme eksamen. Bemærk, at appen korrekt genoptager fra den studerende, der endnu ikke er blevet bedømt.

5. Afslut og Arkivér:

- Gennemfør eksamen for alle resterende studerende.

- Når alle er bedømt, vil du få mulighed for at trykke "Afslut og Arkivér Eksamen". Gør dette.

6. Tjek Historik:

- Naviger til Historik-siden.
- Find den netop afsluttede eksamen.
- Test filter- og sorteringsmulighederne.
  -Klik på kortet for at se en tabel med de endelige resultater.
