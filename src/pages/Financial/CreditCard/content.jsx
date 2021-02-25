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
import { Row } from "reactstrap";
import Dropdown from "../../../components/bs-dropdown";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import Tabs from "../../../components/tabs";
import api from "../../../utils/api";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "1",
      filiais: [],
      cards: [],

      term: "",
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadCards = this.loadCards.bind(this);
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

  async loadCards() {
    try {
      const { data } = await api.get("/credit-cards");
      this.setState({ cards: data });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Cartões de Crédito");
    }
  }

  componentDidMount() {
    this.loadCards();
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
              <Link to="/cartoes-de-credito/add">
                <button type="button" className="btn btn-brand btn-sm btn-uniform btn-round">
                  <Icon name="plus" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="rui-profile row vertical-gap">
          <div className="col-12">
            <Tabs sliding>
              {this.state.filiais.map(item => (
                <Tabs.NavItem isActive={activeTab === item.id} onClick={() => this.toggleTab(item.id)}>
                  {item.name}
                </Tabs.NavItem>
              ))}
            </Tabs>
            <Tabs.Content activeTab="tab">
              <Tabs.Pane tabId="tab">
                <Row>
                  {this.state.cards.map(item => {
                    if (
                      (term === "" ||
                        item.name.toUpperCase().includes(term.toUpperCase()) ||
                        item.credit_card_flag.name.toUpperCase().includes(term.toUpperCase())) &&
                      item.filial_id === activeTab
                    ) {
                      return (
                        <div className="col-xs-12 col-lg-6 col-xl-6 mb-10">
                          <div className="card">
                            <Dropdown tag="div" direction="left" className="btn-group p-10 menu-credit-card" showTriangle>
                              <Dropdown.Toggle tag="a" className="dropdown-item">
                                <button type="button" className="btn btn-sm btn-uniform btn-brand" size="sm">
                                  <Icon name="more-vertical" />
                                </button>
                              </Dropdown.Toggle>
                              <Dropdown.Menu tag="ul" className="nav">
                                <li>
                                  <Link to={`/cartoes-de-credito/edit/${item.id}`} className="nav-link">
                                    <Icon name="edit" />
                                    <span>Editar</span>
                                    <span className="rui-nav-circle"></span>
                                  </Link>
                                </li>
                                <li>
                                  <Link to={`/cartoes-de-credito/${item.id}/relatorio`} className="nav-link">
                                    <Icon name="bar-chart" />
                                    <span>Detalhes/Relatório</span>
                                    <span className="rui-nav-circle"></span>
                                  </Link>
                                </li>
                              </Dropdown.Menu>
                            </Dropdown>
                            <div className="card-body">
                              <div className="row vertical-gap">
                                <div className="col-auto">
                                  <div className="rui-profile-img" style={{ width: "100px", height: "100px" }}>
                                    <img src={item.credit_card_flag.icon} alt="" />
                                  </div>
                                </div>

                                <div className="col">
                                  <div className="rui-profile-info">
                                    <h3 className="rui-profile-info-title h4">{item.name}</h3>
                                    <small className="text-grey-6 mt-2 mb-15">{item.credit_card_flag.name}</small>
                                  </div>
                                </div>
                              </div>
                              <div className="rui-profile-numbers">
                                <div className="row justify-content-center">
                                  <div className="col" />
                                  <div className="col-auto">
                                    <div className="rui-profile-number text-center">
                                      <h4 className="rui-profile-number-title h2">R$ {item.limit?.toLocaleString()}</h4>
                                      <small className="text-grey-6">Limite</small>
                                    </div>
                                  </div>
                                  <div className="col p-0" />
                                  <div className="col-auto">
                                    <div className="rui-profile-number text-center">
                                      <h4 className="rui-profile-number-title h2">R$ {item.available_limit ? item.available_limit.toLocaleString() : "-"}</h4>
                                      <small className="text-grey-6">Disponível</small>
                                    </div>
                                  </div>
                                  <div className="col p-0" />
                                  <div className="col-auto">
                                    <div className="rui-profile-number text-center">
                                      <h4 className="rui-profile-number-title h2">{item.expiration_day}</h4>
                                      <small className="text-grey-6">Dia de Vencimento</small>
                                    </div>
                                  </div>
                                  <div className="col" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </Row>
              </Tabs.Pane>
            </Tabs.Content>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ settings }) => ({
  settings,
}))(Content);
