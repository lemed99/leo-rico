// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { initInventory, updateItem, createItem, deleteItem } from '../actions/inventoryActionCreator';
import { restock } from '../actions/transactionActionCreator';
import Manage from '../components/Manage';

const mapStateToProps = state => ({
  items: state.inventory.items,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    initInventory, restock, updateItem, createItem, deleteItem
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Manage);
