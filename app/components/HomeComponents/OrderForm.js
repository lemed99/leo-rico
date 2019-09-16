import React, { Component } from 'react';
import _ from 'lodash';
import { Search, Input, Form, Button, Label } from 'semantic-ui-react';
import SweetAlert from 'sweetalert2-react';
import swal from 'sweetalert2';

const DEFAULT_QUANTITY = 0;
const DECIMAL = 10;

const initialState = {
  show: false,
  showId: false,
  showQ: false,
  isLoading: false,
  value: '',
  results: [],
  transaction: {
    quantity: DEFAULT_QUANTITY,
    price: '',
  }
};

export default class OrderForm extends Component {

  props: {
    items: [],
    item: {},
    idList: {},
    onResultSelect: () => void,
    onSubmit: () => void
  };

  state = { ...initialState };

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ ...initialState });

  handleResultSelect = (e: {}, result: {}) => {
    let n = 0;
    if (this.props.idList.length < 1) this.setState({ value: result.title }, () => this.props.onResultSelect(result.id));
    else
    {
      for (let i = 0; i < this.props.idList.length; i++) {
        if (this.props.idList[i] === result.id) {
          n = 1;
          this.setState({ showId: true });
          break;
        }
      }
    n === 0 ? this.setState({ value: result.title }, () => this.props.onResultSelect(result.id)) : null;
    }
  };

  handleQuantityChange(event, result) {
    const { value } = result;
    const { item } = this.props;

    const parsedQuantity = !isNaN(parseFloat(value, DECIMAL)) ? parseFloat(value, DECIMAL) : 0;
    if (item.quantity < result.value) this.setState({ show: true });

    else {
      this.setState({
        ...this.state,
        transaction: { ...this.state.transaction,
          quantity: result.value,
          price: parsedQuantity * item.price
        }
      });
    }
  }

  handlePriceChange(event, result) {
    this.setState({
      ...this.state,
      transaction: {
        ...this.state.transaction,
        price: result.value
      }
    });
  }

  handleSubmit() {
    const { item, idList } = this.props;
    const { transaction } = this.state;
    if(transaction.quantity <= 0) {
      this.setState({ showQ: true });
    }
    else {
      this.props.onSubmit({
        itemId: item.id,
        quantity: parseFloat(transaction.quantity),
        price: parseInt(transaction.price, DECIMAL) || DEFAULT_QUANTITY * item.price
      });
      this.resetComponent();
      idList.push(item.id);
      console.log(idList);
    }
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
    const { isLoading, value, results, transaction, show, showId, showQ } = this.state;
    const { item } = this.props;
    return (
      <div>
        <SweetAlert
          show={show}
          title="Erreur"
          text="Stock insuffisant"
          onConfirm={() => this.setState({ show: false })}
        />
        <SweetAlert
          show={showQ}
          title="Erreur"
          text="Quantité invalide"
          onConfirm={() => this.setState({ showQ: false })}
        />
        <SweetAlert
          show={showId}
          title="Erreur"
          text="Ce produit a déjà été sélectionné"
          onConfirm={() => this.setState({ showId: false }, this.resetComponent)}
        />
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
          <Form.Group inline>
            <Form.Field>
              <Input
                labelPosition="right"
                type="text"
                value={transaction.quantity}
                disabled={_.isEmpty(item)}
                onChange={this.handleQuantityChange.bind(this)}
              >
                <input style={{ width: 60 }} />
                <Label basic>{item.unit}</Label>
              </Input>
            </Form.Field>
            <Form.Field>
              <Input
                label={{ basic: true, content: 'FCFA' }}
                labelPosition="right"
                value={parseInt(transaction.price, DECIMAL) || (DEFAULT_QUANTITY * item.price) || 0}
                disabled={_.isEmpty(item)}
                onChange={this.handlePriceChange.bind(this)}
              />
            </Form.Field>
            <Button
              type="button"
              disabled={_.isEmpty(item)}
              onClick={this.handleSubmit.bind(this)}
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
