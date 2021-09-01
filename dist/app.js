"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
class App {
    constructor() {
        // iniciando o express
        this.app = express();
        // faz o parse do content-type do request - tipo: application/json
        this.app.use(bodyParser.json());
        // faz o parse do content-type do request - tipo: application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: true })); //extended: true - pode enviar objetos aninhados
        // adicionar uma rota simples padrão
        this.app.get('/', (req, res) => {
            res.json({ mensagem: "Olá, você está no Gerador de Código do OLI System ERP!" });
        });
        // rotas
        /* this.tabelaRotas = new TabelaRotas();
        this.tabelaRotas.routes(this.app); */
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map