# Receptappen

Detta projekt är en fullstack-applikation med backend-API, frontend-gränssnitt, tester och GitHub Actions-pipeline enligt kursens DevOps-krav.

---

## Funktionalitet

Applikationen hanterar resurser av typen **Recipe** med följande fält:

- id
- title
- ingredients
- instructions
- category
- cookingTime

Stöd för full CRUD:

- GET alla recept
- GET ett recept
- POST nytt recept
- PUT uppdatera recept
- DELETE ta bort recept

Frontend låter användaren:

- Lista recept
- Skapa nytt recept
- Redigera recept
- Ta bort recept

---

## Startinstruktioner

### Backend

```
cd backend
npm install
npm start
```

Backend körs på: http://localhost:3000

### Frontend

```
cd frontend
npm install
npm run dev
```

Frontend körs på: http://localhost:5173

---

## Tester

### Backend (Jest)

```
cd backend
npm test
```

### API-test (Newman)

```
cd backend
npm run test:api
```

### Frontend E2E (Playwright)

```
cd frontend
npx playwright test
```

---

## CI/CD

GitHub Actions workflow finns i:

```
.github/workflows/ci.yml
```

Pipeline kör automatiskt:

- Jest (backend)
- Newman (API)
- Playwright (frontend)

Krav för merge: pipeline måste vara grön.

---

## Branch Protection

Branch `main` är skyddad med:

- Pull request krävs
- CI måste passera innan merge

---

Projektet är komplett, testat och redo att användas eller vidareutvecklas.
