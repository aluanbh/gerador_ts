"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeradorFlutterAba = void 0;
const fs = require("fs");
const Mustache = require("mustache");
const tabela_service_1 = require("../../service/tabela.service");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
const gerador_base_1 = require("../../gerador/gerador.base");
const flutter_aba_detalhe_lista_page_1 = require("./flutter.aba.detalhe.lista.page");
const flutter_aba_detalhe_detalhe_page_1 = require("./flutter.aba.detalhe.detalhe.page");
const flutter_aba_detalhe_persiste_page_1 = require("./flutter.aba.detalhe.persiste.page");
const flutter_aba_mestre_lista_page_1 = require("./flutter.aba.mestre.lista.page");
const flutter_aba_mestre_detalhe_page_1 = require("./flutter.aba.mestre.detalhe.page");
const flutter_aba_mestre_persiste_page_1 = require("./flutter.aba.mestre.persiste.page");
const flutter_aba_mestre_persiste_page_one_to_one_1 = require("./flutter.aba.mestre.persiste.page.one.to.one");
const flutter_aba_mestre_page_1 = require("./flutter.aba.mestre.page");
class GeradorFlutterAba extends gerador_base_1.GeradorBase {
    constructor() {
        super();
        this.caminhoFontes = 'c:/t2ti/gerador.codigo/fontes/flutter/';
        this.arquivoTemplateAbaDetalheListaPage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaDetalheListaPage.mustache';
        this.arquivoTemplateAbaDetalheDetalhePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaDetalheDetalhePage.mustache';
        this.arquivoTemplateAbaDetalhePersistePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaDetalhePersistePage.mustache';
        this.arquivoTemplateAbaMestreListaPage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaMestreListaPage.mustache';
        this.arquivoTemplateAbaMestreDetalhePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaMestreDetalhePage.mustache';
        this.arquivoTemplateAbaMestrePersistePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaMestrePersistePage.mustache';
        this.arquivoTemplateAbaMestrePersistePageOneToOne = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaMestrePersistePageOneToOne.mustache';
        this.arquivoTemplateAbaMestrePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.AbaMestrePage.mustache';
        this.relacionamentos = new Array;
        this.relacionamentosOneToOne = new Array;
    }
    gerarArquivos(tabela, result) {
        const _super = Object.create(null, {
            criarDiretorio: { get: () => super.criarDiretorio }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // nome da tabela
            this.tabela = tabela.toUpperCase();
            // criar diretório
            let retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe');
            if (retorno != true) {
                return result(null, retorno);
            }
            // procura pelas tabelas agregadas para criar os relacionamentos de primeiro nível
            retorno = yield this.gerarAgregadosPrimeiroNivel();
            if (retorno != true) {
                return result(null, retorno);
            }
            // gera os arquivos para a tabela principal
            retorno = yield this.gerarArquivosTabelaPrincipal();
            if (retorno != true) {
                return result(null, retorno);
            }
            // retorna mensagem OK
            result({ mensagem: "Arquivos gerados com sucesso!" }, null);
        });
    }
    /**
     * Encontra todas as tabelas agregadas a partir da chave estrangeira e gera as páginas filhas
     */
    gerarAgregadosPrimeiroNivel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lista = yield tabela_service_1.TabelaService.consultarAgregados(this.tabela);
                for (let index = 0; index < lista.length; index++) {
                    this.tabelaAgregada = lista[index].TABLE_NAME;
                    // pega os campos para a tabela                
                    let retorno = yield this.pegarCampos(this.tabelaAgregada);
                    if (retorno != true) {
                        return retorno;
                    }
                    // gera a ListaPage de Detalhe
                    yield this.gerarDetalheListaPage(this.tabelaAgregada);
                    // gera a DetalhePage de Detalhe
                    yield this.gerarDetalheDetalhePage(this.tabelaAgregada);
                    // gera o PersistePage de Detalhe
                    yield this.gerarDetalhePersistePage(this.tabelaAgregada);
                }
                return true;
            }
            catch (erro) {
                return erro;
            }
        });
    }
    /**
     * Gera arquivos para a tabela principal
     */
    gerarArquivosTabelaPrincipal() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // pega os campos para a tabela
                let retorno = yield this.pegarCampos(this.tabela);
                if (retorno != true) {
                    return retorno;
                }
                // gera a ListaPage - Mestre
                yield this.gerarMestreListaPage(this.tabela);
                // gera a DetalhePage - Mestre
                yield this.gerarMestreDetalhePage(this.tabela);
                // gera a PersistePage - Mestre
                yield this.gerarMestrePersistePage(this.tabela);
                // gera a page mester
                yield this.gerarMestrePage(this.tabela);
                // gera a PersistePage - @OneToOne
                for (let index = 0; index < this.relacionamentosOneToOne.length; index++) {
                    yield this.gerarMestrePersistePageOneToOne(this.relacionamentosOneToOne[index].tabela);
                }
                return true;
            }
            catch (erro) {
                return erro;
            }
        });
    }
    /**
     * Pega as colunas de determinada tabela e atribui ao datapacket (variável de classe)
     */
    pegarCampos(tabela) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lista = yield tabela_service_1.TabelaService.pegarCampos(tabela);
                this.dataPacket = lista;
                // vamos armazenar dois arrays de relacionamento
                // completo: usado para montar a página mestre das abas
                // OneToOnt: usado para criar as páginas OneToOne
                if (tabela != this.tabela) {
                    // monta o nome do campo: Ex: ID_PESSOA
                    let nomeCampoFK = 'ID_' + this.tabela.toUpperCase();
                    // verifica se o campo FK contem algum comentário para inserir como relacionamento
                    for (let i = 0; i < lista.length; i++) {
                        if (lista[i].Field == nomeCampoFK && lista[i].Comment != '') {
                            let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel(tabela, lista[i].Comment, this.tabela);
                            if (objeto.cardinalidade == '@OneToOne') {
                                this.relacionamentosOneToOne.push(objeto);
                            }
                            if (objeto.side != 'Local') {
                                this.relacionamentos.push(objeto);
                            }
                        }
                    }
                }
                return true;
            }
            catch (erro) {
                return erro;
            }
        });
    }
    /**
     * Gera a ListaPage de Detalhe
     */
    gerarDetalheListaPage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_detalhe_lista_page_1.FlutterAbaDetalheListaPage(tabela, this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaDetalheListaPage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_lista_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a DetalhePage de Detalhe
     */
    gerarDetalheDetalhePage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_detalhe_detalhe_page_1.FlutterAbaDetalheDetalhePage(tabela, this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaDetalheDetalhePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_detalhe_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a PersistePage de Detalhe
     */
    gerarDetalhePersistePage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_detalhe_persiste_page_1.FlutterAbaDetalhePersistePage(tabela, this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaDetalhePersistePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_persiste_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a ListaPage - mestre
     */
    gerarMestreListaPage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_mestre_lista_page_1.FlutterAbaMestreListaPage(tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaMestreListaPage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_lista_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a DetalhePage - mestre
     */
    gerarMestreDetalhePage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_mestre_detalhe_page_1.FlutterAbaMestreDetalhePage(tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaMestreDetalhePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_detalhe_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a PersistePage - mestre
     */
    gerarMestrePersistePage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_mestre_persiste_page_1.FlutterAbaMestrePersistePage(tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaMestrePersistePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_persiste_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a PersistePage - mestre - OneToOne - Ex: PESSOA_FISICA / PESSOA_JURIDICA
     */
    gerarMestrePersistePageOneToOne(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // vamos pegar o datapacket da tabela novamente, pois neste momento o datapacket da vez é o da tabela mestre
            let lista = yield tabela_service_1.TabelaService.pegarCampos(tabela);
            this.dataPacket = lista;
            let modelJson = new flutter_aba_mestre_persiste_page_one_to_one_1.FlutterAbaMestrePersistePageOneToOne(tabela, this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaMestrePersistePageOneToOne).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_persiste_page_OneToOne';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a MestrePage das abas
     */
    gerarMestrePage(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_aba_mestre_page_1.FlutterAbaMestrePage(tabela, this.relacionamentos);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateAbaMestrePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase() + '_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/MestreDetalhe/' + nomeArquivo + '.dart', modelGerado);
        });
    }
}
exports.GeradorFlutterAba = GeradorFlutterAba;
//# sourceMappingURL=gerador.flutter.aba.js.map