"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModule = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o module do Node usando o mustache
class NodeModule {
    constructor(tabela) {
        // nome da classe
        this.classFile = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.classFile);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // path
        this.path = lodash.replace(tabela.toLowerCase(), new RegExp("_", "g"), "-");
    }
}
exports.NodeModule = NodeModule;
//# sourceMappingURL=node.module.js.map