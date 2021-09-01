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
exports.GeradorCSharp = void 0;
const fs = require("fs");
const lodash = require("lodash");
const Mustache = require("mustache");
const tabela_service_1 = require("../../service/tabela.service");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
const csharp_model_1 = require("./csharp.model");
const csharp_controller_1 = require("./csharp.controller");
const csharp_repository_1 = require("./csharp.repository");
const csharp_irepository_1 = require("./csharp.irepository");
const csharp_extension_1 = require("./csharp.extension");
const csharp_wrapper_context_1 = require("./csharp.wrapper.context");
const gerador_base_1 = require("../../gerador/gerador.base");
class GeradorCSharp extends gerador_base_1.GeradorBase {
    constructor() {
        super();
        this.caminhoFontes = 'c:/t2ti/gerador.codigo/fontes/csharp/';
        this.arquivoTemplateModel = 'c:/t2ti/gerador.codigo/templates/csharp/CSharp.Model.mustache';
        this.arquivoTemplateController = 'c:/t2ti/gerador.codigo/templates/csharp/CSharp.Controller.mustache';
        this.arquivoTemplateRepository = 'c:/t2ti/gerador.codigo/templates/csharp/CSharp.Repository.mustache';
        this.arquivoTemplateIRepository = 'c:/t2ti/gerador.codigo/templates/csharp/CSharp.IRepository.mustache';
        this.arquivoTemplateExtension = 'c:/t2ti/gerador.codigo/templates/csharp/CSharp.Extension.mustache';
        this.arquivoTemplateWrapperContext = 'c:/t2ti/gerador.codigo/templates/csharp/CSharp.WrapperContext.mustache';
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
            let retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + this.tabela);
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_CONTROLLER');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_EXTENSION');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_MODEL');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_REPOSITORY');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_IREPOSITORY');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_WRAPPER_CONTEXT');
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
                // gera o Repository
                yield this.gerarRepository();
                // gera o IRepository
                yield this.gerarIRepository();
                // gera o Extension
                yield this.gerarExtension();
                // gera o código para os arquivos RepositoryWrapper, IRepositoryWrapper e RepositoryContext
                yield this.gerarWrapperContext();
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
     * Gera o Model - serve para a tabela principal e também para as tabelas agregadas
     */
    gerarModel(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // só passa os relacionamentos se for a tabela principal
            if (tabela != this.tabela) {
                var modelJson = new csharp_model_1.CSharpModel(tabela, this.dataPacket, null);
            }
            else {
                var modelJson = new csharp_model_1.CSharpModel(tabela, this.dataPacket, this.relacionamentos);
            }
            let modelTemplate = fs.readFileSync(this.arquivoTemplateModel).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(tabela);
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            _super.gravarArquivo.call(this, this.caminhoFontes + '_MODEL/' + nomeArquivo + '.cs', modelGerado);
            return _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
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
            let modelJson = new csharp_controller_1.CSharpController(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateController).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'Controller';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_CONTROLLER/' + nomeArquivo + '.cs', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o Repository para a tabela principal
     */
    gerarRepository() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new csharp_repository_1.CSharpRepository(this.tabela, this.dataPacket, this.relacionamentos);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateRepository).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'Repository';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_REPOSITORY/' + nomeArquivo + '.cs', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o IRepository para a tabela principal
     */
    gerarIRepository() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new csharp_irepository_1.CSharpIRepository(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateIRepository).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeClasse = lodash.camelCase(this.tabela);
            nomeClasse = lodash.upperFirst(nomeClasse);
            let nomeArquivo = 'I' + nomeClasse + 'Repository';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_IREPOSITORY/' + nomeArquivo + '.cs', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o Extension para a tabela principal
     */
    gerarExtension() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var modelJson = new csharp_extension_1.CSharpExtension(this.tabela, this.dataPacket, this.relacionamentos);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateExtension).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'Extension';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_EXTENSION/' + nomeArquivo + '.cs', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
            return retorno;
        });
    }
    /**
      * Gera o Extension para a tabela principal
      */
    gerarWrapperContext() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var modelJson = new csharp_wrapper_context_1.CSharpWrapperContext(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateWrapperContext).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'WrapperContext';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_WRAPPER_CONTEXT/' + nomeArquivo + '.txt', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.txt', modelGerado);
            return retorno;
        });
    }
}
exports.GeradorCSharp = GeradorCSharp;
//# sourceMappingURL=gerador.csharp.js.map