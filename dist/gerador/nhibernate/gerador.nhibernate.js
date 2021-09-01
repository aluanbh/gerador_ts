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
exports.GeradorNHibernate = void 0;
const fs = require("fs");
const lodash = require("lodash");
const Mustache = require("mustache");
const tabela_service_1 = require("../../service/tabela.service");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
const nhibernate_model_1 = require("./nhibernate.model");
const nhibernate_controller_1 = require("./nhibernate.controller");
const nhibernate_hbm_1 = require("./nhibernate.hbm");
const nhibernate_service_1 = require("./nhibernate.service");
const gerador_base_1 = require("../../gerador/gerador.base");
class GeradorNHibernate extends gerador_base_1.GeradorBase {
    constructor() {
        super();
        this.caminhoFontes = 'c:/t2ti/gerador.codigo/fontes/nhibernate/';
        this.arquivoTemplateModel = 'c:/t2ti/gerador.codigo/templates/nhibernate/NHibernate.Model.mustache';
        this.arquivoTemplateController = 'c:/t2ti/gerador.codigo/templates/nhibernate/NHibernate.Controller.mustache';
        this.arquivoTemplateService = 'c:/t2ti/gerador.codigo/templates/nhibernate/NHibernate.Service.mustache';
        this.arquivoTemplateHBM = 'c:/t2ti/gerador.codigo/templates/nhibernate/NHibernate.HBM.mustache';
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
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_SERVICE');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_MODEL');
            if (retorno != true) {
                return result(null, retorno);
            }
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_HBM');
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
                    // gera o HBM
                    yield this.gerarHBM(this.tabelaAgregada);
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
                // gera o HBM
                yield this.gerarHBM(this.tabela);
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
                var modelJson = new nhibernate_model_1.NHibernateModel(tabela, this.dataPacket, null);
            }
            else {
                var modelJson = new nhibernate_model_1.NHibernateModel(tabela, this.dataPacket, this.relacionamentos);
            }
            let modelTemplate = fs.readFileSync(this.arquivoTemplateModel).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(tabela);
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_MODEL/' + nomeArquivo + '.cs', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
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
            let modelJson = new nhibernate_controller_1.NHibernateController(this.tabela);
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
     * Gera o Service para a tabela principal
     */
    gerarService() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var modelJson = new nhibernate_service_1.NHibernateService(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateService).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(this.tabela) + 'Service';
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_SERVICE/' + nomeArquivo + '.cs', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.cs', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o HBM para a tabela principal
     */
    gerarHBM(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // só passa os relacionamentos se for a tabela principal
            if (tabela != this.tabela) {
                var modelJson = new nhibernate_hbm_1.NHibernateHBM(tabela, this.dataPacket, null);
            }
            else {
                var modelJson = new nhibernate_hbm_1.NHibernateHBM(tabela, this.dataPacket, this.relacionamentos);
            }
            let modelTemplate = fs.readFileSync(this.arquivoTemplateHBM).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.camelCase(tabela);
            nomeArquivo = lodash.upperFirst(nomeArquivo);
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_HBM/' + nomeArquivo + '.hbm.xml', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.tabela + '/' + nomeArquivo + '.hbm.xml', modelGerado);
            return retorno;
        });
    }
}
exports.GeradorNHibernate = GeradorNHibernate;
//# sourceMappingURL=gerador.nhibernate.js.map