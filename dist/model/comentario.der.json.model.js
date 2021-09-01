"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComentarioDerJsonModel = void 0;
const lodash = require("lodash");
class ComentarioDerJsonModel {
    constructor(tabela, objetoJson, tabelaMestre) {
        this.tabela = tabela;
        this.tabelaMestre = tabelaMestre;
        this.objetoMestre = lodash.camelCase(tabelaMestre);
        this.classeMestre = lodash.upperFirst(this.objetoMestre);
        let objeto = JSON.parse(objetoJson);
        this.cardinalidade = objeto["cardinalidade"];
        this.crud = objeto["crud"];
        this.create = this.crud.includes('C') ? true : false;
        this.read = this.crud.includes('R') ? true : false;
        this.update = this.crud.includes('U') ? true : false;
        this.delete = this.crud.includes('D') ? true : false;
        this.side = objeto["side"];
        this.cascade = objeto["cascade"];
        this.obrigatorio = objeto["obrigatorio"];
        this.orphanRemoval = objeto["orphanRemoval"];
        this.label = objeto["label"];
        this.labelText = objeto["labelText"];
        this.validacao = objeto["validacao"];
        this.tooltip = objeto["tooltip"];
        this.hintText = objeto["hintText"];
        this.tipoControle = objeto["tipoControle"];
        this.campoLookup = objeto["campoLookup"];
        this.campoLookupTipoDado = objeto["campoLookupTipoDado"];
    }
}
exports.ComentarioDerJsonModel = ComentarioDerJsonModel;
class TipoControle {
    constructor() {
        this.itens = [];
    }
}
//# sourceMappingURL=comentario.der.json.model.js.map