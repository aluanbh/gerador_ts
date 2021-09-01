"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterExportsRotas = void 0;
const lodash = require("lodash");
/// classe base que ajuda a gerar o arquivo com as exportações
class FlutterExportsRotas {
    constructor(modulo, listaTabelas) {
        this.exportViewModel = []; // exportViewModel
        this.exportModel = []; // exportModel
        this.exportService = []; // exportService
        this.exportPage = []; // exportPage
        this.locators = []; // locators
        this.providers = []; // providers
        this.rotas = []; // rotas
        let nomeTabela = "";
        let nomeObjeto = "";
        let nomeClasse = "";
        for (let i = 0; i < listaTabelas.length; i++) {
            nomeTabela = listaTabelas[i];
            nomeObjeto = lodash.camelCase(nomeTabela);
            nomeClasse = lodash.upperFirst(nomeObjeto);
            // exportViewModel
            this.exportViewModel.push("export 'package:fenix/src/view_model/" + modulo + "/" + nomeTabela + "_view_model.dart';");
            // exportModel
            this.exportModel.push("export 'package:fenix/src/model/" + modulo + "/" + nomeTabela + ".dart';");
            // exportService
            this.exportService.push("export 'package:fenix/src/service/" + modulo + "/" + nomeTabela + "_service.dart';");
            // exportPage
            this.exportPage.push("export 'package:fenix/src/view/page/" + modulo + "/" + nomeTabela + "/" + nomeTabela + "_detalhe_page.dart';");
            this.exportPage.push("export 'package:fenix/src/view/page/" + modulo + "/" + nomeTabela + "/" + nomeTabela + "_lista_page.dart';");
            this.exportPage.push("export 'package:fenix/src/view/page/" + modulo + "/" + nomeTabela + "/" + nomeTabela + "_persiste_page.dart';");
            this.exportPage.push("");
            // locators
            this.locators.push("locator.registerLazySingleton(() => " + nomeClasse + "Service());");
            this.locators.push("locator.registerFactory(() => " + nomeClasse + "ViewModel());");
            this.locators.push("");
            // providers
            this.providers.push("ChangeNotifierProvider(create: (_) => locator<" + nomeClasse + "ViewModel>()),");
            // rota
            this.rotas.push("// " + nomeClasse);
            this.rotas.push("case '/" + nomeObjeto + "Lista':");
            this.rotas.push("  return MaterialPageRoute(builder: (_) => " + nomeClasse + "ListaPage());");
            this.rotas.push("case '/" + nomeObjeto + "Detalhe':");
            this.rotas.push("  var " + nomeObjeto + " = settings.arguments as " + nomeClasse + ";");
            this.rotas.push("  return MaterialPageRoute(");
            this.rotas.push("      builder: (_) =>");
            this.rotas.push("          " + nomeClasse + "DetalhePage(" + nomeObjeto + ": " + nomeObjeto + "));");
            this.rotas.push("case '/" + nomeObjeto + "Persiste':");
            this.rotas.push("  return MaterialPageRoute(builder: (_) => " + nomeClasse + "PersistePage());");
            this.rotas.push("");
        }
    }
}
exports.FlutterExportsRotas = FlutterExportsRotas;
//# sourceMappingURL=flutter.exports.rotas.js.map