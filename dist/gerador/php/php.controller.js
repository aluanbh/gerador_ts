"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPController = void 0;
const lodash = require("lodash");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
/// classe base que ajuda a gerar o controller do PHP usando o mustache
class PHPController {
    constructor(tabela, dataPacket, relacionamentos) {
        this.filhosVinculadosObj = []; // relação de objetos para o método 'excluir filhos'
        this.filhosVinculadosList = []; // relação de listas para o método 'excluir filhos'
        this.mestresVinculadosInclusao = []; // armazena o código de configuração dos objetos mestre vinculados para o método inserir
        this.mestresVinculadosAlteracao = []; // armazena o código de configuração dos objetos mestre vinculados para o método alterar
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        this.excluiFilhosString = '';
        // acha os relacionamentos PK que tenham campos locais para anexar os objetos no método inserir
        for (let i = 0; i < dataPacket.length; i++) {
            // define o nome do campo
            let nomeCampo = dataPacket[i].Field;
            let nomeCampoTabela = nomeCampo.toUpperCase();
            if (nomeCampoTabela.includes('ID_') && dataPacket[i].Comment != '') {
                let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel('', dataPacket[i].Comment);
                if (objeto.side == 'Local') {
                    objeto.tabela = lodash.replace(nomeCampoTabela, 'ID_', '');
                    let objetoMestre = lodash.camelCase(objeto.tabela);
                    let classeMestre = lodash.upperFirst(objetoMestre);
                    this.mestresVinculadosInclusao.push("$objEntidade->set" + classeMestre + "(" + classeMestre + "Service::consultarObjeto($objJson->" + objetoMestre + "->id));");
                    this.mestresVinculadosAlteracao.push("$objBanco->set" + classeMestre + "(" + classeMestre + "Service::consultarObjeto($objJson->" + objetoMestre + "->id));");
                }
            }
        }
        // relacionamentos agregados ao Mestre
        if (relacionamentos != null && relacionamentos.length > 0) {
            this.tratarRelacionamentos(relacionamentos);
        }
    }
    tratarRelacionamentos(relacionamentos) {
        // chama o método excluir
        this.excluiFilhosString = this.class + "Service::excluirFilhos($objBanco);";
        for (let i = 0; i < relacionamentos.length; i++) {
            let relacionamento = relacionamentos[i];
            let nomeTabelaRelacionamento = relacionamento.tabela;
            let nomeCampoAtributo = lodash.camelCase(nomeTabelaRelacionamento);
            let nomeCampoGetSet = lodash.upperFirst(nomeCampoAtributo);
            // verifica a cardinalidade para definir o código
            if (relacionamento.cardinalidade == '@OneToOne') {
                // exclusao de objetos
                this.filhosVinculadosObj.push("$" + nomeCampoAtributo + " = $objEntidade->get" + nomeCampoGetSet + "();");
                this.filhosVinculadosObj.push("if ($" + nomeCampoAtributo + " != null) {");
                this.filhosVinculadosObj.push("\t$" + nomeCampoAtributo + "->set" + this.class + "($objBanco);");
                this.filhosVinculadosObj.push("\t$objBanco->set" + nomeCampoGetSet + "($" + nomeCampoAtributo + ");");
                this.filhosVinculadosObj.push("}\n");
            }
            else if (relacionamento.cardinalidade == '@OneToMany') {
                // exclusao de listas
                this.filhosVinculadosList.push("$lista" + nomeCampoGetSet + " = $objEntidade->getLista" + nomeCampoGetSet + "();");
                this.filhosVinculadosList.push("if ($lista" + nomeCampoGetSet + " != null) {");
                this.filhosVinculadosList.push("\t$objBanco->setLista" + nomeCampoGetSet + "($lista" + nomeCampoGetSet + ");");
                this.filhosVinculadosList.push("}\n");
            }
        }
    }
}
exports.PHPController = PHPController;
//# sourceMappingURL=php.controller.js.map