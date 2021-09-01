"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeEntitiesExport = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o arquivo com as exportações das entities
class NodeEntitiesExport {
    constructor(modulo, listaTabelas) {
        this.imports = []; // armazena os imports para a classe
        let nomeTabela = "";
        let nomeClasse = "";
        let nomeArquivo = "";
        for (let i = 0; i < listaTabelas.length; i++) {
            nomeTabela = listaTabelas[i];
            nomeClasse = lodash.camelCase(nomeTabela);
            nomeClasse = lodash.upperFirst(nomeClasse);
            nomeArquivo = lodash.replace(nomeTabela.toLowerCase(), new RegExp("_", "g"), "-");
            // monta o export
            this.imports.push("export { " + nomeClasse + " } from './" + modulo + "/" + nomeArquivo + "/" + nomeArquivo + ".entity';");
        }
    }
}
exports.NodeEntitiesExport = NodeEntitiesExport;
//# sourceMappingURL=node.entities.export.js.map