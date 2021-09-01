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
exports.GeradorBase = void 0;
const fs = require("fs");
class GeradorBase {
    constructor() { }
    /**
      * Cria o diretório que armazenará os arquivos (código fonte gerado) da tabela selecionada
      */
    criarDiretorio(caminho) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs.existsSync(caminho)) {
                    fs.mkdirSync(caminho);
                }
                return true;
            }
            catch (erro) {
                return erro;
            }
        });
    }
    /**
      * Salva o arquivo no disco
      */
    gravarArquivo(caminho, conteudo) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.writeFile(caminho, conteudo, function (erro) {
                if (erro) {
                    return erro;
                }
                else {
                    return true;
                }
            });
        });
    }
}
exports.GeradorBase = GeradorBase;
//# sourceMappingURL=gerador.base.js.map