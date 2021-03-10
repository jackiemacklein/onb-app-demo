/**
 * Styles
 */
import "./style.scss";

/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import ReactExport from "react-export-excel";

import { Label } from "reactstrap";

import { Row, Col } from "reactstrap";
import { Card, CardBody, CardText, CardTitle, CardSubtitle } from "reactstrap";
import { CardLink, CustomInput } from "reactstrap";
import Cookies from "js-cookie";
import Select from "react-select";

import queryString from "query-string";

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
    const params = queryString.parse(props.location.search);

    super(props);

    this.state = {
      page: 0,
      page_limit: 20,
      page_length: 1,

      filter_id: params.id ?? "",
      filiais: [],
      users: [],
      commissions: [],
      states: [
        { value: "opened", label: "À Pagar" },
        { value: "paid", label: "Pagos" },
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
      filter_user_id: { value: "", label: "Todos" },
    };

    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.loadCommissions = this.loadCommissions.bind(this);
    this.filterHistory = this.filterHistory.bind(this);
    this.calculations = this.calculations.bind(this);
  }

  // --> realizada os calculos do balanço
  async calculations(items) {
    let pay = 0;
    let pay_not = 0;

    for (let i = 0; i < items.length; i++) {
      if (items[i].state === "opened") {
        pay_not = pay_not + (items[i].value - this.sumOuts(items[i].outs));
      }

      if (items[i].state === "paid") {
        pay = pay + (items[i].value - this.sumOuts(items[i].outs));
      }
    }

    this.setState({ calculations: { pay, pay_not } });
  }

  // carrega as filiais
  async loadFiliais() {
    try {
      const { data } = await api.get("/filiais");
      this.setState({
        filiais: data.map(item => {
          return { value: item.id, label: item.name };
        }),
      });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar filiais");
    }
  }

  // --> Carrega na api os clientes que sao usuários
  async loadUsers() {
    try {
      const { data } = await api.get(`/users`);

      this.setState({
        users: data.map(item => {
          return { value: item.id, label: item.name };
        }),
      });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Clientes");
    }
  }

  // --> Carrega na api os os caixas
  async loadCommissions() {
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      if (this.state.filter_id) {
        const { data } = await api.get(`/report/commissions/?id=${this.state.filter_id}`);
        this.setState({ commissions: data });

        this.calculations(data);
      } else {
        const { data } = await api.get(
          `/report/commissions/?state=${this.state.filter_state.value}&start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}&user_id=${this.state.filter_user_id.value}`,
        );
        this.setState({ commissions: data });

        this.calculations(data);
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Comissões");
    }
  }

  // --> atualiza o registro
  async handleUpdateState(item) {
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      const state = item.state === "paid" ? "opened" : "paid";

      await api.put(`/commissions/${item.commission_id}`, { state });

      this.loadCommissions();

      if (item.state === "paid")
        addToast({ title: "Sucesso!.", content: "ALTERAÇÃO REALIZADA com sucesso.", time: new Date(), duration: 10000, color: "success" });
      else addToast({ title: "Sucesso!.", content: "PAGAMENTO REALIZADO com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true)
          addToast({ title: "Erro!.", content: error.response.data.more, time: new Date(), duration: 10000, color: "danger" });
        else
          addToast({
            title: "Erro!.",
            content: "Desculpe, não foi possivel atualizar a situação do pagamento",
            time: new Date(),
            duration: 10000,
            color: "danger",
          });
      } else
        addToast({
          title: "Erro!.",
          content: "Desculpe, não foi possivel atualizar a situação do pagamento",
          time: new Date(),
          duration: 10000,
          color: "danger",
        });

      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> Filtra os registros
  filterHistory(item) {
    if (
      item?.user_name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.description?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.obs?.toUpperCase().includes(this.state.term.toUpperCase())
    )
      return true;
    else return false;
  }

  // --> realiza a alteração do filtro de datas
  changeFilterDate(dates) {
    const [start, end] = dates;
    this.setState({ filter_start_date: start, filter_end_date: end });
  }

  // --> funcao responsavel por somar os descontos de cada comissão
  sumOuts(items) {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum = sum + items[i].value;
    }

    return sum;
  }

  componentDidMount() {
    this.loadCommissions();
    this.loadFiliais();
    this.loadUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.location.href.includes("/relatorios/gerenciais/comissoes")) {
      if (Cookies.get("rui-auth-token")) {
        if (
          prevState.filter_start_date !== this.state.filter_start_date ||
          prevState.filter_end_date !== this.state.filter_end_date ||
          prevState.filter_filial_id !== this.state.filter_filial_id ||
          prevState.filter_user_id !== this.state.filter_user_id ||
          prevState.filter_state !== this.state.filter_state
        ) {
          this.setState({ filter_id: "" });
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
        <div className="commission-filters">
          <Row>
            <Col xs={12} sm={6} md={2}>
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

            <Col xs={12} sm={6} md={2}>
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

            <Col xs={12} sm={6} md={4}>
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
            <Col xs={12} sm={6} md={4}>
              <Label for="filter_user_id" className="mt-10">
                Usuários
              </Label>
              <Select
                id="filter_user_id"
                name="filter_user_id"
                defaultValue={this.state.filter_user_id}
                value={this.state.filter_user_id}
                options={[{ value: "", label: "Todos" }, ...this.state.users]}
                styles={customStyles}
                onChange={row => this.setState({ filter_user_id: row })}
              />
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
                    filename="relatorio-gerencial-comissoes">
                    <ExcelSheet data={this.state.commissions} name="Comissões">
                      <ExcelColumn label="ID CONTA PAGAR" value="id" />
                      <ExcelColumn label="Situação" value={col => (col.state === "paid" ? "PAGO" : "À PAGAR")} />
                      <ExcelColumn label="Descrição" value={col => col.description} />
                      <ExcelColumn label="Usuário" value={col => col.user_name} />
                      <ExcelColumn label="Data de Pagamento" value={col => format(parseISO(col.date), "dd'/'MM'/'yyyy")} />
                      <ExcelColumn label="Data Inicio (soma comissão)" value={col => format(parseISO(col.start_date), "dd'/'MM'/'yyyy")} />
                      <ExcelColumn label="Data Final (soma comissão)" value={col => format(parseISO(col.end_date), "dd'/'MM'/'yyyy")} />

                      <ExcelColumn label="Valor dos Produtos (Total)" value={col => `R$ ${col.amount_products}`} />
                      <ExcelColumn label="Valor dos Serviços (Total)" value={col => `R$ ${col.amount_services}`} />
                      <ExcelColumn label="% de Comissao dos Serviços" value={col => `${col.sales_commission} % `} />
                      <ExcelColumn label="Comissão dos Serviços" value={col => `R$ ${col.commission_services}`} />
                      <ExcelColumn label="Comissão dos Produtos" value={col => `R$ ${col.commission_products}`} />
                      <ExcelColumn label="Descontos" value={col => `R$ ${this.sumOuts(col.outs)}`} />
                      <ExcelColumn label="Valor Total à pagar" value={col => `R$ ${(col.value - this.sumOuts(col.outs)).toLocaleString()}`} />
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
                <span className="rui-project-task-info-title">À Pagar: </span>
              </a>
              <a className={`rui-task-subtitle balance ml-10 mr-0 in`}>
                <strong>
                  <small>R$ </small>
                  {this.state.calculations.pay_not.toLocaleString()}
                </strong>
              </a>
            </div>
            <ul className="list-group list-group-flush rui-project-task-list commissions">
              {items.map((item, indice) => (
                <div className="row-commission" key={item.commission_id}>
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
                      <CardTitle className="h2">{item.description}</CardTitle>

                      <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                        Serviços: <strong id={`popover_amount_services_${item.id}`}>R$ {item.amount_services.toLocaleString()}</strong>{" "}
                        <span id={`popover_qtde_services_${item.id}`}>({item.qtde_services})</span>{" "}
                        <span id={`popover_percent_commission_${item.id}`}>({item.sales_commission}%)</span>{" "}
                        <span id={`popover_comission_services_${item.id}`}>(R$ {item.commission_services.toLocaleString()})</span>
                      </CardSubtitle>
                      <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                        Produtos: <strong id={`popover_amount_products_${item.id}`}>R$ {item.amount_products.toLocaleString()}</strong>{" "}
                        <span id={`popover_qtde_products_${item.id}`}>({item.qtde_products})</span>{" "}
                        <span id={`popover_comission_products_${item.id}`}>(R$ {item.commission_products.toLocaleString()})</span>
                      </CardSubtitle>
                      <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                        À Pagar: <strong id={`popover_pay_${item.id}`}>R$ {item.value.toLocaleString()}</strong>
                      </CardSubtitle>
                      {item.outs.length > 0 ? (
                        <>
                          <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                            Descontos: <strong id={`popover_outs_${item.id}`}>R$ {this.sumOuts(item.outs).toLocaleString()}</strong>
                          </CardSubtitle>
                        </>
                      ) : (
                        <></>
                      )}

                      <CardText className="mb-5">
                        <Link
                          to={`/pdv/relatorio/?start_date=${format(parseISO(item.start_date), "yyyy-MM-dd")}&end_date=${format(
                            parseISO(item.end_date),
                            "yyyy-MM-dd",
                          )}&user_id=${item.user_id}`}
                          target="_blank"
                          className="card-link">
                          <strong>Ver Serviços</strong>
                        </Link>
                        <Link
                          to={`/lancamentos/?start_date=${format(parseISO(item.start_date), "yyyy-MM-dd")}&end_date=${format(
                            parseISO(item.end_date),
                            "yyyy-MM-dd",
                          )}&client_id=${item.client_id}`}
                          target="_blank"
                          className="card-link">
                          <strong>Ver Descontos</strong>
                        </Link>
                      </CardText>

                      <CardLink onClick={() => this.handleUpdateState(item)} className={`${item.state} mt-10`} id={`popover_paid_${item.id}`}>
                        {this.state.loading ? "Atualizando..." : item.state === "opened" ? "Realizar Pagamento" : "Pago"}
                      </CardLink>
                    </CardBody>
                    <a className={`rui-task-subtitle price ${item.state}`}>
                      <strong>
                        <small>R$ </small>
                        {(item.value - this.sumOuts(item.outs)).toLocaleString()}
                      </strong>
                    </a>
                    <UncontrolledPopover placement="top" target={`popover_paid_${item.id}`} trigger="hover">
                      <PopoverHeader>{item.state === "paid" ? "Pagamento Realizado" : "Realizar Pagamento"}</PopoverHeader>
                      <PopoverBody>
                        Clique para marcar como: <strong>{item.state === "paid" ? "NÃO REALIZADO" : "REALIZADO"}</strong>
                      </PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_qtde_services_${item.id}`} trigger="hover">
                      <PopoverHeader>Qtde de Serviços Realizados</PopoverHeader>
                      <PopoverBody>Indica a quantidade de serviços que esse usuário realizou.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_percent_commission_${item.id}`} trigger="hover">
                      <PopoverHeader>% de Comissão</PopoverHeader>
                      <PopoverBody>Indica a Porcetagem de comissão sobre os serviços realizados</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_qtde_products_${item.id}`} trigger="hover">
                      <PopoverHeader>Qtde de Produtos Vendidos</PopoverHeader>
                      <PopoverBody>Indica a quantidade de produtos que esse usuário vendeu.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_amount_services_${item.id}`} trigger="hover">
                      <PopoverHeader>Valor total em Serviços</PopoverHeader>
                      <PopoverBody>Indica o valor total dos serviços realizados.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_amount_products_${item.id}`} trigger="hover">
                      <PopoverHeader>Valor total em Produtos</PopoverHeader>
                      <PopoverBody>Indica o valor total dos produtos vendidos.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_comission_products_${item.id}`} trigger="hover">
                      <PopoverHeader>Total de Comissão dos Produtos</PopoverHeader>
                      <PopoverBody>Valor à pagar referente a venda de produtos.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_comission_services_${item.id}`} trigger="hover">
                      <PopoverHeader>Total de Comissão dos Serviços</PopoverHeader>
                      <PopoverBody>Valor à pagar referente aos serviços realizados.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_pay_${item.id}`} trigger="hover">
                      <PopoverHeader>Valores à Pagar</PopoverHeader>
                      <PopoverBody>Total de Comissão à pagar referente à serviços e venda de Produtos no periodo.</PopoverBody>
                    </UncontrolledPopover>

                    <UncontrolledPopover placement="top" target={`popover_outs_${item.id}`} trigger="hover">
                      <PopoverHeader>Descontos até a data do pagamento</PopoverHeader>
                      <PopoverBody>Valores à descontar referente à Adiantamentos, Venda de Produtos e Serviços à Prazo/Fiado.</PopoverBody>
                    </UncontrolledPopover>
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
)(withRouter(Content));
