import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

import { Table, Filters } from './TransactionComponents';
import { DateHelper } from '../helpers';

const DATE_FORMAT = 'DD-MM-YYYY';
const MONTH_FORMAT = 'MMMM';
const DAY_FORMAT = 'DD';
const YEAR_FORMAT = 'YYYY';

class Transaction extends Component {
  props: {
    transactions: [],
    items: [],
    range: {},
    actions: {
      getItems: () => void,
      getTransactions: () => void
    }
  }
  state = {
    filters: {
      day: moment().format(DAY_FORMAT),
      month: moment().format(MONTH_FORMAT),
      year: moment().format(YEAR_FORMAT),
      isTransaction: true
    }
  }

  componentWillMount() {
    this.props.actions.getItems();
    this.props.actions.getTransactions();
  }

  handleChange(type, event, result) {
    let value = result;
    if ('checked' in result) {
      value = result.checked;
    } else if (result.value) {
      value = result.value;
    }
    this.setState({
      filters: { ...this.state.filters, [type]: value }
    });
  }

  handleFilter() {
    const { filters } = this.state;
    return this.props.actions.getTransactions({
      ...filters,
      month: moment(filters.month, MONTH_FORMAT).format('MM'),
    });
  }

  render() {
    const { transactions, items, range } = this.props;
    const { filters } = this.state;

    const parsedRange = { min: moment(range.min).format(DATE_FORMAT), max: moment(range.max).format(DATE_FORMAT) };
    const monthOptions = DateHelper.getMonthOptions(parsedRange);
    const dayOptions = DateHelper.getDayOptions(parsedRange);

    const days = dayOptions.map((v, i) => ({ key: v, value: v, text: v }));
    const months = monthOptions.map((v, i) => ({ key: v, value: v, text: v }));
    const years = DateHelper.getYearOptions(parsedRange).map(v => ({ key: v, value: v, text: v }));

    return (
      <div>
        <Filters
          dayOptions={days}
          monthOptions={months}
          yearOptions={years}
          filters={filters}
          onChange={this.handleChange.bind(this)}
          onSubmitFilter={this.handleFilter.bind(this)}
        />
        <Table
          transactions={transactions}
          filters={filters}
          items={items}
        />
      </div>
    );
  }
}

export default Transaction;
