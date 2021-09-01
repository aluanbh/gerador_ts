"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelphiWebModule = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o arquivo WebModule
class DelphiWebModule {
    constructor(modulo, listaTabelas) {
        this.units = []; // units de controller
        this.addController = []; // addController
        let nomeTabela = "";
        let nomeClasse = "";
        let path = "";
        for (let i = 0; i < listaTabelas.length; i++) {
            nomeTabela = listaTabelas[i];
            nomeClasse = lodash.camelCase(nomeTabela);
            nomeClasse = lodash.upperFirst(nomeClasse);
            path = lodash.replace(nomeTabela.toLowerCase(), new RegExp("_", "g"), "-");
            // unit
            this.units.push(nomeClasse + "Controller,");
            // addController
            this.addController.push("FEngine.AddController(T" + nomeClasse + "Controller);");
        }
    }
}
exports.DelphiWebModule = DelphiWebModule;
//# sourceMappingURL=delphi.webmodule.js.map