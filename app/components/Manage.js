import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

import { RestockForm, UpdateForm, CreateForm, DeleteForm } from './AddComponents';

const StyledMenu = styled(Menu)`
  &&& {
      border-bottom: none!important;
   } 
`;

const RESTOCK = 'stock';
const EDIT = 'editer';
const CREATE = 'creer';
const DELETE = 'supprimer';

const initialState = {
  itemUpdate: {},
  itemRestock: {},
  itemDelete: {},
  activeTab: RESTOCK
};

class Manage extends Component {
  props: {
    items: [],
    actions: {
      initInventory: () => void,
      restock: () => void,
      updateItem: () => void,
      createItem: () => void,
      deleteItem: () => void
    }
  };

  state = { ...initialState };

  componentDidMount() {
    this.props.actions.initInventory();
  }

  resetItem() {
    return this.setState({ itemUpdate: {}, itemRestock: {}, itemDelete: {} });
  }

  handleTabClick = (e, { name }) => this.setState({ activeTab: name });

  handleResultSelectRestock(id: number) {
    const { items } = this.props;
    this.setState({ ...this.state, itemRestock: items.find(item => item.id === id) });
  }

  handleResultSelectUpdate(id: number) {
    const { items } = this.props;
    this.setState({ ...this.state, itemUpdate: items.find(item => item.id === id) });
  }

  handleResultSelectDelete(id: number) {
    const { items } = this.props;
    this.setState({ ...this.state, itemDelete: items.find(item => item.id === id) });
  }

  handleAdd(transaction: {}={}) {
    return this.props.actions.restock(transaction)
    .then(() => this.resetItem());
  }

  handleUpdate(index: number, fields: {}={}) {
    return this.props.actions.updateItem(index, fields)
    .then(() => this.resetItem());
  }

  handleCreate(item: {}={}) {
    return this.props.actions.createItem(item);
  }

  handleDelete(index: number) {
    return this.props.actions.deleteItem(index)
    .then(() => this.resetItem());
  }

  render() {
    const { itemRestock, itemUpdate, itemDelete, activeTab } = this.state;

    const tabContent = {
      [RESTOCK]: (<RestockForm
        items={this.props.items}
        item={itemRestock}
        onResultSelect={this.handleResultSelectRestock.bind(this)}
        onSubmit={this.handleAdd.bind(this)}
      />),
      [EDIT]: (<UpdateForm
        items={this.props.items}
        item={itemUpdate}
        onResultSelect={this.handleResultSelectUpdate.bind(this)}
        onSubmit={this.handleUpdate.bind(this)}
      />),
      [CREATE]: (<CreateForm
        items={this.props.items}
        onSubmit={this.handleCreate.bind(this)}
      />),
      [DELETE]: (<DeleteForm
        items={this.props.items}
        item={itemDelete}
        onResultSelect={this.handleResultSelectDelete.bind(this)}
        onSubmit={this.handleDelete.bind(this)}
      />),
    };

    return (
      <div>
        <StyledMenu pointing secondary>
          <Menu.Item name={RESTOCK} active={activeTab === RESTOCK} onClick={this.handleTabClick} />
          <Menu.Item name={EDIT} active={activeTab === EDIT} onClick={this.handleTabClick} />
          <Menu.Item name={CREATE} active={activeTab === CREATE} onClick={this.handleTabClick} />
          <Menu.Item name={DELETE} active={activeTab === DELETE} onClick={this.handleTabClick} />
        </StyledMenu>
        <Segment padded>
          {tabContent[activeTab]}
        </Segment>
      </div>
    );
  }
}

Manage.propTypes = {

};

export default Manage;
