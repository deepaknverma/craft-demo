const accountType = {
  'undeposited funds': 187,
  'Bistro Income': 184,
  'Bar Income': 185,
};

export class AccountRef {
  value: number;
  name: string;
}
export class JournalEntryLineDetail {
  PostingType: string;
  AccountRef: AccountRef;
}
export class JournalEntry {
  Description: string;
  Amount: number;
  DetailType: string;
  JournalEntryLineDetail: JournalEntryLineDetail;

  accountRef(obj: object): AccountRef {
    return {
      value: (accountType.hasOwnProperty(obj['AccountFullName'])) ? accountType[obj['AccountFullName']] : 187,
      name: obj['AccountFullName'],
    };
  }

  journalEntryLine(obj: object): JournalEntryLineDetail {
    return {
      PostingType: (obj['Credit']) ? 'Credit' : 'Debit',
      AccountRef: this.accountRef(obj),
    };
  }

  toQboObject(obj: object): JournalEntry {
    const instance = new JournalEntry();
    instance.Description = obj['Allocation Memo'];
    instance.Amount = (obj['Credit']) ? obj['Credit'] : obj['Debit'];
    instance.DetailType = obj['Memo'];
    instance.JournalEntryLineDetail = this.journalEntryLine(obj);
    return instance;
  }
}