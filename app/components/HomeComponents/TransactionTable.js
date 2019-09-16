import React, { Component } from 'react';
import { Table, Icon, Button, Container, Input } from 'semantic-ui-react';
import SweetAlert from 'sweetalert2-react';
import swal from 'sweetalert2';
import _ from 'lodash';

const initialState = {
  relicat: 0,
  montant_initial: 0
};

let total;

class TransactionTable extends Component {
  props: {
    transactions: [],
    items: [],
    onDelete: () => void,
    onOrder: () => void
  };

  state = { ...initialState };

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ ...initialState });

  relicat = () => {
    this.setState({ relicat: (this.state.montant_initial - total) });
  };

  handleChange = (event, result) => {
    this.setState({ montant_initial: result.value });
  };

  handleOrder = () => {
    swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Vous ne pourrez plus faire marche arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Vendre',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        this.props.onOrder();
        this.setState({ relicat: 0 });
        this.setState({ montant_initial: 0 });
        swal.fire(
          'Produit(s) vendu!',
          'Vente effectuée.',
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'Annulé',
          'Vente annulée',
          'error'
        )
      }
    })
  };

  render() {
    const { transactions, items, onDelete } = this.props;
    total = (_.sumBy(this.props.transactions, 'price'));
    const entries = transactions.map((t, index) => (
      <Table.Row key={index}>
        <Table.Cell textAlign="center">{index}</Table.Cell>
        <Table.Cell textAlign="center">{items.find(item => item.id === t.itemId).title}</Table.Cell>
        <Table.Cell textAlign="center">{items.find(item => item.id === t.itemId).unit}</Table.Cell>
        <Table.Cell textAlign="center">{t.quantity}</Table.Cell>
        <Table.Cell textAlign="center">{(new Intl.NumberFormat('de-DE').format(t.price))}</Table.Cell>
        <Table.Cell textAlign="center">
          <Icon
            size="large"
            color="red"
            name="remove"
            onClick={onDelete.bind(null, index)}
          />
        </Table.Cell>
      </Table.Row>
    ));

    return (
      <div>
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing textAlign="center">ID</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Nom</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Unité</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Quantité</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Prix</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Supprimer</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {entries}
          </Table.Body>
        </Table>
        <div style={{display:"flex", justifyContent:"space-around"}}>
          <div style = {{
            textAlign: "center",
            margin: "40px 0"
          }}>
            Total :
            <span style={{ fontWeight: "bold" }} > {" "+(new Intl.NumberFormat('de-DE').format(total))+" FCFA"} </span>
          </div>
          <div style={{display:"flex", alignItems:"center"}}>
            <span>
              Montant initial :
            </span>
            <span style={{margin: "0 15px"}}>
              <Input
                value={this.state.montant_initial}
                onChange={this.handleChange}
                focus
              />
            </span>
            <span style={{margin: "0 15px"}}>
              <Button onClick={this.relicat} primary>Relicat</Button>
            </span>
            <span>
              {this.state.relicat+" FCFA"}
            </span>
          </div>
        </div>

        <Container fluid>
          <Button
            floated="right"
            color="green"
            onClick={this.handleOrder}
            disabled={transactions.length < 1}
          >
            <Icon name="add to cart" /> Vendre
          </Button>
        </Container>
      </div>
    );
  }
}

export default TransactionTable;
