import { EtlBatch, EtlDestination } from 'inceptum-etl';
export interface QboConfig {
    consumerKey: string;
    consumerSecret: string;
    oauthToken: string;
    oauthTokenSecret: string;
    realmId: string;
    minorversion: string;
}
export declare class AccountRef {
    value: number;
    name: string;
}
export declare class JournalEntryLineDetail {
    PostingType: string;
    AccountRef: AccountRef;
}
export declare class JournalEntry {
    Description: string;
    Amount: number;
    DetailType: string;
    JournalEntryLineDetail: JournalEntryLineDetail;
    accountRef(obj: object): AccountRef;
    journalEntryLine(obj: object): JournalEntryLineDetail;
    toQboObject(obj: object): JournalEntry;
}
export default class ExpensesDestination extends EtlDestination {
    batchStatus: boolean;
    protected qbo: any;
    constructor(config: QboConfig);
    store(batch: EtlBatch): Promise<void>;
}
