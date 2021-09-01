"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpRepository = void 0;
const lodash = require("lodash");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
/// classe base que ajuda a gerar o repositório do CSharp usando o mustache
class CSharpRepository {
    constructor(tabela, dataPacket, relacionamentos) {
        this.includes = []; // armazena os includes
        this.notIncludes = []; // armazena os notIncludes - objetos que não devem persistir junto com o mestre
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.objetoPrincipal = this.class;
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        for (let i = 0; i < dataPacket.length; i++) {
            // define o nome do campo
            let nomeCampo = dataPacket[i].Field;
            let nomeCampoTabela = nomeCampo.toUpperCase();
            if (nomeCampoTabela.includes('ID_') && dataPacket[i].Comment != '') {
                let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel('', dataPacket[i].Comment);
                objeto.tabela = lodash.replace(nomeCampoTabela, 'ID_', '');
                if (this.relacionamentosDetalhe == null) {
                    this.relacionamentosDetalhe = new Array;
                }
                this.relacionamentosDetalhe.push(objeto);
            }
        }
        // relacionamentos agregados ao Mestre
        if (relacionamentos != null) {
            this.tratarRelacionamentos(relacionamentos);
        }
        // relacionamentos FK encontrados na tabela
        if (this.relacionamentosDetalhe != null) {
            this.tratarRelacionamentos(this.relacionamentosDetalhe);
        }
    }
    tratarRelacionamentos(relacionamentos) {
        for (let i = 0; i < relacionamentos.length; i++) {
            let relacionamento = relacionamentos[i];
            let nomeTabelaRelacionamento = relacionamento.tabela;
            let nomeCampoAtributo = lodash.camelCase(nomeTabelaRelacionamento);
            nomeCampoAtributo = lodash.upperFirst(nomeCampoAtributo);
            let inc = '';
            if (relacionamento.cardinalidade == '@OneToOne') {
                inc = '.Include(' + this.objetoPrincipal + ' => ' + this.objetoPrincipal + '.' + nomeCampoAtributo + ')';
            }
            else if (relacionamento.cardinalidade == '@OneToMany') {
                inc = '.Include(' + this.objetoPrincipal + ' => ' + this.objetoPrincipal + '.Lista' + nomeCampoAtributo + ')';
            }
            this.includes.push(inc);
            // verifica se o objeto deve ser persistido
            if (!relacionamento.create) {
                this.notIncludes.push("if (objeto." + nomeCampoAtributo + " != null)");
                this.notIncludes.push("{");
                this.notIncludes.push("\tRepositoryContext.Entry(objeto." + nomeCampoAtributo + ").State = EntityState.Unchanged; //não queremos inserir o objeto vinculado");
                this.notIncludes.push("} else");
                this.notIncludes.push("{");
                this.notIncludes.push("\tobjeto.Id" + nomeCampoAtributo + " = null;");
                this.notIncludes.push("}");
            }
        }
    }
}
exports.CSharpRepository = CSharpRepository;
//# sourceMappingURL=csharp.repository.js.map