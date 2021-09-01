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
exports.GeradorFlutter = void 0;
const fs = require("fs");
const Mustache = require("mustache");
const tabela_service_1 = require("../../service/tabela.service");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
const gerador_base_1 = require("../../gerador/gerador.base");
const flutter_service_1 = require("./flutter.service");
const flutter_view_model_1 = require("./flutter.view.model");
const flutter_model_1 = require("./flutter.model");
const flutter_lista_page_1 = require("./flutter.lista.page");
const flutter_detalhe_page_1 = require("./flutter.detalhe.page");
const flutter_persiste_page_1 = require("./flutter.persiste.page");
const flutter_exports_rotas_1 = require("./flutter.exports.rotas");
class GeradorFlutter extends gerador_base_1.GeradorBase {
    constructor() {
        super();
        this.listaTabelas = [];
        this.caminhoFontes = 'c:/t2ti/gerador.codigo/fontes/flutter/';
        this.arquivoTemplateService = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.Service.mustache';
        this.arquivoTemplateViewModel = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.ViewModel.mustache';
        this.arquivoTemplateModel = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.Model.mustache';
        this.arquivoTemplateListaPage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.ListaPage.mustache';
        this.arquivoTemplateDetalhePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.DetalhePage.mustache';
        this.arquivoTemplatePersistePage = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.PersistePage.mustache';
        this.arquivoTemplateExportsRotas = 'c:/t2ti/gerador.codigo/templates/flutter/Flutter.Exports.Rotas.mustache';
        this.relacionamentos = new Array;
    }
    gerarArquivos(tabela, result) {
        const _super = Object.create(null, {
            criarDiretorio: { get: () => super.criarDiretorio }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // nome da tabela
            this.tabela = tabela.toUpperCase();
            // criar diretório
            let retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + this.tabela.toLowerCase());
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_VIEW_MODEL');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_SERVICE');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_MODEL');
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
     * Encontra todas as tabelas agregadas a partir da chave estrangeira e gera os arquivos de modelo
     * Não procuraremos por tabelas de segundo nível, apenas as de primeiro nível vinculadas diretamente
     * à tabela principal que foi enviada pelo usuário
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
                    // gera o Model
                    yield this.gerarModel(this.tabelaAgregada);
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
                // gera o Service
                yield this.gerarService();
                // gera o ViewModel
                yield this.gerarViewModel();
                // gera o Model
                yield this.gerarModel(this.tabela);
                // gera a ListaPage
                yield this.gerarListaPage();
                // gera a DetalhePage
                yield this.gerarDetalhePage();
                // gera o PersistePage
                yield this.gerarPersistePage();
                // gera o conjunto de páginas mestre-detalhe
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
                // verifica se a tabela que está sendo utilizada neste momento é diferente da tabela principal
                // aqui geramos apenas os relacionamentos agregados onde a FK se encontra em uma outra tabela diferente da principal
                // esses relacionamentos serão utilizados apenas para a geração da classe principal
                // todo e qualquer relacionamento (objeto na classe filha) será tratado dentro do gerador do model
                if (tabela != this.tabela) {
                    // monta o nome do campo: Ex: ID_PESSOA
                    let nomeCampoFK = 'ID_' + this.tabela.toUpperCase();
                    // verifica se o campo FK contem algum comentário para inserir como relacionamento
                    for (let i = 0; i < lista.length; i++) {
                        if (lista[i].Field == nomeCampoFK && lista[i].Comment != '') {
                            let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel(tabela, lista[i].Comment, this.tabela);
                            // vamos inserir apenas os relacionamentos cujo Side não seja 'Local', pois esses serão encontrados e tratados no Model
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
     * Gera o Service para a tabela principal
     */
    gerarService() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var modelJson = new flutter_service_1.FlutterService(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateService).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = this.tabela.toLowerCase() + '_service';
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_SERVICE/' + nomeArquivo + '.dart', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.dart', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o ViewModel para a tabela principal
     */
    gerarViewModel() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var modelJson = new flutter_view_model_1.FlutterViewModel(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateViewModel).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = this.tabela.toLowerCase() + '_view_model';
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_VIEW_MODEL/' + nomeArquivo + '.dart', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.dart', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o Model - serve para a tabela principal e também para as tabelas agregadas
     */
    gerarModel(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // só passa os relacionamentos se for a tabela principal
            if (tabela != this.tabela) {
                var modelJson = new flutter_model_1.FlutterModel(tabela, this.dataPacket, null);
            }
            else {
                var modelJson = new flutter_model_1.FlutterModel(tabela, this.dataPacket, this.relacionamentos);
            }
            let modelTemplate = fs.readFileSync(this.arquivoTemplateModel).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = tabela.toLowerCase();
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_MODEL/' + nomeArquivo + '.dart', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.dart', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera a ListaPage para a tabela principal
     */
    gerarListaPage() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_lista_page_1.FlutterListaPage(this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateListaPage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = this.tabela.toLowerCase() + '_lista_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a DetalhePage para a tabela principal
     */
    gerarDetalhePage() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_detalhe_page_1.FlutterDetalhePage(this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateDetalhePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = this.tabela.toLowerCase() + '_detalhe_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
     * Gera a PersistePage para a tabela principal
     */
    gerarPersistePage() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new flutter_persiste_page_1.FlutterPersistePage(this.tabela, this.dataPacket);
            let modelTemplate = fs.readFileSync(this.arquivoTemplatePersistePage).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = this.tabela.toLowerCase() + '_persiste_page';
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.dart', modelGerado);
        });
    }
    /**
      * Gera arquivos a partir do nome das tabelas
      */
    gerarArquivosLacoTabela(modulo, result) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // pega a lista com o nome das tabelas
                let lista = yield tabela_service_1.TabelaService.pegarTabelas();
                for (let index = 0; index < lista.length; index++) {
                    this.listaTabelas.push(lista[index].nome);
                }
                // gera o arquivo com o conteúdo para todas e para os includes
                var modelJson = new flutter_exports_rotas_1.FlutterExportsRotas(modulo, this.listaTabelas);
                let modelTemplate = fs.readFileSync(this.arquivoTemplateExportsRotas).toString();
                let modelGerado = Mustache.render(modelTemplate, modelJson);
                let nomeArquivo = "FlutterExports.txt";
                _super.gravarArquivo.call(this, this.caminhoFontes + '/' + nomeArquivo, modelGerado);
                result({ mensagem: "Arquivos gerados com sucesso!" }, null);
            }
            catch (erro) {
                return result(null, erro);
            }
        });
    }
}
exports.GeradorFlutter = GeradorFlutter;
//# sourceMappingURL=gerador.flutter.js.map