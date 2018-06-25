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
const QuickBooks = require("node-quickbooks");
const inceptum_1 = require("inceptum");
const inceptum_etl_1 = require("inceptum-etl");
const log = inceptum_1.LogManager.getLogger();
const accountType = {
    'undeposited funds': 187,
    'Bistro Income': 184,
    'Bar Income': 185,
};
class AccountRef {
}
exports.AccountRef = AccountRef;
class JournalEntryLineDetail {
}
exports.JournalEntryLineDetail = JournalEntryLineDetail;
class JournalEntry {
    accountRef(obj) {
        return {
            value: (accountType.hasOwnProperty(obj['AccountFullName'])) ? accountType[obj['AccountFullName']] : 187,
            name: obj['AccountFullName'],
        };
    }
    journalEntryLine(obj) {
        return {
            PostingType: (obj['Credit']) ? 'Credit' : 'Debit',
            AccountRef: this.accountRef(obj),
        };
    }
    toQboObject(obj) {
        const instance = new JournalEntry();
        instance.Description = obj['Allocation Memo'];
        instance.Amount = (obj['Credit']) ? obj['Credit'] : obj['Debit'];
        instance.DetailType = obj['Memo'];
        instance.JournalEntryLineDetail = this.journalEntryLine(obj);
        return instance;
    }
}
exports.JournalEntry = JournalEntry;
class ExpensesDestination extends inceptum_etl_1.EtlDestination {
    constructor(config) {
        super();
        this.qbo = QuickBooks;
        this.qbo = new QuickBooks(config.consumerKey, config.consumerSecret, config.oauthToken, config.oauthTokenSecret, config.realmId, true, // use the sandbox?
        true);
    }
    store(batch) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            try {
                const currentBatch = batch.getTransformedRecords();
                log.info(`Executing ${currentBatch.length} operations`);
                if (currentBatch.length > 0) {
                    const transactionsToUpload = currentBatch.map((record) => record.getTransformedData());
                    // this.qbo.createJournalEntry(transactionsToUpload);
                    // createJournalEntry
                    log.debug('Finsihed processing the batch', transactionsToUpload);
                    self.batchStatus = true;
                }
                else {
                    /* istanbul ignore next */
                    log.debug('nothing to store in destination. Empty Array');
                }
            }
            catch (e) {
                /* istanbul ignore next */
                this.batchStatus = false;
                /* istanbul ignore next */
                log.error(e);
                /* istanbul ignore next */
                batch.setState(inceptum_etl_1.EtlState.ERROR);
                // log error
                /* istanbul ignore next */
                log.error(`Error saving batch in table: Batch:${batch.getBatchFullIdentifcation()}`);
            }
        });
    }
}
exports.default = ExpensesDestination;
//# sourceMappingURL=ExpensesDestination.js.map