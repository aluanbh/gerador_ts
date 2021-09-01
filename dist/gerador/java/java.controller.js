"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaController = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o controller do Java usando o mustache
class JavaController {
    constructor(tabela, modulo) {
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // path
        this.path = lodash.replace(tabela.toLowerCase(), new RegExp("_", "g"), "-");
        // package
        this.modulo = modulo;
    }
}
exports.JavaController = JavaController;
//# sourceMappingURL=java.controller.js.map