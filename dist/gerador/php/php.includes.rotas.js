"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPIncludesRotas = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o arquivo com os includes
class PHPIncludesRotas {
    constructor(modulo, listaTabelas) {
        this.includesController = []; // includes controller
        this.includesModel = []; // includes model
        this.includesService = []; // includes service
        this.rotas = []; // rotas
        let nomeTabela = "";
        let nomeClasse = "";
        let path = "";
        for (let i = 0; i < listaTabelas.length; i++) {
            nomeTabela = listaTabelas[i];
            nomeClasse = lodash.camelCase(nomeTabela);
            nomeClasse = lodash.upperFirst(nomeClasse);
            path = lodash.replace(nomeTabela.toLowerCase(), new RegExp("_", "g"), "-");
            // controller
            this.includesController.push("include '" + modulo + "/" + nomeClasse + "Controller.php';");
            // model
            this.includesModel.push("include '" + modulo + "/" + nomeClasse + ".php';");
            // service
            this.includesService.push("include '" + modulo + "/" + nomeClasse + "Service.php';");
            // rota
            this.rotas.push("// " + path);
            this.rotas.push("$app->get('/" + path + "[/]', \\" + nomeClasse + "Controller::class . ':consultarLista');");
            this.rotas.push("$app->get('/" + path + "/{id}', \\" + nomeClasse + "Controller::class . ':consultarObjeto');");
            this.rotas.push("$app->post('/" + path + "', \\" + nomeClasse + "Controller::class . ':inserir');");
            this.rotas.push("$app->put('/" + path + "/{id}', \\" + nomeClasse + "Controller::class . ':alterar');");
            this.rotas.push("$app->delete('/" + path + "/{id}', \\" + nomeClasse + "Controller::class . ':excluir');");
            this.rotas.push("$app->options('/" + path + "[/{id}]', \\ControllerBase::class . ':browserOptionsRetornarResponse');");
            this.rotas.push("");
        }
    }
}
exports.PHPIncludesRotas = PHPIncludesRotas;
//# sourceMappingURL=php.includes.rotas.js.map