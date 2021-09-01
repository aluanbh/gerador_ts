"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModulesExport = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o arquivo com as exportações das entities
class NodeModulesExport {
    constructor(modulo, listaTabelas) {
        this.imports = []; // armazena os imports para a classe
        this.modules = []; // armazena os nomes das classes que ficam dentro do array "imports" do Nest 
        let nomeTabela = "";
        let nomeClasse = "";
        let nomeArquivo = "";
        for (let i = 0; i < listaTabelas.length; i++) {
            nomeTabela = listaTabelas[i];
            nomeClasse = lodash.camelCase(nomeTabela);
            nomeClasse = lodash.upperFirst(nomeClasse);
            nomeArquivo = lodash.replace(nomeTabela.toLowerCase(), new RegExp("_", "g"), "-");
            // monta o import
            this.imports.push("import { " + nomeClasse + "Module } from '../" + modulo + "/" + nomeArquivo + "/" + nomeArquivo + ".module';");
            // monta o nome da classe do array "imports" do Nest
            this.modules.push(nomeClasse + "Module,");
        }
    }
}
exports.NodeModulesExport = NodeModulesExport;
//# sourceMappingURL=node.modules.export.js.map