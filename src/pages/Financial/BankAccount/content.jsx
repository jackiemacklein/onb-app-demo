/**
 * Styles
 */
import "./style.scss";

/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classnames from "classnames/dedupe";
import { TabContent, TabPane, Nav, NavItem, NavLink, Label, Input } from "reactstrap";
import ReactSortable from "react-sortablejs";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import api from "../../../utils/api";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 1,
      filiais: [],
      accounts: [],

      term: "",
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadAccounts = this.loadAccounts.bind(this);
  }

  toggleTab(id) {
    this.setState({
      activeTab: id,
    });
  }

  async loadFiliais() {
    try {
      const { data } = await api.get("/filiais");
      if (data.length > 0) {
        this.setState({ filiais: data, activeTab: data[0].id });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar filiais");
    }
  }

  async loadAccounts() {
    try {
      const { data } = await api.get("/banks/accounts");
      this.setState({ accounts: data });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Contas e Carteiras");
    }
  }

  componentDidMount() {
    this.loadAccounts();
    this.loadFiliais();
  }

  render() {
    const { activeTab, term } = this.state;

    return (
      <Fragment>
        <div className="rui-filemanager-head mb-20">
          <div className="row sm-gap vertical-gap align-items-center">
            <div className="col">
              <div className="input-group">
                <div className="input-group-prepend mnl-3">
                  <button type="button" className="btn btn-clean btn-grey-5 mb-0 mnl-10">
                    <Icon name="search" />
                  </button>
                </div>
                <input
                  type="search"
                  value={this.state.term}
                  onChange={event => this.setState({ term: event.target.value })}
                  className="form-control form-control-clean rui-search-input"
                  placeholder="Digite aqui para pesquisar..."
                />
              </div>
            </div>

            <div className="col-auto">
              <Link to="/contas/add">
                <button type="button" className="btn btn-brand btn-sm btn-uniform btn-round">
                  <Icon name="plus" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="row vertical-gap">
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body pt-20 pr-10 pb-20 pl-10">
                <Nav className="flex-column mnt-3">
                  {this.state.filiais.map(item => (
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === item.id })} onClick={() => this.toggleTab(item.id)} href="#">
                        <Icon name="radio" />
                        <span>{item.name}</span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <TabContent activeTab="accounts">
              <TabPane tabId={`accounts`}>
                <div className="card">
                  <div className="card-body py-30">
                    <h2>Listagem</h2>
                    <ul className="list-group list-group-flush rui-project-releases-list">
                      {this.state.accounts.map(item => {
                        if (
                          (term === "" ||
                            item.name.toUpperCase().includes(term.toUpperCase()) ||
                            item.description.toUpperCase().includes(term.toUpperCase()) ||
                            item.bank.name.toUpperCase().includes(term.toUpperCase())) &&
                          item.filial_id === activeTab
                        ) {
                          return (
                            <li className="list-group-item">
                              <div className="rui-changelog">
                                <h3 className="rui-changelog-title">{item.name}</h3>
                                <div className="rui-changelog-subtitle">
                                  <Link to="#">{item.bank.name}</Link>
                                  <br />
                                  {item.description}
                                </div>
                                <ul className="list-unstyled">
                                  <li>
                                    <div className="rui-changelog-item rui-changelog-success">
                                      <span className="rui-changelog-item-type">Saldo Atual:</span>
                                      <strong>R$ {item.current_balance ? current_balance.toLocaleString() : 0}</strong>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="rui-changelog-item rui-changelog-brand">
                                      <span className="rui-changelog-item-type">Saldo Previsto:</span>
                                      <strong>R$ {item.current_balance ? expected_balance.toLocaleString() : 0}</strong>
                                    </div>
                                  </li>
                                </ul>
                                <ul className="list-unstyled options">
                                  <li>
                                    <Link className="rui-changelog-file" to={`/lancamentos/?bank_account_id=${item.id}`}>
                                      <Icon name="search" />
                                      Ver detalhes da conta
                                    </Link>
                                  </li>
                                  <li>
                                    <Link className="rui-changelog-file" to={`/contas/edit/${item.id}`}>
                                      <Icon name="edit" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ settings }) => ({
  settings,
}))(Content);
