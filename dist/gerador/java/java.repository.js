"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaRepository = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o repository do Java usando o mustache
class JavaRepository {
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
exports.JavaRepository = JavaRepository;
//# sourceMappingURL=java.repository.js.map