"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const typeorm_1 = require("typeorm");
exports.connection = (0, typeorm_1.createConnection)({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "fenix",
    entities: [],
    synchronize: false,
    logging: true
});
//# sourceMappingURL=db.config.js.map