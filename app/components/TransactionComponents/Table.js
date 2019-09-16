import React, { Component } from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');
import _ from 'lodash';
import { Segment } from 'semantic-ui-react';

const Cell = (props: {}={}) => (
  <div style={{ textAlign: 'center' }}>
    <p>{props.value}</p>
  </div>
);

export default class Table extends Component {
  props: {
    transactions: [],
    items: []
  }

  columns = [
    {
      Header: 'Transactions',
      columns: [
        {
          Header: 'Heure',
          id: "datetime(timestamp,'localtime')",
          width: 140,
          accessor: d => moment(d["datetime(timestamp,'localtime')"]).format('HH:mm'),
          Cell: row => (<Cell {...row} className='table_timestamp'/>)
        },
        {
          Header: 'Produit',
          id: 'itemId',
          accessor: d => this.props.items.find(i => i.id === d.itemId).title,
          Cell: row => (<Cell {...row} className='table_item-title'/>)
        },
        {
          Header: 'Quantité',
          id: 'quantity',
          accessor: d => d.quantity,
          width: 150,
          Cell: row => (<Cell {...row} className='table_quantity'/>)
        },
        {
          Header: 'Unité',
          id: 'unit',
          accessor: d => this.props.items.find(i => i.id === d.itemId).unit,
          width: 80,
          Cell: row => (<Cell {...row} className='table_unit'/>)
        },
        {
          Header: 'Montant',
          id: 'price',
          accessor: d => (new Intl.NumberFormat('de-DE').format(d.price)),
          Cell: row => (<Cell {...row} className='table_amount'/>)
        },
      ]
    },
  ];

  render() {
    const { transactions, items } = this.props;
    const total = (_.sumBy(transactions, 'price'));

    return (
      <div>
        <Segment loading={items.length < 1}>
          {
            items.length > 0 &&
            <ReactTable
              ref="reactTable"
              className="-striped -highlight"
              data={transactions}
              columns={this.columns}
              defaultPageSize={15}
              filterable
              previousText="Précédent"
              nextText="Suivant"
              loadingText="Chargement..."
              noDataText="Aucune donnée trouvée"
              pageText="Page"
              ofText="sur"
              rowsText="lignes"
            />
          }
        </Segment>
        <div style = {{
          textAlign: "center",
          marginTop: "40px",
          fontSize: "20px"
        }}>
          Total :
          <span style={{ fontWeight: "bold" }} > {" "+(new Intl.NumberFormat('de-DE').format(total))+" FCFA"} </span>
        </div>
      </div>
    );
  }
}
