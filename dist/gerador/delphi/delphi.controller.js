"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelphiController = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o controller do Delphi usando o mustache
class DelphiController {
    constructor(tabela) {
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // path
        this.path = lodash.replace(tabela.toLowerCase(), new RegExp("_", "g"), "-");
    }
}
exports.DelphiController = DelphiController;
//# sourceMappingURL=delphi.controller.js.map