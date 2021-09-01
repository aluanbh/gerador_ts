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
exports.TabelaController = void 0;
const tabela_service_1 = require("../service/tabela.service");
const retorno_json_erro_1 = require("../model/retorno.json.erro");
const gerador_delphi_1 = require("../gerador/delphi/gerador.delphi");
const gerador_java_1 = require("../gerador/java/gerador.java");
const gerador_csharp_1 = require("../gerador/csharp/gerador.csharp");
const gerador_nhibernate_1 = require("../gerador/nhibernate/gerador.nhibernate");
const gerador_node_1 = require("../gerador/node/gerador.node");
const gerador_php_1 = require("../gerador/php/gerador.php");
const gerador_flutter_1 = require("../gerador/flutter/gerador.flutter");
const gerador_flutter_aba_1 = require("../gerador/flutter/gerador.flutter.aba");
class TabelaController {
    constructor() {
    }
    // rota: /:linguagem/:nomeTabela/:modulo?
    gerarFontes(req, res) {
        let linguagens = ["csharp", "delphi", "java", "node", "php", "flutter", "nhibernate"];
        let linguagem = req.params.linguagem;
        let tabela = req.params.nomeTabela;
        let modulo = req.params.modulo;
        // verifica se a tabela existe
        tabela_service_1.TabelaService.consultarListaCampos(req.params.nomeTabela, (lista, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Consultar Lista de Campos]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                // verifica se a linguagem enviada pelo usuário está na lista de linguagens esperadas
                if (linguagens.includes(linguagem)) {
                    switch (linguagem) {
                        case 'csharp':
                            let geradorCSharp = new gerador_csharp_1.GeradorCSharp();
                            geradorCSharp.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos CSharp]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    res.send(retorno);
                                }
                            });
                            break;
                        case 'nhibernate':
                            let geradorNHibernate = new gerador_nhibernate_1.GeradorNHibernate();
                            geradorNHibernate.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos NHibernate]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    res.send(retorno);
                                }
                            });
                            break;
                        case 'delphi':
                            let geradorDelphi = new gerador_delphi_1.GeradorDelphi();
                            geradorDelphi.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Delphi]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    res.send(retorno);
                                }
                            });
                            break;
                        case 'java':
                            let geradorJava = new gerador_java_1.GeradorJava();
                            geradorJava.gerarArquivos(tabela, modulo, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Java]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    res.send(retorno);
                                }
                            });
                            break;
                        case 'node':
                            let geradorNode = new gerador_node_1.GeradorNode();
                            geradorNode.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Node]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    res.send(retorno);
                                }
                            });
                            break;
                        case 'php':
                            let geradorPHP = new gerador_php_1.GeradorPHP();
                            geradorPHP.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos PHP]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    res.send(retorno);
                                }
                            });
                            break;
                        case 'flutter':
                            // gerar páginas padrões
                            let geradorFlutter = new gerador_flutter_1.GeradorFlutter();
                            geradorFlutter.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Flutter]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    // gerar páginas mestre-detalhe
                                    let geradorFlutter = new gerador_flutter_aba_1.GeradorFlutterAba();
                                    geradorFlutter.gerarArquivos(tabela, (retorno, erro) => {
                                        if (erro != null) {
                                            let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Flutter]", erro: erro });
                                            res.status(500).send(jsonErro);
                                        }
                                        else {
                                            res.send(retorno);
                                        }
                                    });
                                }
                            });
                            break;
                        default:
                            console.log('Estranho, mas chegou aqui com essa linguagem não suportada: ' + linguagem + '.');
                    }
                }
                else {
                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 400, mensagem: "Erro no Servidor [Gerar Fontes] - Linguagem não suportada", erro: null });
                    res.status(400).send(jsonErro);
                }
            }
        });
    }
    // rota: /gerar/todos/arquivos/:linguagem/:modulo?
    gerarTudo(req, res) {
        let linguagens = ["csharp", "delphi", "java", "node", "php", "flutter", "nhibernate"];
        let linguagem = req.params.linguagem;
        let modulo = req.params.modulo;
        let listaRetorno = [];
        if (!linguagens.includes(linguagem)) {
            let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 400, mensagem: "Erro no Servidor [Gerar Fontes] - Linguagem não suportada", erro: null });
            res.status(400).send(jsonErro);
        }
        // pega a lista de tabelas para fazer o laço
        tabela_service_1.TabelaService.consultarLista((lista, erro) => __awaiter(this, void 0, void 0, function* () {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Tudo - " + linguagem + "]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                let tabela = "";
                for (let i = 0; i < lista.length; i++) {
                    tabela = lista[i].nome;
                    switch (linguagem) {
                        case 'csharp':
                            let geradorCSharp = new gerador_csharp_1.GeradorCSharp();
                            yield geradorCSharp.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos CSharp]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    listaRetorno.push(retorno + " TABELA --> " + tabela);
                                }
                            });
                            break;
                        case 'nhibernate':
                            let geradorNHibernate = new gerador_nhibernate_1.GeradorNHibernate();
                            yield geradorNHibernate.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos NHibernate]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    listaRetorno.push(retorno + " TABELA --> " + tabela);
                                }
                            });
                            break;
                        case 'delphi':
                            let geradorDelphi = new gerador_delphi_1.GeradorDelphi();
                            yield geradorDelphi.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Delphi]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    listaRetorno.push(retorno + " TABELA --> " + tabela);
                                }
                            });
                            break;
                        case 'java':
                            let geradorJava = new gerador_java_1.GeradorJava();
                            yield geradorJava.gerarArquivos(tabela, modulo, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Java]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    listaRetorno.push(retorno + " TABELA --> " + tabela);
                                }
                            });
                            break;
                        case 'node':
                            let geradorNode = new gerador_node_1.GeradorNode();
                            yield geradorNode.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Node]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    listaRetorno.push(retorno + " TABELA --> " + tabela);
                                }
                            });
                            break;
                        case 'php':
                            let geradorPHP = new gerador_php_1.GeradorPHP();
                            yield geradorPHP.gerarArquivos(tabela, (retorno, erro) => {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos PHP]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    listaRetorno.push(retorno + " TABELA --> " + tabela);
                                }
                            });
                            break;
                        case 'flutter':
                            // gerar páginas padrões
                            let geradorFlutter = new gerador_flutter_1.GeradorFlutter();
                            yield geradorFlutter.gerarArquivos(tabela, (retorno, erro) => __awaiter(this, void 0, void 0, function* () {
                                if (erro != null) {
                                    let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Flutter]", erro: erro });
                                    res.status(500).send(jsonErro);
                                }
                                else {
                                    // gerar páginas mestre-detalhe
                                    let geradorFlutter = new gerador_flutter_aba_1.GeradorFlutterAba();
                                    yield geradorFlutter.gerarArquivos(tabela, (retorno, erro) => {
                                        if (erro != null) {
                                            let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Flutter]", erro: erro });
                                            res.status(500).send(jsonErro);
                                        }
                                        else {
                                            listaRetorno.push(retorno + " TABELA --> " + tabela);
                                        }
                                    });
                                }
                            }));
                            break;
                        default:
                            console.log('Estranho, mas chegou aqui com essa linguagem não suportada: ' + linguagem + '.');
                    }
                }
                res.send(listaRetorno);
            }
        }));
    }
    // rota: /laco/tabela/node/:modulo
    gerarArquivosLacoTabelaNode(req, res) {
        let modulo = req.params.modulo;
        let geradorNode = new gerador_node_1.GeradorNode();
        // gerar arquivos a partir dos nomes das tabelas
        geradorNode.gerarArquivosLacoTabela(modulo, (retorno, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Laço Tabela Node]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                res.send(retorno);
            }
        });
    }
    // rota: /laco/tabela/php/:modulo
    gerarArquivosLacoTabelaPHP(req, res) {
        let modulo = req.params.modulo;
        let geradorPHP = new gerador_php_1.GeradorPHP();
        // gerar arquivos a partir dos nomes das tabelas
        geradorPHP.gerarArquivosLacoTabela(modulo, (retorno, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Laço Tabela PHP]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                res.send(retorno);
            }
        });
    }
    // rota: /laco/tabela/php/:modulo
    gerarArquivosLacoTabelaDelphi(req, res) {
        let modulo = req.params.modulo;
        let geradorDelphi = new gerador_delphi_1.GeradorDelphi();
        // gerar arquivos a partir dos nomes das tabelas
        geradorDelphi.gerarArquivosLacoTabela(modulo, (retorno, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Laço Tabela PHP]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                res.send(retorno);
            }
        });
    }
    // rota: /laco/tabela/flutter/:modulo
    gerarArquivosLacoTabelaFlutter(req, res) {
        let modulo = req.params.modulo;
        let geradorFlutter = new gerador_flutter_1.GeradorFlutter();
        // gerar arquivos a partir dos nomes das tabelas
        geradorFlutter.gerarArquivosLacoTabela(modulo, (retorno, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Gerar Arquivos Laço Tabela Flutter]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                res.send(retorno);
            }
        });
    }
    // rota: /tabela
    consultarLista(req, res) {
        tabela_service_1.TabelaService.consultarLista((lista, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Consultar Lista de Tabelas]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                res.send(lista);
            }
        });
    }
    // rota: /tabela/:nomeTabela
    consultarListaCampos(req, res) {
        tabela_service_1.TabelaService.consultarListaCampos(req.params.nomeTabela, (lista, erro) => {
            if (erro != null) {
                let jsonErro = new retorno_json_erro_1.RetornoJsonErro({ codigo: 500, mensagem: "Erro no Servidor [Consultar Lista de Campos]", erro: erro });
                res.status(500).send(jsonErro);
            }
            else {
                res.send(lista);
            }
        });
    }
}
exports.TabelaController = TabelaController;
//# sourceMappingURL=tabela.controller.js.map