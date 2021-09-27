import express from "express";
import exphbs from "express-handlebars";
import { connect, query, end } from "./db.js";

const PORT = 3000;
const WEB = "web";

const app = express();
// HELPERIAI KVIECIAMI I PAGALBA SUFORMATUOTI DATA
app.engine("handlebars", exphbs({
    helpers: {
        dateFormat: (date) => {
            if (date instanceof Date) {
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                return `${year}-${month}-${day}`;
            }
            return date;
        }
    }
}));
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

