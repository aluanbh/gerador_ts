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
exports.TabelaService = void 0;
const db_config_1 = require("../config/db.config");
class TabelaService {
    constructor() { }
    static consultarLista(result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sql = "SELECT table_name AS nome " +
                    "FROM " +
                    "information_schema.tables " +
                    "WHERE  " +
                    "table_schema = DATABASE()";
                let dados = yield (yield db_config_1.connection).manager.query(sql);
                return result(dados, null);
            }
            catch (erro) {
                return result(null, erro);
            }
        });
    }
    static consultarListaCampos(tabela, result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sql = "SHOW FULL COLUMNS FROM " + tabela;
                let dados = yield (yield db_config_1.connection).manager.query(sql);
                return result(dados, null);
            }
            catch (erro) {
                return result(null, erro);
            }
        });
    }
    static consultarAgregados(tabela) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sql = "SELECT TABLE_NAME, COLUMN_NAME " +
                    "FROM information_schema.columns " +
                    "WHERE table_schema='fenix' and COLUMN_NAME = 'ID_" + tabela + "'";
                let dados = yield (yield db_config_1.connection).manager.query(sql);
                return dados;
            }
            catch (erro) {
                return erro;
            }
        });
    }
    static pegarCampos(tabela) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sql = "SHOW FULL COLUMNS FROM " + tabela;
                let dados = yield (yield db_config_1.connection).manager.query(sql);
                return dados;
            }
            catch (erro) {
                return erro;
            }
        });
    }
    /// esse método faz a mesma coisa do método consultarLista, 
    /// mas é implementado de uma maneira diferente para mostrar ao aluno as duas formas de fazer
    static pegarTabelas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sql = "SELECT table_name AS nome " +
                    "FROM " +
                    "information_schema.tables " +
                    "WHERE  " +
                    "table_schema = DATABASE()";
                let dados = yield (yield db_config_1.connection).manager.query(sql);
                return dados;
            }
            catch (erro) {
                return erro;
            }
        });
    }
}
exports.TabelaService = TabelaService;
//# sourceMappingURL=tabela.service.js.map