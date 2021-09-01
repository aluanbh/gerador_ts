"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaService = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o service do Java usando o mustache
class JavaService {
    constructor(tabela, modulo) {
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // package
        this.modulo = modulo;
    }
}
exports.JavaService = JavaService;
//# sourceMappingURL=java.service.js.map