const express = require("express");
const fs = require("fs/promises");

const app = express();
const PORT = 3000;

app.use(express.json());

async function adatBeolvas() {
    const adat = await fs.readFile(
        "./data/adatbazis.json",
        "utf8"
    );

    return JSON.parse(adat);
}

async function adatMent(adat) {
    await fs.writeFile(
        "./data/adatbazis.json",
        JSON.stringify(adat, null, 2)
    );
}

// Összes osztály lekérdezése
app.get("/osztalyok", async (req, res) => {
    try {
        const adat = await adatBeolvas();
        res.json(adat.osztalyok);
    } catch (error) {
        res.status(500).json({
            hiba: "Szerverhiba"
        });
    }
});

// Új osztály létrehozása
app.post("/osztalyok", async (req, res) => {
    try {
        const { nev, szak, evfolyam } = req.body;

        if (!nev || !szak || !evfolyam) {
            return res.status(400).json({
                hiba: "Hiányzó adatok"
            });
        }

        const adat = await adatBeolvas();

        const ujId =
            adat.osztalyok.length > 0
                ? Math.max(...adat.osztalyok.map(o => o.id)) + 1
                : 1;

        const ujOsztaly = {
            id: ujId,
            nev,
            szak,
            evfolyam
        };

        adat.osztalyok.push(ujOsztaly);

        await adatMent(adat);

        res.status(201).json(ujOsztaly);

    } catch (error) {
        res.status(500).json({
            hiba: "Szerverhiba"
        });
    }
});

app.listen(PORT, () => {
    console.log(`A szerver fut a ${PORT} porton`);
});