"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NHibernateHBM = void 0;
const lodash = require("lodash");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
/// classe base que ajuda a gerar o model do CSharp usando o mustache
class NHibernateHBM {
    constructor(tabela, dataPacket, relacionamentos) {
        this.atribut = []; // armazena os Atributos da classe
        this.atributObj = []; // armazena os objetos - relacionamentos OneToOne
        this.atributList = []; // armazena as listas - relacionamentos OneToMany
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // atributos e gettersSetters
        for (let i = 0; i < dataPacket.length; i++) {
            // define o nome do campo
            let nomeCampo = dataPacket[i].Field;
            let nomeCampoTabela = nomeCampo.toUpperCase();
            let nomeCampoAtributo = lodash.camelCase(nomeCampo);
            let nomeCampoGetSet = lodash.upperFirst(nomeCampoAtributo);
            if (nomeCampoTabela.includes('ID_') && dataPacket[i].Comment != '') {
                let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel('', dataPacket[i].Comment);
                objeto.tabela = lodash.replace(nomeCampoTabela, 'ID_', '');
                if (this.relacionamentosDetalhe == null) {
                    this.relacionamentosDetalhe = new Array;
                }
                this.relacionamentosDetalhe.push(objeto);
            }
            else {
                if (nomeCampoTabela != 'ID') {
                    this.atribut.push('<property name="' + nomeCampoGetSet + '" column="' + nomeCampoTabela + '" />');
                }
            }
        }
        // relacionamentos agregados ao Mestre
        if (relacionamentos != null) {
            this.tratarRelacionamentos(relacionamentos);
        }
        // relacionamentos agregados ao Detalhe
        if (this.relacionamentosDetalhe != null) {
            this.tratarRelacionamentos(this.relacionamentosDetalhe);
        }
    }
    tratarRelacionamentos(relacionamentos) {
        for (let i = 0; i < relacionamentos.length; i++) {
            let relacionamento = relacionamentos[i];
            let nomeTabelaRelacionamento = relacionamento.tabela;
            let nomeCampoAtributo = lodash.camelCase(nomeTabelaRelacionamento);
            let nomeCampoGetSet = lodash.upperFirst(nomeCampoAtributo);
            let classeMestreGetSet = lodash.upperFirst(relacionamento.classeMestre);
            // verifica a cardinalidade para definir o nome do Field
            if (relacionamento.cardinalidade == '@OneToOne') {
                if (relacionamento.classeMestre == "") { //se for vazio, o relacionamento foi encontrado na classe de detalhe e deve ser mapeado como tal
                    if (relacionamento.side == 'Local') {
                        this.atributObj.push('<many-to-one name="' + nomeCampoGetSet + '" class="' + nomeCampoGetSet + '" column="ID_' + relacionamento.tabela + '" />');
                    }
                    else {
                        this.atributObj.push('<many-to-one name="' + nomeCampoGetSet + '" class="' + nomeCampoGetSet + '" column="ID_' + relacionamento.tabela + '" unique="true" />');
                    }
                }
                else {
                    if (relacionamento.side == 'Local') {
                        this.atributObj.push('<one-to-one name="' + nomeCampoGetSet + '" class="' + nomeCampoGetSet + '" cascade="all"/>');
                    }
                    else {
                        this.atributObj.push('<one-to-one name="' + nomeCampoGetSet + '" class="' + nomeCampoGetSet + '" property-ref="' + classeMestreGetSet + '" cascade="all"/>');
                    }
                }
            }
            else if (relacionamento.cardinalidade == '@OneToMany') {
                if (relacionamento.classeMestre == "") { //se for vazio, o relacionamento foi encontrado na classe de detalhe e deve ser mapeado como tal
                    this.atributList.push('<many-to-one name="' + nomeCampoGetSet + '" class="' + nomeCampoGetSet + '" column="ID_' + relacionamento.tabela + '" />');
                }
                else {
                    this.atributList.push('<bag name="Lista' + nomeCampoGetSet + '" table="' + nomeTabelaRelacionamento + '" cascade="all-delete-orphan" inverse="true">');
                    this.atributList.push('  <key column="ID_' + this.table + '"/>');
                    this.atributList.push('  <one-to-many class="' + nomeCampoGetSet + '"/>');
                    this.atributList.push('</bag>');
                }
            }
        }
    }
}
exports.NHibernateHBM = NHibernateHBM;
//# sourceMappingURL=nhibernate.hbm.js.map