// import faker from 'faker';
import _ from 'lodash';

import { config as CONFIG, sql as SQL, constants as CONST } from '../utils';

const sqlite3 = require('sqlite3').verbose();

class Database {

  constructor() {
    this.db = new sqlite3.Database(`${CONFIG.DB_PATH}${CONFIG.DB_NAME}`);
    console.log(`${CONFIG.DB_PATH}${CONFIG.DB_NAME}`);
  }

  serializeAsync(queries: []) {
    return new Promise(resolve => {
      this.db.serialize(() => {
        const statements = queries.map(query => this.db.prepare(query));
        statements.map(statement => statement.run());
      });
      resolve({ message: 'Database has been successfully updated' });
    });
  }

  runAsync(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          const responseObj = {
            error: err
          };
          reject(responseObj);
        } else {
          const responseObj = {
            statement: this
          };
          resolve(responseObj);
        }
      });
    });
  }

  allAsync(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          const responseObj = {
            error: err
          };
          reject(responseObj);
        } else {
          const responseObj = {
            rows
          };
          resolve(responseObj);
        }
      });
    });
  }

  init() {
    let queries = [];
    queries.push(SQL.CREATE.ITEM_TABLE);
    queries.push(SQL.CREATE.TRANSACTION_TABLE);
    queries.push(SQL.CREATE.ORDER_TABLE);
    return this.allAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='Item';")
    .then(result => {
      if (result.rows.length < 1) {
        queries = queries.concat(getTestItems());
      }
      return this.serializeAsync(queries);
    });
  }

  getTables() {
    return this.allAsync(SQL.SELECT.TABLES);
  }

  getItems(value: string='') {
    return this.allAsync(`SELECT * FROM Item WHERE title LIKE '${value}%' ORDER BY title ASC`);
  }

  getItem(value: string='') {
    return this.allAsync(`SELECT * FROM Item WHERE id = ${value}`);
  }

  createItem(fields: {}={}) {
    return this.runAsync(formatInsert('Item', fields));
  }

  addTransaction(transaction: {}={}, items: []=[]) {
    return this.serializeAsync(formatTransaction(transaction, items));
  }

  updateItem(id: number, data: {}={}) {
    return this.runAsync(formatUpdate('Item', id, data));
  }

  deleteItem(id: number) {
    return this.runAsync(formatDelete('Item', id));
  }

  addTransactions(transactions: []=[], items: []=[]) {
    const queries = Array.prototype.concat.apply([],
      transactions.map(transaction => formatTransaction(transaction, items))
    );
    return this.serializeAsync(queries);
  }

  getMinMaxTransactionTimestamp() {
    return this.allAsync('SELECT MIN(timestamp) AS min, MAX(timestamp) AS max FROM [Transaction] WHERE orderId IS NOT NULL');
  }

  getTransactions(dateString: string=CONST.MOMENT.DEFAULT_DATE, isTransaction: boolean=true) {
    return this.allAsync(`SELECT id, itemId, orderId, price, quantity, datetime(timestamp,'localtime') FROM [Transaction] WHERE orderId IS ${isTransaction ? 'NOT ' : ''}NULL AND strftime('%d-%m-%Y', timestamp) = '${dateString}'`);
  }

  addOrder() {
    return this.runAsync('INSERT INTO [Order] (id) VALUES (null)');
  }

  close() {
    this.db.close();
  }
}

// the entries of fields should be correctly indexed to the entries of values
const formatInsert = (table: string, data: {}={}) => {
  const formattedData = formatData(data);
  return `INSERT INTO [${table}] (${Object.keys(formattedData).join(',')}) VALUES (${Object.values(formattedData).join(',')})`;
};

const formatUpdate = (table: string, id: number, data: {}={}) => {
  const formattedData = formatData(data);
  const fields = Object.keys(formattedData).map(key => `${key} = ${formattedData[key]}`);
  return `UPDATE [${table}] SET ${fields.join(',')} WHERE id = ${id}`;
};

const formatDelete = (table: string, id: number) => `DELETE FROM [${table}] WHERE id = ${id}`;

const formatTransaction = (transaction: {}={}, items: []=[]) => {
  const item = items.find(i => i.id === transaction.itemId);
  const quantity = transaction.orderId ?
    item.quantity - transaction.quantity :
    item.quantity + transaction.quantity;
  return [
    formatInsert('Transaction', transaction),
    formatUpdate('Item', transaction.itemId, { quantity })
  ];
};

const formatData = (data: {}={}) => {
  const formattedData = { ...data };
  Object.keys(data).map(k => {
    if (_.isString(data[k])) {
      formattedData[k] = insertQuote(data[k]);
    }
  });
  return formattedData;
};

const insertQuote = (input: string) => `'${input}'`;

const getTestItems = () => {
  const queries = [];
  for (let i = 0; i < 1; i += 1) {
    queries.push(SQL.INSERT.ITEM(
      "EBIS",
      1,
      "Application",
      1000000
    ));
  }
  return queries;
};

export default Database;
