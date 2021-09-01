"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabelaRotas = void 0;
const tabela_controller_1 = require("../controller/tabela.controller");
class TabelaRotas {
    constructor() {
        this.controller = new tabela_controller_1.TabelaController();
    }
    routes(app) {
        app.route('/tabela')
            .get(this.controller.consultarLista);
        app.route('/tabela/:nomeTabela')
            .get(this.controller.consultarListaCampos);
        app.route('/:linguagem/:nomeTabela/:modulo?')
            .get(this.controller.gerarFontes);
        app.route('/gerar/todos/arquivos/:linguagem/:modulo?')
            .get(this.controller.gerarTudo);
        app.route('/laco/tabela/node/:modulo')
            .get(this.controller.gerarArquivosLacoTabelaNode);
        app.route('/laco/tabela/php/:modulo')
            .get(this.controller.gerarArquivosLacoTabelaPHP);
        app.route('/laco/tabela/delphi/:modulo')
            .get(this.controller.gerarArquivosLacoTabelaDelphi);
        app.route('/laco/tabela/flutter/:modulo')
            .get(this.controller.gerarArquivosLacoTabelaFlutter);
    }
}
exports.TabelaRotas = TabelaRotas;
//# sourceMappingURL=tabela.rotas.js.map