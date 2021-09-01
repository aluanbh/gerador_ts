"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NHibernateService = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o service do NHibernate usando o mustache
class NHibernateService {
    constructor(tabela) {
        // nome da classe
        this.class = lodash.camelCase(tabela);
        this.class = lodash.upperFirst(this.class);
        // nome da tabela
        this.table = tabela.toUpperCase();
    }
}
exports.NHibernateService = NHibernateService;
//# sourceMappingURL=nhibernate.service.js.map