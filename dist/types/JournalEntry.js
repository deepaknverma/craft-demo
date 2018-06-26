"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            value: (accountType.hasOwnProperty(obj['AccountFullName'])) ? accountType[obj['AccountFullName']].toString() : '187',
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
        instance.Amount = (obj['Credit']) ? Number(obj['Credit']) : Number(obj['Debit']);
        instance.DetailType = 'JournalEntryLineDetail';
        instance.JournalEntryLineDetail = this.journalEntryLine(obj);
        return instance;
    }
}
exports.JournalEntry = JournalEntry;
//# sourceMappingURL=JournalEntry.js.map