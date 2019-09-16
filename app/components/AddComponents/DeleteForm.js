import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Search, Form } from 'semantic-ui-react';
import SweetAlert from 'sweetalert2-react';
import swal from 'sweetalert2';

const initialState = {
  isLoading: false,
  value: '',
  results: []
};
export default class DeleteForm extends Component {

  props: {
    items: [],
    item: {},
    onResultSelect: () => void,
    onSubmit: () => void
  };

  state = { ...initialState };

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ ...initialState });

  handleResultSelect = (e: {}, result: {}) => this.setState({
    value: result.title
  }, () => this.props.onResultSelect(result.id));

  handleSubmit() {
    swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Vous ne pourrez plus faire marche arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        const { item } = this.props;
        this.resetComponent();
        this.props.onSubmit(item.id);
        swal.fire(
          'Supprimé!',
          'Le produit a été bien supprimé.',
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'Annulé',
          'Le produit est gardé',
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
    const { isLoading, value, results } = this.state;
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
            <Button
              type="button"
              color="blue"
              disabled={_.isEmpty(item)}
              onClick={this.handleSubmit.bind(this)}
              style={{ marginLeft: 6 }}
            >
              Supprimer
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

