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
const ExpensesDestination_1 = require("../destinations/ExpensesDestination");
const log = inceptum_1.LogManager.getLogger();
class SalesObject {
}
exports.SalesObject = SalesObject;
class ExpensesTransformer extends inceptum_etl_1.EtlTransformer {
    /**
     * Copy batch records to transform data
     * @param batch
     */
    // tslint:disable-next-line:prefer-function-over-method
    transform(batch) {
        return __awaiter(this, void 0, void 0, function* () {
            return batch.getRecords().forEach((record) => {
                const data = record.getData();
                const journalEntry = new ExpensesDestination_1.JournalEntry();
                const transformedData = journalEntry.toQboObject(data);
                log.debug('transformedData: ', transformedData);
                record.setTransformedData(transformedData);
            });
        });
    }
}
exports.default = ExpensesTransformer;
//# sourceMappingURL=ExpensesTranformer.js.map