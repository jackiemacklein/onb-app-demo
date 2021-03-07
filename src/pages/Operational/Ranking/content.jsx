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
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";

import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Button, Input, Label, FormGroup } from "reactstrap";

import { Row, Col } from "reactstrap";
import { Card, CardBody, CardText, CardTitle, CardSubtitle } from "reactstrap";
import { CardLink, CustomInput } from "reactstrap";
import Cookies from "js-cookie";
import Select from "react-select";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import Dropdown from "../../../components/bs-dropdown";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../../actions";
import DatePicker from "../../../components/date-time-picker";
/**
 * import services/utils
 */

import api from "../../../utils/api";
import { format, parseISO } from "date-fns";
import pt from "date-fns/locale/pt-BR";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      page_limit: 20,
      page_length: 1,

      users: [{ value: Cookies.get("rui-auth-user_id"), label: Cookies.get("rui-auth-user_name") }],
      filiais: [],
      sales: [],
      users: [],

      term: "",
      loading: false,
      show_user_id: 0,

      filter_start_date: new Date(),
      filter_end_date: null,
      filter_filial_id: {
        value: Cookies.get("rui-auth-filial_id") != "undefined" ? Cookies.get("rui-auth-filial_id") : "",
        label: Cookies.get("rui-auth-filial_name") != "undefined" ? Cookies.get("rui-auth-filial_name") : "Selecione",
      },
    };

    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.loadSales = this.loadSales.bind(this);
    this.filterHistory = this.filterHistory.bind(this);
  }

  // carrega as filiais
  async loadFiliais() {
    try {
      const { data } = await api.get("/filiais");
      if (data.length > 0) {
        this.setState({
          filiais: data.map(item => {
            return { value: item.id, label: item.name };
          }),
        });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar filiais");
    }
  }

  // --> carrega os usuários do ranking
  async loadUsers() {
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      const { data } = await api.get(`/ranking/?start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}`);

      this.setState({ users: data });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar dados dos usuários");
    }
  }

  // --> Carrega na api os lancamentos de contas a pagar e a receber
  async loadSales(user_id) {
    if (user_id === this.state.show_user_id) {
      this.setState({ show_user_id: 0 });
      return;
    }

    this.setState({ loading: true });
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      const { data } = await api.get(`/sales/?user_id=${user_id}&start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}`);

      this.setState({ sales: data, show_user_id: user_id });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Lançamentos");
    }

    this.setState({ loading: false });
  }

  // --> Filtra os registros
  filterHistory(item) {
    if (
      item?.client_name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.title?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.user_name?.toUpperCase().includes(this.state.term.toUpperCase())
    )
      return true;
    else return false;
  }

  // --> realiza a alteração do filtro de datas
  changeFilterDate(dates) {
    const [start, end] = dates;
    this.setState({ filter_start_date: start, filter_end_date: end });
  }

  componentDidMount() {
    this.loadUsers();
    //this.loadSales();
    this.loadFiliais();
    this.loadFiliais();
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.location.href.includes("/pdv/ranking")) {
      if (Cookies.get("rui-auth-token")) {
        if (
          prevState.filter_start_date !== this.state.filter_start_date ||
          prevState.filter_end_date !== this.state.filter_end_date ||
          prevState.filter_filial_id !== this.state.filter_filial_id
        ) {
          this.setState({ show_user_id: 0, sales: [] });
          this.loadUsers();
        }
      }
    }
  }

  render() {
    let { users, sales, page_length, page, page_limit } = this.state;
    let pages = [];

    // --> obtem os registros filtrados, conforme a busca pelo usuário
    let items = users.filter(item => this.state.term === "" || this.filterHistory(item));

    page_length = Math.ceil(items.length / page_limit);
    for (let i = 0; i < page_length; i++) {
      pages.push(i);
    }
    // --> obtem os registros conforme pagina selecionada
    items = items.slice(page * page_limit, page * page_limit + page_limit);

    const customStyles = {
      control: (css, state) => {
        return {
          ...css,
          borderColor: state.isFocused ? "rgba(114, 94, 195, 0.6)" : "#eaecf0",
          "&:hover": {
            borderColor: state.isFocused ? "rgba(114, 94, 195, 0.6)" : "#eaecf0",
          },
          boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(114, 94, 195, 0.2)" : "",
        };
      },
      option: (css, state) => {
        let bgc = "";

        if (state.isSelected) {
          bgc = "#725ec3";
        } else if (state.isFocused) {
          bgc = "rgba(114, 94, 195, 0.2)";
        }

        return {
          ...css,
          backgroundColor: bgc,
        };
      },
      multiValueLabel: css => {
        return {
          ...css,
          color: "#545b61",
          backgroundColor: "#eeeeef",
        };
      },
    };

    return (
      <Fragment>
        <div className="bill-filters">
          <Row>
            <Col xs={12} sm={12} md={4}>
              <Label for="filter_filial_id" className="mt-10">
                Filial
              </Label>
              <Select
                id="filter_filial_id"
                name="filter_filial_id"
                defaultValue={this.state.filter_filial_id}
                value={this.state.filter_filial_id}
                options={[{ value: "", label: "Selecione" }, ...this.state.filiais]}
                styles={customStyles}
                onChange={row => this.setState({ filter_filial_id: row })}
              />
            </Col>

            <Col xs={12} sm={12} md={8}>
              <Label className="mt-10">Período</Label>
              <Dropdown tag="div" className="" showTriangle>
                <Dropdown.Toggle tag="button" className="btn btn-brand btn-block mb-5">
                  <span className="text">
                    {format(this.state.filter_start_date, "dd/MM/yyyy")} à {format(this.state.filter_end_date ?? this.state.filter_start_date, "dd/MM/yyyy")}
                  </span>
                  <span className="icon icon ml-auto">
                    <Icon name="chevron-down" />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu tag="ul" className="nav">
                  <li onClick={() => {}}>
                    <DatePicker
                      selected={this.state.filter_start_date}
                      onChange={dates => this.changeFilterDate(dates)}
                      startDate={this.state.filter_start_date}
                      endDate={this.state.filter_end_date}
                      selectsRange
                      inline
                      className="rui-datetimepicker form-control w-auto"
                      locale="pt"
                    />
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
        <div className="card">
          <div className="card-body py-30 pt-0">
            <div className="rui-project-task-search">
              <div className="input-group input-group-clean">
                <input
                  type="search"
                  className="form-control pl-3 order-1"
                  placeholder="Digite para procurar..."
                  value={this.state.term}
                  onChange={event => this.setState({ term: event.target.value })}
                />
              </div>
            </div>

            <ul className="list-group list-group-flush rui-project-task-list bills">
              {items.map((item_user, indice) => (
                <div className="row-bill ranking" key={item_user.user_id}>
                  <div className="user">
                    <div className="card-day">
                      <strong>{(indice + 1).toString().padStart(2, "0")}°</strong>
                    </div>
                    <Card className="card">
                      <CardBody>
                        <CardTitle className="h2" onClick={() => this.loadSales(item_user.user_id)}>
                          [{item_user.filial_name}] - {item_user.user_name}
                        </CardTitle>
                        <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                          Qtde Atendimentos: <strong>{item_user?.qde_services ?? "-"}</strong>
                        </CardSubtitle>
                        <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                          Tempo médio: <strong>{item_user?.average ?? "-"}</strong>
                        </CardSubtitle>

                        {this.state.show_user_id === item_user.user_id ? (
                          <>
                            <CardLink className={`open mt-10`} onClick={() => this.setState({ show_user_id: 0, sales: [] })}>
                              Fechar
                            </CardLink>
                          </>
                        ) : (
                          <>
                            {" "}
                            <CardLink className={`open mt-10`} onClick={() => this.loadSales(item_user.user_id)}>
                              {this.state.loading ? "Carregando..." : "Ver atendimentos"}
                            </CardLink>
                          </>
                        )}
                      </CardBody>
                      <a className={`rui-task-subtitle price ${item_user.state}`}>
                        <strong>
                          <small>R$ </small>
                          {item_user.amount_sales.toLocaleString()}
                        </strong>
                      </a>
                    </Card>
                  </div>
                  <div className={`p-50 pt-0 details ${this.state.show_user_id === item_user.user_id ? "show" : ""}`}>
                    <ul className="list-group list-group-flush rui-project-task-list bills">
                      {sales.map((item, i) => (
                        <div className="row-bill" key={item.id}>
                          <div className="card-day">
                            {i === 0 ? (
                              <>
                                <strong>{format(parseISO(item.date), "dd")}</strong> <small>{format(parseISO(item.date), "MMM", { locale: pt })}</small>
                              </>
                            ) : (
                              <>
                                {sales[i - 1].date !== item.date ? (
                                  <>
                                    <strong>{format(parseISO(item.date), "dd")}</strong> <small>{format(parseISO(item.date), "MMM", { locale: pt })}</small>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
                          </div>
                          <Card className="card">
                            <CardBody>
                              <Link to={`/pdv/show/${item.id}`} target="_blank">
                                <CardTitle className="h2">{item.title}</CardTitle>
                              </Link>

                              {item.closed_by ? (
                                <>
                                  <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                                    Fechado por: <strong>{item?.closed_by ?? "-"}</strong>
                                  </CardSubtitle>
                                </>
                              ) : (
                                <></>
                              )}

                              <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                                Realizado às: <strong>{format(parseISO(item.date), "HH':'mm")}</strong>
                              </CardSubtitle>
                              {item.canceled_by ? (
                                <>
                                  <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                                    Cancelado por: <strong>{item?.canceled_by ?? "-"}</strong>
                                  </CardSubtitle>
                                </>
                              ) : (
                                <></>
                              )}

                              <CardSubtitle className="h4 text-muted mb-5">{item?.filial_name}</CardSubtitle>
                              {item.client_id ? (
                                <>
                                  <CardText className="mb-5">
                                    <Link to={`/crm/clientes/show/${item.client_id}`} className="card-link" target="_blank">
                                      Cliente: <strong>{item?.client_name}</strong>
                                    </Link>
                                  </CardText>
                                </>
                              ) : (
                                <></>
                              )}

                              <CardLink className={`${item.state} mt-10`} id={`popover_paid_${item.id}`}>
                                {item.state === "closed" ? "Fechada/Finalizada" : item.state === "canceled" ? "Cancelada" : "Em aberto"}
                              </CardLink>

                              {item.obs ? (
                                <>
                                  <CardLink id={`popover_obs_${item.id}`}>Observações</CardLink>
                                  <UncontrolledPopover placement="top" target={`popover_obs_${item.id}`} trigger="hover">
                                    <PopoverHeader>Observações</PopoverHeader>
                                    <PopoverBody>
                                      <strong>{item.obs}</strong>
                                    </PopoverBody>
                                  </UncontrolledPopover>
                                </>
                              ) : (
                                <></>
                              )}
                            </CardBody>
                            <a className={`rui-task-subtitle price ${item.state}`}>
                              <strong>
                                <small>R$ </small>
                                {item.amount.toLocaleString()}
                              </strong>
                            </a>
                          </Card>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <nav className="mt-15" aria-label="Page navigation example">
          <ul className="pagination pagination-sm">
            <ul className="pagination pagination-sm">
              {pages.map(item => (
                <li key={item} onClick={() => this.setState({ page: item })} className={`page-item ${item === this.state.page ? "active" : ""}`}>
                  <a className="page-link">{item + 1}</a>
                </li>
              ))}
            </ul>
          </ul>
        </nav>
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
)(Content);
