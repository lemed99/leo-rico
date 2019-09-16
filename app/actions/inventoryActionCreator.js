import { INVENTORY as I } from './constants';
import { Database } from '../services';

const db = new Database();

const initInventoryRequest = () => ({
  type: I.INIT_INVENTORY_REQUEST,
});

const initInventoryFailure = () => ({
  type: I.INIT_INVENTORY_FAILURE,
});

const initInventorySuccess = (range: {}={}) => ({
  type: I.INIT_INVENTORY_SUCCESS,
  range,
});

const getItemsRequest = () => ({
  type: I.GET_ITEMS_REQUEST,
});

const getItemsFailure = () => ({
  type: I.GET_ITEMS_FAILURE,
});

const getItemsSuccess = (items: []) => ({
  type: I.GET_ITEMS_SUCCESS,
  items
});

const updateItemRequest = () => ({
  type: I.UPDATE_ITEM_REQUEST,
});

const updateItemFailure = () => ({
  type: I.UPDATE_ITEM_FAILURE,
});

const updateItemSuccess = () => ({
  type: I.UPDATE_ITEM_SUCCESS,
});

const createItemRequest = () => ({
  type: I.CREATE_ITEM_REQUEST,
});

const createItemFailure = () => ({
  type: I.CREATE_ITEM_FAILURE,
});

const createItemSuccess = () => ({
  type: I.CREATE_ITEM_SUCCESS,
});
const deleteItemRequest = () => ({
  type: I.DELETE_ITEM_REQUEST,
});

const deleteItemFailure = () => ({
  type: I.DELETE_ITEM_FAILURE,
});

const deleteItemSuccess = () => ({
  type: I.DELETE_ITEM_SUCCESS,
});

const getItems = (input: string='') => (
  (dispatch) => {
    dispatch(getItemsRequest());
    return db.getItems(input)
      .then(response => (
        response.error ?
        dispatch(getItemsFailure(response.error)) :
        dispatch(getItemsSuccess(response.rows))
      ))
      .catch(ex => {
        dispatch(getItemsFailure());
        console.error('Error in trying to get items: ', ex);
      });
  }
);

const updateItem = (id, fields: {}={}) => (
  (dispatch) => {
    dispatch(updateItemRequest());
    return db.updateItem(id, fields)
      .then(response => {
        if (response.error) {
          return dispatch(updateItemFailure(response.error));
        }
        dispatch(updateItemSuccess(response.rows));
        return dispatch(getItems());
      })
      .catch(ex => {
        dispatch(updateItemFailure());
        console.error('Error in trying to update item: ', ex);
      });
  }
);

const createItem = (fields: {}={}) => (
  (dispatch) => {
    dispatch(createItemRequest());
    return db.createItem(fields)
      .then(response => {
        if (response.error) {
          return dispatch(createItemFailure(response.error));
        }
        dispatch(createItemSuccess(response.rows));
        return dispatch(getItems());
      })
      .catch(ex => {
        dispatch(createItemFailure());
        console.error('Error in trying to create item: ', ex);
      });
  }
);

const deleteItem = (id: number) => (
  (dispatch) => {
    dispatch(deleteItemRequest());
    return db.deleteItem(id)
      .then(response => {
        if (response.error) {
          return dispatch(deleteItemFailure(response.error));
        }
        dispatch(deleteItemSuccess(response.rows));
        return dispatch(getItems());
      })
      .catch(ex => {
        dispatch(deleteItemFailure());
        console.error('Error in trying to delete item: ', ex);
      });
  }
);

const initInventory = () => (
  dispatch => {
    dispatch(initInventoryRequest());
    return db.init()
    .then(() =>
      db.getMinMaxTransactionTimestamp())
    .then((response) => {
      if (response.error) {
        return dispatch(initInventoryFailure());
      }
      dispatch(initInventorySuccess(response.rows[0]));
      return dispatch(getItems());
    });
  }
);

module.exports = {
  getItems,
  initInventory,
  updateItem,
  createItem,
  deleteItem
};
