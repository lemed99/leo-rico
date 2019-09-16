import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Form } from 'semantic-ui-react';
import SweetAlert from 'sweetalert2-react';
import swal from 'sweetalert2';

const initialState = {
  show: false,
  showUnit: false,
  isLoading: false,
  value: '',
  results: [],
  newItem: {
    title: '',
    quantity: 0,
    price: 0,
    unit: '',
  }
};

export default class CreateForm extends Component {

  props: {
    items: {},
    onSubmit: () => void
  };

  state = { ...initialState };

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ ...initialState })

  handleValueChange(type, event, result) {
    this.setState({
      newItem: Object.assign({}, this.state.newItem, {
        [type]: result.value
      })
    });
  }

  handleSubmit() {
    const { items } = this.props;
    const { newItem } = this.state;
    this.resetComponent();
    let n = 0;
    items.map(item => {
      if (item.title === newItem.title && item.unit === newItem.unit) {
        n = 1;
        this.setState({ show: true });
      }
    });
    if(n === 0) {
      if (newItem.unit === "") {
        this.setState({ showUnit: true });
      }
      else {
        this.props.onSubmit({
          title: newItem.title,
          quantity: parseFloat(newItem.quantity),
          unit: newItem.unit,
          price: parseInt(newItem.price, 10)
        });
      }
    }
  }

  render() {
    const { newItem, show, showUnit } = this.state;
    return (
      <div>
        <SweetAlert
          show={show}
          title="Erreur"
          text="Ce produit existe déjà"
          onConfirm={() => this.setState({ show: false })}
        />
        <SweetAlert
          show={showUnit}
          title="Erreur"
          text="Remplissez le champ UNITÉ"
          onConfirm={() => this.setState({ showUnit: false })}
        />
        <Form>
          <Form.Group>
            <Form.Input
              label="Nom"
              type="text"
              value={newItem.title}
              onChange={this.handleValueChange.bind(this, 'title')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Quantité"
              type="text"
              value={newItem.quantity}
              disabled={_.isEmpty(newItem.title)}
              onChange={this.handleValueChange.bind(this, 'quantity')}
            />
            <Form.Input
              label="Unité"
              type="text"
              value={newItem.unit}
              disabled={_.isEmpty(newItem.title)}
              onChange={this.handleValueChange.bind(this, 'unit')}
            >
              <input style={{ width: 120 }} />
            </Form.Input>
            <Form.Input
              label="Prix"
              type="text"
              value={newItem.price}
              disabled={_.isEmpty(newItem.title)}
              onChange={this.handleValueChange.bind(this, 'price')}
            >
              <input style={{ width: 120 }} />
            </Form.Input>
          </Form.Group>
          <Form.Group>
            <Button
              type="button"
              color="blue"
              onClick={this.handleSubmit.bind(this)}
              disabled={_.isEmpty(newItem.title)}
              style={{ marginLeft: 6 }}
            >
              Creer
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
