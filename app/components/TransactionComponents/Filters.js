import React, { Component } from 'react';
import _ from 'lodash'
import { Segment, Select, Button, Checkbox, Form } from 'semantic-ui-react';

class Filters extends Component {
  props: {
    filters: {},
    dayOptions: [],
    monthOptions: [],
    yearOptions: [],
    onChange: () => void,
    onSubmitFilter: () => void
  }
  render() {
    const { filters, onSubmitFilter, dayOptions, monthOptions, yearOptions } = this.props;

    return (
      <div style={{ marginBottom: 10 }}>
        <Segment color="red">
          <Select
            placeholder="Selectionner un jour"
            options={dayOptions}
            value={filters.day}
            onChange={this.props.onChange.bind(null, 'day')}
          />
          <Select
            style={{ marginLeft: 10 }}
            placeholder="Selectionner un mois"
            options={monthOptions}
            value={_.upperFirst(filters.month)}
            onChange={this.props.onChange.bind(null, 'month')}
          />
          <Select
            style={{ marginLeft: 10 }}
            placeholder="Selectionner une année"
            options={yearOptions}
            value={parseInt(filters.year, 10)}
            onChange={this.props.onChange.bind(null, 'year')}
          />
          <Checkbox
            style={{ marginLeft: 10 }}
            checked={filters.isTransaction}
            label={{ children: 'Transactions' }}
            onChange={this.props.onChange.bind(null, 'isTransaction')}
          />
          <Button
            style={{ marginLeft: 10 }}
            color="green"
            onClick={onSubmitFilter}
          >
            OK
          </Button>
        </Segment>
      </div>
    );
  }
}

export default Filters;
