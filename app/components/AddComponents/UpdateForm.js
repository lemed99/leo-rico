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
  newItem: {}
};

export default class UpdateForm extends Component {

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

  handleResultSelect = (e: {}, result: {}) => this.setState({
    value: result.title
  }, () => this.props.onResultSelect(result.id))

  handleValueChange(type, event, result) {
    this.setState({
      newItem: Object.assign({}, this.state.newItem, {
        [type]: result.value
      })
    });
  }

  handleSubmit() {
    swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Vous ne pourrez plus faire marche arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Changer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        const { item } = this.props;
        const { newItem } = this.state;
        this.resetComponent();
        this.props.onSubmit(item.id, {
          title: newItem.title || item.title,
          unit: newItem.unit || item.unit,
          price: parseInt(newItem.price, 10) || item.price
        });
        swal.fire(
          'Produit mis à jour!',
          'Le produit a été bien modifié.',
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'Annulé',
          'Modification du produit annulée',
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
    const { isLoading, value, results, newItem } = this.state;
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
            <Form.Input
              label="Nouveau Nom"
              type="text"
              value={newItem.title}
              disabled={_.isEmpty(item)}
              onChange={this.handleValueChange.bind(this, 'title')}
            />
            <Form.Input
              label="Unité"
              type="text"
              value={newItem.unit}
              disabled={_.isEmpty(item)}
              onChange={this.handleValueChange.bind(this, 'unit')}
            >
              <input style={{ width: 120 }} />
            </Form.Input>
            <Form.Input
              label="Prix"
              type="text"
              value={newItem.price}
              disabled={_.isEmpty(item)}
              onChange={this.handleValueChange.bind(this, 'price')}
            >
              <input style={{ width: 120 }} />
            </Form.Input>
          </Form.Group>
          <Form.Group>
            <Button
              type="button"
              color="blue"
              disabled={_.isEmpty(item)}
              onClick={this.handleSubmit.bind(this)}
              style={{ marginLeft: 6 }}
            >
              Changer
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

