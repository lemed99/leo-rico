import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Search, Form, Input, Label } from 'semantic-ui-react';
import SweetAlert from 'sweetalert2-react';
import swal from 'sweetalert2';

const DEFAULT_QUANTITY = 1;
const DECIMAL = 10;

const initialState = {
  isLoading: false,
  value: '',
  results: [],
  transaction: {
    quantity: DEFAULT_QUANTITY,
    price: '0',
  }
};

export default class RestockForm extends Component {

  props: {
    items: [],
    item: {},
    onResultSelect: () => void,
    onSubmit: () => void
  }

  state = { ...initialState }

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ ...initialState })

  handleResultSelect = (e: {}, result: {}) => this.setState({ value: result.title }, () => this.props.onResultSelect(result.id))

  handleQuantityChange(event, result) {
    const { value } = result;
    const { item } = this.props;

    const parsedQuantity = !isNaN(parseFloat(value, DECIMAL)) ? parseFloat(value, DECIMAL) : 0;
    this.setState({
      ...this.state,
      transaction: { ...this.state.transaction,
        quantity: result.value
      }
    });
  }

  handleSubmit() {
    swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Vous ne pourrez plus faire marche arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        const { item } = this.props;
        const { transaction } = this.state;
        this.resetComponent();
        this.props.onSubmit({
          itemId: item.id,
          quantity: parseFloat(transaction.quantity),
          price: parseInt(transaction.price, DECIMAL)
        });
        swal.fire(
          'Stock mis à jour!',
          'Le stock a été bien modifié.',
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'Annulé',
          'Mise à jour du stock annulée',
          'error'
        )
      }
    })
  }

  handleSearchChange = (e: {}, value: string) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = (result) => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.props.items || [], isMatch),
      });
    }, 500);
  }

  render() {
    const { isLoading, value, results, transaction } = this.state;
    const { item } = this.props;
    return (
      <div>
        <Form>
          <Form.Group>
            <Form.Field>
              <Search
                style={{ marginBottom: 3 }}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={formatResults(results)}
                value={value}
                noResultsMessage = "Aucun résultat"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <Input
                labelPosition="right"
                type="text"
                value={transaction.quantity}
                disabled={_.isEmpty(item)}
                onChange={this.handleQuantityChange.bind(this)}
              >
                <input style={{ width: 120 }} />
                <Label basic>{item.unit}</Label>
              </Input>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Button
              type="button"
              color="blue"
              onClick={this.handleSubmit.bind(this)}
              disabled={_.isEmpty(item)}
              style={{ marginLeft: 6 }}
            >
              Ajouter
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

const formatResults = (results: []=[]) => {
  const formattedResults = results.map(item => {
    const formattedItem = { ...item, description: item.quantity };
    formattedItem.title = `${formattedItem.title} [${formattedItem.unit}]`;
    formattedItem.description = `${formattedItem.description} ${formattedItem.unit}`;
    formattedItem.price = `${formattedItem.price} FCFA`;
    return formattedItem;
  });
  return formattedResults;
};

