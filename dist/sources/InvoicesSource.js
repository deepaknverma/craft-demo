"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inceptum_1 = require("inceptum");
const inceptum_etl_1 = require("inceptum-etl");
const log = inceptum_1.LogManager.getLogger();
class InvoicesSource extends inceptum_etl_1.EtlSource {
    getNextBatch() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    /* istanbul ignore next */
    // tslint:disable:prefer-function-over-method
    savePointToString(savePoint) {
        return '';
    }
    /* istanbul ignore next */
    // tslint:disable:prefer-function-over-method
    stringToSavePoint(savePoint) {
        return {};
    }
    hasNextBatch() {
        return;
    }
    /* istanbul ignore next */
    // tslint:disable:prefer-function-over-method
    stateChanged(newState) {
        return Promise.resolve();
    }
}
exports.default = InvoicesSource;
//# sourceMappingURL=InvoicesSource.js.map