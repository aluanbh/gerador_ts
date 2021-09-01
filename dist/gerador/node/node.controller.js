"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const lodash = require("lodash");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
/// classe base que ajuda a gerar o controller do Node usando o mustache
class NodeController {
    constructor(tabela, dataPacket, relacionamentos) {
        this.joinObj = []; // armazena os objetos - relacionamentos OneToOne
        this.joinList = []; // armazena as listas - relacionamentos OneToMany
        this.metodoInserir = []; // armazena o código para o método inserir
        this.metodoAlterar = []; // armazena o código para o método alterar
        this.metodoExcluir = []; // armazena o código para o método excluir
        this.imports = []; // armazena os demais imports para a classe
        // imports
        this.stringImportNest = '';
        this.usarExpress = false;
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.objetoPrincipal = this.class;
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // path
        this.path = lodash.replace(tabela.toLowerCase(), new RegExp("_", "g"), "-");
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
        // insere o import e define os métodos CUD
        if (this.usarExpress) {
            // imports
            this.imports.push("import { Request } from 'express';");
            this.stringImportNest = ", Delete, Param, Post, Put, Req";
            // método inserir
            this.metodoInserir.push("@Post()");
            this.metodoInserir.push("async inserir(@Req() request: Request) {");
            this.metodoInserir.push("\tlet objetoJson = request.body;");
            this.metodoInserir.push("\tlet " + this.objetoPrincipal + " = new " + this.class + "(objetoJson);");
            this.metodoInserir.push("\tconst retorno = await this.service.persistir(" + this.objetoPrincipal + ", 'I');");
            this.metodoInserir.push("\treturn retorno;");
            this.metodoInserir.push("}\n");
            // método alterar
            this.metodoInserir.push("@Put(':id')");
            this.metodoInserir.push("async alterar(@Param('id') id: number, @Req() request: Request) {");
            this.metodoInserir.push("\tlet objetoJson = request.body;");
            this.metodoInserir.push("\tlet " + this.objetoPrincipal + " = new " + this.class + "(objetoJson);");
            this.metodoInserir.push("\tconst retorno = await this.service.persistir(" + this.objetoPrincipal + ", 'A');");
            this.metodoInserir.push("\treturn retorno;");
            this.metodoInserir.push("}\n");
            // método excluir
            this.metodoInserir.push("@Delete(':id')");
            this.metodoInserir.push("async excluir(@Param('id') id: number) {");
            this.metodoInserir.push("\treturn this.service.excluirMestreDetalhe(id);");
            this.metodoInserir.push("}");
        }
    }
    tratarRelacionamentos(relacionamentos) {
        for (let i = 0; i < relacionamentos.length; i++) {
            let relacionamento = relacionamentos[i];
            let nomeTabelaRelacionamento = relacionamento.tabela;
            let nomeCampoAtributo = lodash.camelCase(nomeTabelaRelacionamento);
            let nomeCampoLista = 'lista' + lodash.upperFirst(nomeCampoAtributo);
            if (relacionamento.create || relacionamento.update || relacionamento.delete) {
                this.usarExpress = true;
            }
            let join = '';
            if (relacionamento.cardinalidade == '@OneToOne') {
                join = nomeCampoAtributo + ': { eager: true },';
                this.joinObj.push(join);
            }
            else if (relacionamento.cardinalidade == '@OneToMany') {
                join = nomeCampoLista + ': { eager: true },';
                this.joinList.push(join);
            }
        }
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=node.controller.js.map