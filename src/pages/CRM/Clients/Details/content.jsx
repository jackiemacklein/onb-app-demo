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
import { Label, Input } from "reactstrap";
import { parseISO, format } from "date-fns";
import { withRouter } from "react-router-dom";

/**
 * import services/utils
 */
import api from "./../../../../utils/api";

/**
 * Internal Dependencies
 */
import Icon from "../../../../components/icon";
import FancyBox from "../../../../components/fancybox";
import Tabs from "../../../../components/tabs";
import Timeline from "../../../../components/timeline";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "timeline",
      data: { name: "", phone: "", email: "", cpf: "", profile: { name: "" }, sales: [], qtde_cancel: 0, qtde_sales: 0, fat_sales: 0 },
      timeline: [],
      loading: false,
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  toggleTab(name) {
    this.setState({
      activeTab: name,
    });
  }

  async loadData() {
    const { id } = this.props.match.params;

    const { data } = await api.get(`crm/clients/${id}/details`);
    const { data: timeline } = await api.get(`crm/clients/${id}/timeline`);

    this.setState({
      data: data,
      timeline,
      id,
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { activeTab } = this.state;

    return (
      <Fragment>
        <div className="rui-profile row vertical-gap">
          <div className="col-lg-6 col-xl-5">
            <div className="card">
              <div className="card-body">
                <div className="row vertical-gap">
                  <div className="col">
                    <div className="rui-profile-info">
                      <h3 className="rui-profile-info-title h4">{this.state.data.name}</h3>
                      <small className="text-grey-6 mt-2 mb-15">{this.state.data.cpf}</small>
                      <Link className="rui-profile-info-mail" to={`mailto:${this.state.data.email}`}>
                        {this.state.data.email}
                      </Link>
                      <Link className="rui-profile-info-phone" to={`tel:${this.state.data.phone}`}>
                        {this.state.data.phone}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="rui-profile-numbers">
                  <div className="row justify-content-center">
                    <div className="col" />
                    <div className="col-auto">
                      <div className="rui-profile-number text-center">
                        <h4 className="rui-profile-number-title h2">{this.state.data.qtde_sales}</h4>
                        <small className="text-grey-6">Atendimentos</small>
                      </div>
                    </div>
                    <div className="col p-0" />
                    <div className="col-auto">
                      <div className="rui-profile-number text-center">
                        <h4 className="rui-profile-number-title h2">R$ {this.state.data.fat_sales.toLocaleString()}</h4>
                        <small className="text-grey-6">Faturamento</small>
                      </div>
                    </div>
                    <div className="col p-0" />
                    <div className="col-auto">
                      <div className="rui-profile-number text-center">
                        <h4 className="rui-profile-number-title h2">{this.state.data.qtde_cancel}</h4>
                        <small className="text-grey-6">Desistências</small>
                      </div>
                    </div>
                    <div className="col" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-7">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <h2 className="card-title mnb-6 mr-auto">Últimos atendimentos</h2>
                  {/*<Link to={`/pdv/balcao/${this.state.data.id}`}>
                    <button className="btn btn-brand btn-uniform btn-round btn-sm mnt-8 mnb-8" type="button">
                      <Icon name="plus" />
                    </button>
    </Link>*/}
                </div>
                <ul className="list-group list-group-flush rui-profile-task-list">
                  {this.state.data.sales.map(item => (
                    <li className="list-group-item">
                      <div className={`rui-task rui-task-${item.state}`}>
                        <div className="rui-task-icon">
                          <Icon name="check-square" />
                        </div>
                        <div className="rui-task-content">
                          <Link className="rui-task-title" to={`/pdv/viewer/${item.id}`}>
                            {item.title}
                          </Link>
                          <small className="rui-task-subtitle">
                            Atendente:{" "}
                            <a>
                              <strong>{item?.user?.name}</strong>
                            </a>
                          </small>
                          <small className="rui-task-subtitle">
                            Valor:{" "}
                            <a>
                              <strong>{item.amount.toLocaleString()}</strong>
                            </a>
                          </small>
                          <small className="rui-task-subtitle">
                            Em:{" "}
                            <a>
                              <strong>{format(parseISO(item.date) ?? "", "dd'/'MM'/'yyyy' às 'HH':'mm")}</strong>
                            </a>
                          </small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12">
            <Tabs sliding>
              <Tabs.NavItem isActive={activeTab === "timeline"} onClick={() => this.toggleTab("timeline")}>
                Linha do tempo
              </Tabs.NavItem>
            </Tabs>
            <Tabs.Content activeTab={activeTab}>
              <Tabs.Pane tabId="timeline">
                <Timeline lg="left">
                  {this.state.timeline.map((item, index) => (
                    <Timeline.Item
                      className={item.state}
                      swap={index % 2 !== 0}
                      icon={<Icon name={icon(item.state)} />}
                      date={format(parseISO(item.date) ?? "", "dd'/'MM'/'yyyy' às 'HH':'mm")}
                      key={item.id}>
                      <h3>{item.title}</h3>
                      <p>
                        Identificador: <strong>{item.id}</strong>
                        <br />
                        Situação: <strong>{translate(item.state)}</strong>
                        <br />
                        Tipo: <strong>{item.type}</strong>
                      </p>

                      {/*<button type="button" className="btn btn-brand">
                        Detalhes
                  </button>*/}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Tabs.Pane>
            </Tabs.Content>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  ({ settings, toasts }) => ({
    settings,
    toasts,
  }),
  {
    addToast: actionAddToast,
    removeToast: actionRemoveToast,
  },
)(withRouter(Content));

function translate(text) {
  if (text === "scheduled") {
    return "Agendado";
  } else if (text === "canceled") {
    return "Cancelado";
  } else if (text === "realized") {
    return "Realizado/Atendido";
  } else if (text === "rescheduled") {
    return "Reagendado";
  } else if (text === "closed") {
    return "Realizado";
  } else if (text === "open") {
    return "Aberto";
  } else if (text === "active") {
    return "Ativo";
  } else if (text === "inactive") {
    return "Inativo";
  }
}

function icon(text) {
  if (text === "scheduled") {
    return "calendar";
  } else if (text === "canceled") {
    return "x-square";
  } else if (text === "realized") {
    return "check-square";
  } else if (text === "rescheduled") {
    return "copy";
  } else if (text === "open") {
    return "award";
  } else if (text === "closed") {
    return "check-square";
  } else if (text === "active") {
    return "star";
  } else if (text === "inactive") {
    return "star";
  }
}
