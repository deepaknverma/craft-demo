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
const fs = require("fs");
const csvToObject = require("csvtojson");
const inceptum_1 = require("inceptum");
const inceptum_etl_1 = require("inceptum-etl");
const log = inceptum_1.LogManager.getLogger();
class SalesSource extends inceptum_etl_1.EtlSource {
    constructor(config) {
        super();
        this.errorFound = false;
        this.files = [];
        this.fileName = '';
        this.fileDir = config['fileDir'];
        this.header = `"TxnDate","RefNumber","Memo","Debit","Credit","AccountFullName","ItemSalesTaxRefFullName","Allocation Memo"`;
    }
    getErrorFound() {
        return this.errorFound;
    }
    /**
     * Convert the savepoint object to a string for storage
     * @param savePoint
     */
    // tslint:disable-next-line:prefer-function-over-method
    savePointToString(savePoint) {
        return JSON.stringify(savePoint);
    }
    /**
     * Convert a given string to savepoint object. If it is an empry string
     * returns the default savepoint
     * @param savePoint
     */
    stringToSavePoint(savePoint) {
        if (savePoint.length === 0) {
            return this.defaultSavePoint();
        }
        return JSON.parse(savePoint);
    }
    /**
     * Get the default savepoint.
     */
    // tslint:disable-next-line:prefer-function-over-method
    defaultSavePoint() {
        return {
            fileName: this.fileName,
        };
    }
    /**
     * This method can be overriten to set the required data to fetch the next batch
     */
    initCurrentSavePoint() {
        return __awaiter(this, void 0, void 0, function* () {
            this.files = fs.readdirSync(this.fileDir).sort();
            this.headers = yield this.loadHeader();
        });
    }
    loadHeader() {
        return new Promise((resolve, reject) => {
            csvToObject({ noheader: true })
                .fromString(this.header)
                .on('csv', (csvRow) => {
                resolve(csvRow);
            });
        });
    }
    /**
     * Get's the next batch of objects. It should add this object as listener to the batch
     * to know when it finished and make the relevant updates to the savePoint in
     * {@link #stateChanged}
     */
    getNextBatch() {
        return __awaiter(this, void 0, void 0, function* () {
            const fname = this.files.shift();
            this.fileName = `${this.fileDir}/${fname}`;
            const data = yield this.loadFromCsvFile();
            const batch = new inceptum_etl_1.EtlBatch(data, 1, 1, fname);
            batch.registerStateListener(this);
            return batch;
        });
    }
    /**
     * Get the stored save point using the etlSavepointManager
     * @param savepointManager
     */
    initSavePoint(etlSavepointManager) {
        return __awaiter(this, void 0, void 0, function* () {
            this.etlSavepointManager = etlSavepointManager;
            this.initialSavePoint = yield this.getStoredSavePoint();
            yield this.initCurrentSavePoint();
        });
    }
    //
    loadFromCsvFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const data = [];
                csvToObject({ noheader: true, headers: this.headers })
                    .fromFile(this.fileName)
                    .on('json', (jsonObj) => {
                    data.push(jsonObj);
                })
                    .on('done', (error) => {
                    resolve(data);
                });
            });
        });
    }
    hasNextBatch() {
        return (this.files.length > 0);
    }
    stateChanged(newState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newState === inceptum_etl_1.EtlState.ERROR) {
                log.debug(`savepoint stored: ${this.getCurrentSavepoint()}`);
            }
        });
    }
}
exports.default = SalesSource;
//# sourceMappingURL=SalesSource.js.map