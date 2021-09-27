import express from "express";
import exphbs from "express-handlebars";
import { connect, query, end } from "./db.js";

const PORT = 3000;
const WEB = "web";

const app = express();
// HELPERIAI KVIECIAMI I PAGALBA SUFORMATUOTI DATA I STRINGA
app.engine("handlebars", exphbs({
    helpers: {
        dateFormat: (date) => {
            if (date instanceof Date) {
                let year = "0000" + date.getFullYear();
                year = year.substr(- 4);
                let month = "00" + (date.getMonth() + 1);
                // get month grazina nuo 0 iki 11 skaicius del to pridedame + 1
                month = month.substr(- 2);
                let day = "00" + date.getDate();
                day = day.substr(- 2);
                return `${year}-${month}-${day}`;
            }
            return date;
        }
    }
}));
// HELPERIU PABAIGA
app.set("view engine", "handlebars");

app.use(express.static(WEB, {
    index: ["index.html"],
}));
app.use(express.urlencoded({
    extended: true,
}));
// ent pointas
app.get("/zmones", async (req, res) => {
    let conn;
    try {
        conn = await connect();
        const { results: zmones } = await query(conn, "select * from zmones",);
        console.log(zmones);
        res.render("Zmones", { zmones });
    } catch (err) {
        res.render("Klaida", { err });
    } finally {
        if (conn) {
            try {
                await end(conn);
            } catch (e) {
                console.log("Klaida atsijungiant", e);
            }
        }
    }
});


app.listen(PORT, () => {
    console.log(`Zmones app listening at http://localhost:${PORT}`);
});

