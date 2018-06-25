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
