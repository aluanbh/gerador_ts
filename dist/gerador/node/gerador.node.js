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
exports.GeradorNode = void 0;
const fs = require("fs");
const lodash = require("lodash");
const Mustache = require("mustache");
const tabela_service_1 = require("../../service/tabela.service");
const comentario_der_json_model_1 = require("../../model/comentario.der.json.model");
const node_model_1 = require("./node.model");
const node_controller_1 = require("./node.controller");
const node_module_1 = require("./node.module");
const node_service_1 = require("./node.service");
const node_entities_export_1 = require("./node.entities.export");
const node_modules_export_1 = require("./node.modules.export");
const gerador_base_1 = require("../../gerador/gerador.base");
class GeradorNode extends gerador_base_1.GeradorBase {
    constructor() {
        super();
        this.listaTabelas = [];
        this.caminhoFontes = 'c:/t2ti/gerador.codigo/fontes/node/';
        this.arquivoTemplateModel = 'c:/t2ti/gerador.codigo/templates/node/Node.Model.mustache';
        this.arquivoTemplateController = 'c:/t2ti/gerador.codigo/templates/node/Node.Controller.mustache';
        this.arquivoTemplateModule = 'c:/t2ti/gerador.codigo/templates/node/Node.Module.mustache';
        this.arquivoTemplateService = 'c:/t2ti/gerador.codigo/templates/node/Node.Service.mustache';
        this.arquivoTemplateEntitiesExport = 'c:/t2ti/gerador.codigo/templates/node/Node.Entities.Export.mustache';
        this.arquivoTemplateModulesExport = 'c:/t2ti/gerador.codigo/templates/node/Node.Modules.Export.mustache';
        this.relacionamentos = new Array;
    }
    gerarArquivos(tabela, result) {
        const _super = Object.create(null, {
            criarDiretorio: { get: () => super.criarDiretorio }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // nome da tabela
            this.tabela = tabela.toUpperCase();
            this.nomePasta = lodash.replace(this.tabela.toLowerCase(), new RegExp("_", "g"), "-");
            // criar diret??rio
            let retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + this.nomePasta);
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
            retorno = yield _super.criarDiretorio.call(this, this.caminhoFontes + '_MODULE');
            if (retorno != true) {
                return result(null, retorno);
            }
            // procura pelas tabelas agregadas para criar os relacionamentos de primeiro n??vel
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
     * N??o procuraremos por tabelas de segundo n??vel, apenas as de primeiro n??vel vinculadas diretamente
     * ?? tabela principal que foi enviada pelo usu??rio
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
                // gera o Module
                yield this.gerarModule();
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
     * Pega as colunas de determinada tabela e atribui ao datapacket (vari??vel de classe)
     */
    pegarCampos(tabela) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lista = yield tabela_service_1.TabelaService.pegarCampos(tabela);
                this.dataPacket = lista;
                // verifica se a tabela que est?? sendo utilizada neste momento ?? diferente da tabela principal
                // aqui geramos apenas os relacionamentos agregados onde a FK se encontra em uma outra tabela diferente da principal
                // esses relacionamentos ser??o utilizados apenas para a gera????o da classe principal
                // todo e qualquer relacionamento (objeto na classe filha) ser?? tratado dentro do gerador do model
                if (tabela != this.tabela) {
                    // monta o nome do campo: Ex: ID_PESSOA
                    let nomeCampoFK = 'ID_' + this.tabela.toUpperCase();
                    // verifica se o campo FK contem algum coment??rio para inserir como relacionamento
                    for (let i = 0; i < lista.length; i++) {
                        if (lista[i].Field == nomeCampoFK && lista[i].Comment != '') {
                            let objeto = new comentario_der_json_model_1.ComentarioDerJsonModel(tabela, lista[i].Comment, this.tabela);
                            // vamos inserir apenas os relacionamentos cujo Side n??o seja 'Local', pois esses ser??o encontrados e tratados no Model
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
     * Gera o Model - serve para a tabela principal e tamb??m para as tabelas agregadas
     */
    gerarModel(tabela) {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // s?? passa os relacionamentos se for a tabela principal
            if (tabela != this.tabela) {
                var modelJson = new node_model_1.NodeModel(tabela, this.dataPacket, null);
            }
            else {
                var modelJson = new node_model_1.NodeModel(tabela, this.dataPacket, this.relacionamentos);
            }
            let modelTemplate = fs.readFileSync(this.arquivoTemplateModel).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.replace(tabela.toLowerCase(), new RegExp("_", "g"), "-") + '.entity';
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_MODEL/' + nomeArquivo + '.ts', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.nomePasta + '/' + nomeArquivo + '.ts', modelGerado);
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
            let modelJson = new node_controller_1.NodeController(this.tabela, this.dataPacket, this.relacionamentos);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateController).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.replace(this.tabela.toLowerCase(), new RegExp("_", "g"), "-") + '.controller';
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_CONTROLLER/' + nomeArquivo + '.ts', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.nomePasta + '/' + nomeArquivo + '.ts', modelGerado);
            return retorno;
        });
    }
    /**
     * Gera o Module para a tabela principal
     */
    gerarModule() {
        const _super = Object.create(null, {
            gravarArquivo: { get: () => super.gravarArquivo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let modelJson = new node_module_1.NodeModule(this.tabela);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateModule).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.replace(this.tabela.toLowerCase(), new RegExp("_", "g"), "-") + '.module';
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_MODULE/' + nomeArquivo + '.ts', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.nomePasta + '/' + nomeArquivo + '.ts', modelGerado);
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
            var modelJson = new node_service_1.NodeService(this.tabela, this.relacionamentos);
            let modelTemplate = fs.readFileSync(this.arquivoTemplateService).toString();
            let modelGerado = Mustache.render(modelTemplate, modelJson);
            let nomeArquivo = lodash.replace(this.tabela.toLowerCase(), new RegExp("_", "g"), "-") + '.service';
            let retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + '_SERVICE/' + nomeArquivo + '.ts', modelGerado);
            retorno = yield _super.gravarArquivo.call(this, this.caminhoFontes + this.nomePasta + '/' + nomeArquivo + '.ts', modelGerado);
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
                // gera o arquivo com a exporta????o das entities
                var modelJson = new node_entities_export_1.NodeEntitiesExport(modulo, this.listaTabelas);
                let modelTemplate = fs.readFileSync(this.arquivoTemplateEntitiesExport).toString();
                let modelGerado = Mustache.render(modelTemplate, modelJson);
                let nomeArquivo = "NodeEntitiesExport.txt";
                _super.gravarArquivo.call(this, this.caminhoFontes + '/' + nomeArquivo, modelGerado);
                // gera o arquivo com a exporta????o dos Module
                // para cada m??dulo do banco existir?? um arquivo desses
                // ex: cadastros.module
                // ex: compras.module
                modelJson = new node_modules_export_1.NodeModulesExport(modulo, this.listaTabelas);
                modelTemplate = fs.readFileSync(this.arquivoTemplateModulesExport).toString();
                modelGerado = Mustache.render(modelTemplate, modelJson);
                nomeArquivo = "NodeModulesExport.txt";
                _super.gravarArquivo.call(this, this.caminhoFontes + '/' + nomeArquivo, modelGerado);
                result({ mensagem: "Arquivos gerados com sucesso!" }, null);
            }
            catch (erro) {
                return result(null, erro);
            }
        });
    }
}
exports.GeradorNode = GeradorNode;
//# sourceMappingURL=gerador.node.js.map