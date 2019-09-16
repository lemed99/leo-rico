// @flow
import React, { Component } from 'react';

import { OrderForm, TransactionTable } from './HomeComponents';

const initialState = {
  item: {},
  idList: [],
};

export default class Home extends Component {
  props: {
    items: [],
    transactions: [],
    actions: {
      getItems: () => void,
      initInventory: () => void,
      order: () => void,
      updateTransactions: () => void
    }
  };

  state = { ...initialState };

  componentDidMount() {
    this.props.actions.initInventory();
  }

  resetItem() {
    return this.setState({ item: {} });
  }

  handleResultSelect(id: number) {
    const { items } = this.props;
    this.setState({ ...this.state, item: items.find(item => item.id === id) });
  }

  handleAdd(transaction: {}={}) {
    this.setState({ item: {} });
    this.props.actions.updateTransactions([...this.props.transactions, transaction]);
  }

  handleDelete(index: number) {
    const newTransactions = [...this.props.transactions];
    newTransactions.splice(index, 1);
    this.props.actions.updateTransactions(newTransactions);
    this.state.idList.splice(index, 1);
  }

  handleOrder() {
    this.props.actions.order(this.props.transactions);
    this.setState({ idList: [] });
  }

  render() {
    const { item, idList } = this.state;
    const { transactions } = this.props;
    return (
      <div>
        <OrderForm
          items={this.props.items}
          item={item}
          idList={idList}
          onResultSelect={this.handleResultSelect.bind(this)}
          onSubmit={this.handleAdd.bind(this)}
        />
        <TransactionTable
          items={this.props.items}
          transactions={transactions}
          onDelete={this.handleDelete.bind(this)}
          onOrder={this.handleOrder.bind(this)}
        />
      </div>
    );
  }
}
