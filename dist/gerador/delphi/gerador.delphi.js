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
exports.GeradorDelphi = void 0;
const fs = require("fs");
const lodash = require("lodash");
const Mustache = require("mustache");
const tabela_service_1 = require("../../service/tabela.service");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
const delphi_model_1 = require("./delphi.model");
const delphi_controller_1 = require("./delphi.controller");
const delphi_service_1 = require("./delphi.service");
const delphi_webmodule_1 = require("./delphi.webmodule");
const gerador_base_1 = require("../../gerador/gerador.base");
class GeradorDelphi extends gerador_base_1.GeradorBase {
    constructor() {
        super();
        this.listaTabelas = [];
        this.caminhoFontes = 'c:/t2ti/gerador.codigo/fontes/delphi/';
        this.arquivoTemplateModel = 'c:/t2ti/gerador.codigo/templates/delphi/Delphi.Model.mustache';
        this.arquivoTemplateController = 'c:/t2ti/gerador.codigo/templates/delphi/Delphi.Controller.mustache';
        this.arquivoTemplateService = 'c:/t2ti/gerador.codigo/templates/delphi/Delphi.Service.mustache';
        this.arquivoTemplateWebModule = 'c:/t2ti/gerador.codigo/templates/delphi/Delphi.WebModule.mustache';
        this.relacionamentos = new Array;
    }
    gerarArquivos(tabela, result) {
        const _super = Object.create(null, {
            criarDiretorio: { get: () => super.criarDiretorio }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // nome da tabela
            this.tabela = tabela.toUpperCase();
            // criar diretórios
            let retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + this.tabela);
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_CONTROLLER');
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
                // gera o Model
                yield this.gerarModel(this.tabela);
                // gera o Controller
                yield this.gerarController();
                // gera o Service
                yield this.gerarService();
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
                if (tabela != this.tabela) {
                    // monta o nome do campo: Ex: ID_PESSOA
                    let nomeCampoFK = 'ID_' + this.tabela.toUpperCase();
                    // verifica se o campo FK contem algum comentário para inserir como relacionamento
                    for (let i = 0; i < lista.length; i++) {
                        if (lista[i].Field == nomeCampoFK && lista[i].Comment != '') {
                            let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel(tabela, lista[i].Comment);
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
     * Gera o Model - serve para a tabela principal e também para as tabelas agregadas
     */
    gerarModel(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // só passa os relacionamentos se for a tabela principal
            if (tabela != this.tabela) {
                var modelJson = new delphi_model_1.DelphiModel(tabela, this.dataPacket, null);
            }
            else {
                var modelJson = new delphi_model_1.DelphiModel(tabela, this.dataPacket, this.relacionamentos);
            }
            let modelTemplate = fs.readFileSync(this.arquivoTemplateModel).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(tabela);
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = _super.gravarArquivo.call(this, this.caminhoFontes + '_MODEL/' + nomeArquivo + '.pas', modelGerado);
            retorno = _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.pas', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o Controller para a tabela principal
     */
    gerarController() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new delphi_controller_1.DelphiController(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateController).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'Controller';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_CONTROLLER/' + nomeArquivo + '.pas', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.pas', modelGerado);
            return retorno;
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
            var modelJson = new delphi_service_1.DelphiService(this.tabela, this.dataPacket, this.relacionamentos);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateService).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'Service';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_SERVICE/' + nomeArquivo + '.pas', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.pas', modelGerado);
            return retorno;
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
                var modelJson = new delphi_webmodule_1.DelphiWebModule(modulo, this.listaTabelas);
                let modelTemplate = fs.readFileSync(this.arquivoTemplateWebModule).toString();
                let modelGerado = Mustache.render(modelTemplate, modelJson);
                let nomeArquivo = "DelphiWebModule.txt";
                _super.gravarArquivo.call(this, this.caminhoFontes + '/' + nomeArquivo, modelGerado);
                result({ mensagem: "Arquivos gerados com sucesso!" }, null);
            }
            catch (erro) {
                return result(null, erro);
            }
        });
    }
}
exports.GeradorDelphi = GeradorDelphi;
//# sourceMappingURL=gerador.delphi.js.map