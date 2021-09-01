"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpWrapperContext = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o controller do CSharp usando o mustache
class CSharpWrapperContext {
    constructor(tabela) {
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.objetoPrincipal = this.class;
        this.class = lodash.upperFirst(this.class);
    }
}
exports.CSharpWrapperContext = CSharpWrapperContext;
//# sourceMappingURL=csharp.wrapper.context.js.map