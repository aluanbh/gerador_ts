"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterAbaMestreDetalhePage = void 0;
const lodash = require("lodash");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
/// classe base que ajuda a gerar a DetalhePage do Flutter usando o mustache
class FlutterAbaMestreDetalhePage {
    constructor(tabela, dataPacket) {
        this.listTileData = []; // armazena a lista de listTileData
        this.imports = []; // armazena os demais imports para a classe
        // imports diversos
        this.importConstantes = false;
        this.importData = false;
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.objetoPrincipal = this.class;
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
        // nomeArquivo
        this.nomeArquivo = tabela.toLowerCase();
        // título da janela
        this.tituloJanela = lodash.startCase(this.class);
        // laço nos campos da tabela para montar a página
        for (let i = 0; i < dataPacket.length; i++) {
            // define o nome do campo
            let nomeCampo = dataPacket[i].Field;
            let nomeCampoTabela = nomeCampo.toUpperCase();
            let nomeCampoAtributo = lodash.camelCase(nomeCampo);
            // pega o objeto JSON de comentário - se não houver, este campo não será renderizado na janela
            if (dataPacket[i].Comment != '') {
                try {
                    this.objetoJsonComentario = new comentario_der_json_model_1.ComentarioDerJsonModel(this.table, dataPacket[i].Comment);
                    // pega o valor do campo de lookup que deve ser exibido no lugar do ID da chave estrangeira
                    let campoLookup = '';
                    if (nomeCampoTabela.includes('ID_')) {
                        if (this.objetoJsonComentario.campoLookup != null && this.objetoJsonComentario.campoLookup != '') {
                            let tabelaMestre = lodash.replace(nomeCampoTabela, 'ID_', '');
                            tabelaMestre = lodash.camelCase(tabelaMestre);
                            campoLookup = tabelaMestre + "?." + this.objetoJsonComentario.campoLookup;
                        }
                    }
                    // se o campoLookup for diferente de vazio, ele deve ser utilizado no lugar do campoAtributo
                    if (campoLookup != '') {
                        nomeCampoAtributo = campoLookup;
                    }
                    // listTileData
                    this.listTileData.push("ViewUtilLib.getListTileDataDetalhePage(");
                    if (dataPacket[i].Type.includes('decimal')) {
                        this.importConstantes = true;
                        let tipoControle = this.objetoJsonComentario.tipoControle;
                        let formatoDecimais = lodash.camelCase("formatoDecimal" + tipoControle.mascara);
                        let casasDecimais = lodash.camelCase("decimais" + tipoControle.mascara);
                        this.listTileData.push("\t" + this.objetoPrincipal + "." + nomeCampoAtributo + " != null ? Constantes." + formatoDecimais + ".format(" + this.objetoPrincipal + "." + nomeCampoAtributo + ") : 0.toStringAsFixed(Constantes." + casasDecimais + "), '" + this.objetoJsonComentario.labelText + "'),");
                    }
                    else if (dataPacket[i].Type.includes('date')) {
                        this.importData = true;
                        this.listTileData.push("\t" + this.objetoPrincipal + "." + nomeCampoAtributo + " != null ? DateFormat('dd/MM/yyyy').format(" + this.objetoPrincipal + "." + nomeCampoAtributo + ") : '', '" + this.objetoJsonComentario.labelText + "'),");
                    }
                    else if (dataPacket[i].Type.includes('int')) {
                        this.listTileData.push("\t" + this.objetoPrincipal + "." + nomeCampoAtributo + "?.toString() ?? '', '" + this.objetoJsonComentario.labelText + "'),");
                    }
                    else {
                        this.listTileData.push("\t" + this.objetoPrincipal + "." + nomeCampoAtributo + " ?? '', '" + this.objetoJsonComentario.labelText + "'),");
                    }
                }
                catch (erro) {
                    this.objetoJsonComentario = null;
                }
            }
        }
        // imports
        if (this.importConstantes) {
            this.imports.push("import 'package:fenix/src/infra/constantes.dart';");
        }
        if (this.importData) {
            this.imports.push("import 'package:intl/intl.dart';");
        }
    }
}
exports.FlutterAbaMestreDetalhePage = FlutterAbaMestreDetalhePage;
//# sourceMappingURL=flutter.aba.mestre.detalhe.page.js.map