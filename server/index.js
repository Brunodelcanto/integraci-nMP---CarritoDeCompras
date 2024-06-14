import express from "express";
import cors from "cors";

//SDK de Mercado Pago
import {MercadoPagoConfig, Preference} from "mercadopago";
//agrega credenciales
const client = new MercadoPagoConfig({
    accessToken: "TEST-5350168245164493-031511-d887525864e718beee48a3a5077aac7b-1727320827",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) =>{
    try{
        const body  = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "http://127.0.0.1:5500/client/",
                failure: "http://127.0.0.1:5500/client/",
                pending: "http://127.0.0.1:5500/client/",
            },
            auto_return: "approved",
        };
        const preference = new Preference(client);
        const result = await preference.create({ body })
        // const preference = new Preference(client);
        // const result = await preference.create({ body });
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :("
        });
    }
});

app.listen(port, ()=>{
    console.log(`El servidor esta corriendo en el puerto: ${port}`);
});
