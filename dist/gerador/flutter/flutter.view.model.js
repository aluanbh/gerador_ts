"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterViewModel = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o Viewmodel do Flutter usando o mustache
class FlutterViewModel {
    constructor(tabela) {
        // nome da classe e objeto principal
        this.class = lodash.camelCase(tabela);
        this.objetoPrincipal = this.class;
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // nomeArquivo
        this.nomeArquivo = tabela.toLowerCase();
    }
}
exports.FlutterViewModel = FlutterViewModel;
//# sourceMappingURL=flutter.view.model.js.map