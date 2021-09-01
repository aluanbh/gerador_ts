"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpIRepository = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar a interface do repositório do CSharp usando o mustache
class CSharpIRepository {
    constructor(tabela) {
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
    }
}
exports.CSharpIRepository = CSharpIRepository;
//# sourceMappingURL=csharp.irepository.js.map