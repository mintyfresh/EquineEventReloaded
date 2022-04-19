import { v4 as uuid } from 'uuid';

export interface Record {
  _id: string;
  _rev: string;
  type: string;
}

export interface RecordListItem<T extends Record> {
  id: string;
  key: string | string[] | null;
  value: T;
}

export interface RecordList<T extends Record> {
  offset: number;
  rows: RecordListItem<T>[];
  total_count: number;
}

export const getRecordsByIds = <T extends Record>(view: string) => {
  return async (ids: string[]): Promise<T[]> => {
    const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/${view}?keys=${JSON.stringify(ids)}`);
    const { rows }: RecordList<T> = await response.json();

    return rows.map((record) => record.value);
  };
};

export const createRecord = <T extends Record, TInput, TDefaults = Omit<T, '_id' | '_rev' | 'type'>>(type: string, defaults: TDefaults) => {
  return async (input: TInput): Promise<Pick<T, '_id' | '_rev' | 'type'> & TDefaults & TInput> => {
    const payload: Pick<T, '_id' | 'type'> & TDefaults & TInput = {
      ...defaults,
      _id: `${type}.${uuid()}` as string,
      type: type,
      ...input
    };

    const response = await fetch(`http://localhost:5984/eer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const { id, rev } = await response.json();

    return {
      ...payload,
      _id: id,
      _rev: rev
    };
  };
};

export const updateRecord = <T extends Record, TInput>() => {
  return async (record: T, input: Partial<TInput>): Promise<T & Partial<TInput>> => {
    const response = await fetch(`http://localhost:5984/eer/${record._id}?rev=${record._rev}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    const { id, rev } = await response.json();

    return {
      ...record,
      ...input,
      _id: id,
      _rev: rev
    }
  };
};

export const deleteRecord = <T extends Record>() => {
  return async (record: T): Promise<void> => {
    await fetch(`http://localhost:5984/eer/${record._id}?rev=${record._rev}`, {
      method: 'DELETE'
    });
  };
};
