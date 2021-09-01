"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPService = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o service do PHP usando o mustache
class PHPService {
    constructor(tabela, relacionamentos) {
        this.exclusaoObj = []; // relação de objetos para o método 'excluir filhos'
        this.exclusaoList = []; // relação de listas para o método 'excluir filhos'
        this.metodoExcluirCorpo = []; // armazena o código do corpo do método excluir
        this.metodoExcluirFilhosAbre = []; // armazena o código para o método excluir filhos
        this.metodoExcluirFilhosFecha = []; // armazena o código para o método excluir filhos
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // corpo do método excluir padrão
        this.metodoExcluirCorpo.push("parent::excluirBase($objeto);");
        // relacionamentos agregados ao Mestre
        if (relacionamentos != null && relacionamentos.length > 0) {
            this.tratarRelacionamentos(relacionamentos);
        }
    }
    tratarRelacionamentos(relacionamentos) {
        for (let i = 0; i < relacionamentos.length; i++) {
            let relacionamento = relacionamentos[i];
            let nomeTabelaRelacionamento = relacionamento.tabela;
            let nomeCampoAtributo = lodash.camelCase(nomeTabelaRelacionamento);
            let nomeCampoGetSet = lodash.upperFirst(nomeCampoAtributo);
            // verifica a cardinalidade para definir o código
            if (relacionamento.cardinalidade == '@OneToOne') {
                // exclusao de objetos
                this.exclusaoObj.push("$" + nomeCampoAtributo + " = $objeto->get" + nomeCampoGetSet + "();");
                this.exclusaoObj.push("if ($" + nomeCampoAtributo + " != null) {");
                this.exclusaoObj.push("\t$objeto->set" + nomeCampoGetSet + "(null);");
                this.exclusaoObj.push("\t$gerenteConexao->entityManager->remove($" + nomeCampoAtributo + ");");
                this.exclusaoObj.push("}\n");
            }
            else if (relacionamento.cardinalidade == '@OneToMany') {
                // exclusao de listas
                this.exclusaoList.push("$lista" + nomeCampoGetSet + " = $objeto->getLista" + nomeCampoGetSet + "();");
                this.exclusaoList.push("if ($lista" + nomeCampoGetSet + " != null) {");
                this.exclusaoList.push("\tfor ($i = 0; $i < count($lista" + nomeCampoGetSet + "); $i++) {");
                this.exclusaoList.push("\t\t$" + nomeCampoAtributo + " = $lista" + nomeCampoGetSet + "[$i];");
                this.exclusaoList.push("\t\t$gerenteConexao->entityManager->remove($" + nomeCampoAtributo + ");");
                this.exclusaoList.push("\t}\n");
                this.exclusaoList.push("}\n");
            }
        }
        // corpo do método excluir - redefinido
        this.metodoExcluirCorpo.length = 0;
        this.metodoExcluirCorpo.push(this.class + "Service::excluirFilhos($objeto);");
        this.metodoExcluirCorpo.push("parent::excluirBase($objeto);");
        // método excluir filhos
        this.metodoExcluirFilhosAbre.push('public static function excluirFilhos($objeto)');
        this.metodoExcluirFilhosAbre.push('{');
        this.metodoExcluirFilhosAbre.push('\t$gerenteConexao = GerenteConexao::getInstance();');
        this.metodoExcluirFilhosAbre.push('');
        this.metodoExcluirFilhosFecha.push('}');
    }
}
exports.PHPService = PHPService;
//# sourceMappingURL=php.service.js.map