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

export const getRecordByID = <T extends Record>() => {
  return async (id: string): Promise<T> => {
    const response = await fetch(`http://localhost:5984/eer/${id}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  }
};

export const getRecordsByIDs = <T extends Record>() => {
  return async (ids: string[]): Promise<T[]> => {
    const docs = ids.map((id) => ({ id }));
    const response = await fetch(`http://localhost:5984/eer/_bulk_get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docs })
    });

    const { results } = await response.json();

    return results.map((result: any) => result.docs[0].ok)
      .filter((doc: any) => doc);
  };
};

export const getRecordsByKey = <T extends Record>(view: string) => {
  return async (key: string): Promise<T[]> => {
    const response = await fetch(`http://localhost:5984/eer/_design/eer/_view/${view}?key=${JSON.stringify([key])}`);
    const { rows }: RecordList<T> = await response.json();

    return rows.map((record) => record.value);
  };
};

export const generateRecordID = <T extends Record>(type: T['type']): string => (
  `${type}.${uuid()}`
);

export const createRecord = <T extends Record, TInput, TDefaults = Omit<T, '_id' | '_rev' | 'type'>>(type: string, defaults: TDefaults) => {
  return async (input: TInput): Promise<Pick<T, '_id' | '_rev' | 'type'> & TDefaults & TInput> => {
    const payload: Pick<T, '_id' | 'type'> & TDefaults & TInput = {
      ...defaults,
      type: type,
      ...input,
      _id: generateRecordID<T>(type),
      _rev: undefined
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

export const createBulkRecords = <T extends Record, TInput, TDefaults = Omit<T, '_id' | '_rev' | 'type'>>(type: string, defaults: TDefaults) => {
  return async (inputs: TInput[]): Promise<(Pick<T, '_id' | '_rev' | 'type'> & TDefaults & TInput)[]> => {
    const payloads: (Pick<T, '_id' | 'type'> & TDefaults & TInput)[] = inputs.map((input) => ({
      ...defaults,
      type: type,
      ...input,
      _id: generateRecordID<T>(type),
      _rev: undefined
    }));

    const response = await fetch(`http://localhost:5984/eer/_bulk_docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docs: payloads })
    });

    const results = await response.json();

    return results.map(({ id, rev }: { id: string, rev: string }) => ({
      ...payloads.find((payload) => payload._id === id),
      _id: id,
      _rev: rev
    }));
  };
};


export const updateRecord = <T extends Record, TInput>() => {
  return async (record: T, input: Partial<TInput>): Promise<T & Partial<TInput>> => {
    const payload = {
      ...record,
      ...input
    };

    const response = await fetch(`http://localhost:5984/eer/${record._id}?rev=${record._rev}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const { id, rev } = await response.json();

    return {
      ...payload,
      _id: id,
      _rev: rev
    }
  };
};

export const deleteRecord = <T extends Record>() => {
  return async (record: Pick<T, '_id'> & Partial<Pick<T, '_rev'>>): Promise<void> => {
    const _rev = record._rev ?? (await getRecordByID<T>()(record._id))._rev;

    await fetch(`http://localhost:5984/eer/${record._id}?rev=${_rev}`, {
      method: 'DELETE'
    });
  };
};
