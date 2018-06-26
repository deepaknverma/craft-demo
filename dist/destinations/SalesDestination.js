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
const request = require("request-promise");
const QuickBooks = require("node-quickbooks");
const inceptum_1 = require("inceptum");
const inceptum_etl_1 = require("inceptum-etl");
const log = inceptum_1.LogManager.getLogger();
class SalesDestination extends inceptum_etl_1.EtlDestination {
    constructor(config) {
        super();
        this.qbo = QuickBooks;
        this.config = Object.assign({}, config);
    }
    generateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auth = (new Buffer(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64'));
                const res = yield request.post({
                    url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${auth}`,
                    },
                    form: {
                        grant_type: 'refresh_token',
                        refresh_token: 'L011538735469jImcGIu44Na0ERFrUl9iQ4inoweByn4R1zlyj',
                    },
                });
                const obj = JSON.parse(res);
                this.config.oauthToken = obj['access_token'];
            }
            catch (e) {
                log.error(e);
            }
        });
    }
    initialiseQboObject() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.generateToken();
            if (this.qbo) {
                this.qbo = new QuickBooks(this.config.consumerKey, this.config.consumerSecret, this.config.oauthToken, /* oAuth access token */ false, /* no token secret for oAuth 2.0 */ this.config.realmId, true, /* use a sandbox account */ true, /* turn debugging on */ 4, /* minor version */ '2.0', /* oauth version */ this.config.refreshToken);
            }
        });
    }
    store(batch) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialiseQboObject();
            try {
                const currentBatch = batch.getTransformedRecords();
                log.info(`Executing ${currentBatch.length} operations`);
                if (currentBatch.length > 0) {
                    const transactionsToUpload = currentBatch.map((record) => record.getTransformedData());
                    transactionsToUpload.map((record) => {
                        const newRecord = record;
                        newRecord.JournalEntryLineDetail.PostingType = (record.JournalEntryLineDetail.PostingType === 'Credit') ? 'Debit' : 'Credit';
                        this.qbo.createJournalEntry({
                            Line: [record, newRecord],
                        });
                    });
                    log.debug(transactionsToUpload);
                    // createJournalEntry
                    log.debug('Finsihed processing the batch');
                    this.batchStatus = true;
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
exports.default = SalesDestination;
//# sourceMappingURL=SalesDestination.js.map