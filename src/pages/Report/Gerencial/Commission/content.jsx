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
import ReactExport from "react-export-excel";

import { Label } from "reactstrap";

import { Row, Col } from "reactstrap";
import { Card, CardBody, CardText, CardTitle, CardSubtitle } from "reactstrap";
import { CardLink, CustomInput } from "reactstrap";
import Cookies from "js-cookie";
import Select from "react-select";

/**
 * Internal Dependencies
 */
import Icon from "../../../../components/icon";
import Dropdown from "../../../../components/bs-dropdown";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../../../actions";
import DatePicker from "../../../../components/date-time-picker";
/**
 * import services/utils
 */

import api from "../../../../utils/api";
import { format, parseISO } from "date-fns";
import pt from "date-fns/locale/pt-BR";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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

      filiais: [],
      cashiers: [],
      commissions: [],
      states: [
        { value: "opened", label: "À Pagar" },
        { value: "closed", label: "Pagos" },
      ],
      term: "",
      loading: false,

      calculations: {
        pay: 0,
        pay_not: 0,
      },
      filter_start_date: new Date(),
      filter_end_date: null,
      filter_filial_id: {
        value: Cookies.get("rui-auth-filial_id") != "undefined" ? Cookies.get("rui-auth-filial_id") : "",
        label: Cookies.get("rui-auth-filial_name") != "undefined" ? Cookies.get("rui-auth-filial_name") : "Selecione",
      },
      filter_state: { value: "", label: "Todas" },
    };

    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadCashiers = this.loadCashiers.bind(this);
    this.loadCommissions = this.loadCommissions.bind(this);
    this.filterHistory = this.filterHistory.bind(this);
    this.calculations = this.calculations.bind(this);
  }

  // --> realizada os calculos do balanço
  async calculations(items) {
    let pay = 0;
    let pay_not = 0;

    for (let i = 0; i < items.length; i++) {
      if (items[i].state === "open") {
        let balance = 0;
        for (let b = 0; b < items[i].balance.length; b++) {
          balance = balance + items[i].balance[b].amount;
        }
        expected_in = expected_in + balance + items[i].opening_balance;
      }

      if (items[i].state === "closed") {
        realized_in = realized_in + items[i].closing_balance;
      }
    }
    expected_in = realized_in + expected_in;

    this.setState({ calculations: { realized_in, expected_in } });
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

  // --> Carrega na api os os caixas
  async loadCashiers() {
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      const { data } = await api.get(
        `/operational/cashiers/?state=${this.state.filter_state.value}&start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}`,
      );

      this.setState({ cashiers: data });

      this.calculations(data);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Caixas diários");
    }
  }

  // --> Carrega na api os os caixas
  async loadCommissions() {
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      const { data } = await api.get(
        `/report/commissions/?state=${this.state.filter_state.value}&start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}`,
      );

      this.setState({ commissions: data });

      //this.calculations(data);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Comissões");
    }
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
    this.loadCommissions();
    this.loadFiliais();
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.location.href.includes("/relatorios/gerenciais/comissoes")) {
      if (Cookies.get("rui-auth-token")) {
        if (
          prevState.filter_start_date !== this.state.filter_start_date ||
          prevState.filter_end_date !== this.state.filter_end_date ||
          prevState.filter_filial_id !== this.state.filter_filial_id ||
          prevState.filter_state !== this.state.filter_state
        ) {
          this.loadCommissions();
        }
      }
    }
  }

  render() {
    let { commissions, page_length, page, page_limit } = this.state;
    let pages = [];

    // --> obtem os registros filtrados, conforme a busca pelo usuário
    let items = commissions.filter(item => this.state.term === "" || this.filterHistory(item));

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
            <Col xs={12} sm={12} md={3}>
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

            <Col xs={12} sm={12} md={3}>
              <Label for="filter_state" className="mt-10">
                Situação
              </Label>
              <Select
                id="filter_state"
                name="filter_state"
                defaultValue={this.state.filter_state}
                value={this.state.filter_state}
                options={[{ value: "", label: "Todos" }, ...this.state.states]}
                styles={customStyles}
                onChange={row => this.setState({ filter_state: row })}
              />
            </Col>

            <Col xs={12} sm={12} md={6}>
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

                <div className="input-group-prepend mnl-3 order-2">
                  <ExcelFile
                    element={
                      <button id="popover_download" type="button" className="ml-15 btn btn-custom-round btn-brand btn-lg btn-opt">
                        <Icon name="download" />
                      </button>
                    }
                    filename="relatorio-gerencial-caixas-diarios">
                    <ExcelSheet data={this.state.cashiers} name="Caixas Diários">
                      <ExcelColumn label="ID" value="id" />
                      <ExcelColumn label="Filial" value={col => col.filial?.name} />
                      <ExcelColumn label="Data" value={col => format(parseISO(col.date), "dd'/'MM'/'yyyy")} />
                      <ExcelColumn label="Aberto às" value={col => format(parseISO(col.date), "HH':'mm")} />
                      <ExcelColumn label="Fechado em" value={col => (col.closing_date ? format(parseISO(col.closing_date), "dd'/'MM'/'yyyy' 'HH':'mm") : "")} />
                      <ExcelColumn label="Saldo de abertura" value={col => `R$ ${col.opening_balance}`} />
                      <ExcelColumn label="Saldo de fechamento" value={col => `R$ ${col.closing_balance}`} />
                      <ExcelColumn label="Observações" value="obs" />
                    </ExcelSheet>
                  </ExcelFile>

                  <UncontrolledPopover placement="right" target="popover_download" trigger="hover">
                    <PopoverHeader>Baixar EXCEL</PopoverHeader>
                    <PopoverBody>Clique para fazer o download do arquivo excel</PopoverBody>
                  </UncontrolledPopover>
                </div>
              </div>
            </div>
            <div className="rui-project-task-info">
              <a className="rui-project-task-info-link ml-20 mr-0">
                <span className="rui-project-task-info-title">Pagos: </span>
              </a>
              <a className={`rui-task-subtitle balance ml-10 mr-0 in`}>
                <strong>
                  <small>R$ </small>
                  {this.state.calculations.pay.toLocaleString()}
                </strong>
              </a>
              <a className="rui-project-task-info-link ml-20 mr-0">
                <span className="rui-project-task-info-title">À Pagar: </span>
              </a>
              <a className={`rui-task-subtitle balance ml-10 mr-0 in`}>
                <strong>
                  <small>R$ </small>
                  {this.state.calculations.pay_not.toLocaleString()}
                </strong>
              </a>
            </div>
            <ul className="list-group list-group-flush rui-project-task-list bills">
              {items.map((item, indice) => (
                <div className="row-bill" key={item.id}>
                  <div className="card-day">
                    {indice === 0 ? (
                      <>
                        <strong>{format(parseISO(item.date), "dd")}</strong> <small>{format(parseISO(item.date), "MMM", { locale: pt })}</small>
                      </>
                    ) : (
                      <>
                        {items[indice - 1].date !== item.date ? (
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
                      <Link to={`/caixa/${item.id}`} target="_blank">
                        <CardTitle className="h2">{item.description}</CardTitle>
                      </Link>
                      <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                        Filial: <strong>{item.filial.name}</strong>
                      </CardSubtitle>
                      <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                        Saldo de Abertura: <strong>R$ {item.opening_balance.toLocaleString()}</strong>
                      </CardSubtitle>

                      {item.closing_balance ? (
                        <>
                          <CardSubtitle className="h5 text-muted mb-5 card-subtitle mt-2">
                            Saldo de Fechamento: <strong>R$ {item.closing_balance.toLocaleString()}</strong>
                          </CardSubtitle>
                        </>
                      ) : (
                        <></>
                      )}

                      {item.closing_date ? (
                        <>
                          <CardText className="mb-5">
                            Fechado em: <strong>{format(parseISO(item.date), "dd'/'MM'/'yyyy' às 'HH':'mm")}</strong>
                          </CardText>
                        </>
                      ) : (
                        <></>
                      )}

                      <CardLink className={`${item.state} mt-10`} id={`popover_paid_${item.id}`}>
                        {item.state === "closed" ? "Fechado" : "Aberto"}
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
                        {item.value.toLocaleString()}
                      </strong>
                    </a>
                  </Card>
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
