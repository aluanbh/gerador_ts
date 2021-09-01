"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterService = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o service do Flutter usando o mustache
class FlutterService {
    constructor(tabela) {
        // nome da classe e objeto principal
        this.class = lodash.camelCase(tabela);
        this.objetoPrincipal = this.class;
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // path
        this.path = lodash.replace(tabela.toLowerCase(), new RegExp("_", "g"), "-");
        // nomeArquivo
        this.nomeArquivo = tabela.toLowerCase();
    }
}
exports.FlutterService = FlutterService;
//# sourceMappingURL=flutter.service.js.map