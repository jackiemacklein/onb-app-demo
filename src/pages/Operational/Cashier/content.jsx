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
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Button, Input, Label, FormGroup } from "reactstrap";
import classnames from "classnames/dedupe";
import Select from "react-select";
import ReactSortable from "react-sortablejs";
import Cookies from "js-cookie";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { withRouter } from "react-router-dom";

/**
 * import services/utils
 */
import api from "./../../../utils/api";
import { format, parseISO } from "date-fns";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: "",
      page: 0,
      page_limit: 20,
      page_length: 1,
      modalOpen: false,
      modalOpenMovement: false,
      modalConfirmOpeningCashier: false,
      modalConfirmClosingCashier: false,
      modalConfirmReopenCashier: false,

      data: { balance: [], filial: {}, movements: [], user: {}, opening_balance: 0, income: 0, expense: 0, date: "" },
      cashier_id: "",
      user_id: { value: Cookies.get("rui-auth-user_id"), label: Cookies.get("rui-auth-user_name") },
      filial_id: { value: Cookies.get("rui-auth-filial_id"), label: Cookies.get("rui-auth-filial_name") },
      opening_balance: 0,
      date: format(new Date(), "yyyy'-'MM'-'dd'T'HH':'mm':'ss"),
      obs: "",
      filiais: [],
      flow_categories: [],
      payment_methods: [],

      users: [{ value: Cookies.get("rui-auth-user_id"), label: Cookies.get("rui-auth-user_name") }],
      loading: false,
      movements: {},
      movementsOutbound: [],
      movementsIncoming: [],
      movementsSpun: [],

      movement_types: [
        { value: "in", label: "Receita/Entrada" },
        { value: "out", label: "Retirada/Saída/Despesa" },
      ],
      movement_type: {},
      movement_filial_id: { value: Cookies.get("rui-auth-filial_id"), label: Cookies.get("rui-auth-filial_name") },
      movement_flow_category_id: {},
      movement_date: "",
      movement_user_id: { value: Cookies.get("rui-auth-user_id"), label: Cookies.get("rui-auth-user_name") },
      movement_value: 0,
      movement_description: "",
      movement_obs: "",
      movement_id: "",
      movement_is_editable: true,
      movement_payment_method_id: { value: null, label: "Nenhuma" },
    };

    this.toggle = this.toggle.bind(this);
    this.toggleModalOpenMovement = this.toggleModalOpenMovement.bind(this);
    this.toggleModalConfirmOpeningCashier = this.toggleModalConfirmOpeningCashier.bind(this);
    this.toggleModalConfirmClosingCashier = this.toggleModalConfirmClosingCashier.bind(this);
    this.toggleModalConfirmReopenCashier = this.toggleModalConfirmReopenCashier.bind(this);
    this.handleSendOpenCashier = this.handleSendOpenCashier.bind(this);
    this.handleSaveMovement = this.handleSaveMovement.bind(this);
    this.handleEditMovement = this.handleEditMovement.bind(this);
    this.loadCashier = this.loadCashier.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.loadPaymentMethods = this.loadPaymentMethods.bind(this);
    this.renderProjects = this.renderProjects.bind(this);
    this.getIncome = this.getIncome.bind(this);
    this.getExpense = this.getExpense.bind(this);
    this.getMovements = this.getMovements.bind(this);
    this.updateMovement = this.updateMovement.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.handleSendCloseCashier = this.handleSendCloseCashier.bind(this);
    this.handleSendReopenCashier = this.handleSendReopenCashier.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  }

  toggleModalOpenMovement(type) {
    this.setState(prevState => ({
      movement_type: type,
      modalOpenMovement: !prevState.modalOpenMovement,
    }));
  }

  toggleModalConfirmOpeningCashier(event) {
    if (event) event.preventDefault();

    this.setState(prevState => ({
      modalConfirmOpeningCashier: !prevState.modalConfirmOpeningCashier,
    }));
  }

  toggleModalConfirmClosingCashier(event) {
    if (event) event.preventDefault();

    this.setState(prevState => ({
      modalConfirmClosingCashier: !prevState.modalConfirmClosingCashier,
    }));
  }

  toggleModalConfirmReopenCashier(event) {
    if (event) event.preventDefault();

    this.setState(prevState => ({
      modalConfirmReopenCashier: !prevState.modalConfirmReopenCashier,
    }));
  }

  // --> repsonsavel por percorrer os registros e somar as entradas/receitas
  getIncome(movements) {
    let sum = 0;
    for (let i = 0; i < movements.length; i++) {
      if (movements[i].type === "in" && !movements[i].paymentMethod.is_spun_sales) sum += movements[i].value;
    }
    return sum;
  }

  // --> repsonsavel por percorrer os registros e somar as saidas/despesas
  getExpense(movements) {
    let sum = 0;
    for (let i = 0; i < movements.length; i++) {
      if (movements[i].type === "out") sum += movements[i].value;
    }
    return sum;
  }

  // --> Carrega as movimentacoes
  getMovements(data) {
    let movements = {};
    const movementsIncoming = [];
    const movementsOutbound = [];
    const movementsSpun = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].type == "in" && !data[i].paymentMethod.is_spun_sales) {
        movements = {
          ["#" + (i + 1)]: {
            icon: "thumbs-up",
            color: "success",
            url: "",
            label: data[i].description,
            price: `R$ ${data[i].value.toLocaleString()}`,
            date: "",
            by: (
              <>
                {data[i].sale_id ? (
                  <>
                    <Link to={`/pdv/show/${data[i].sale_id}`}>[Ver Info]</Link>
                    {" às "}
                    <strong>{format(parseISO(data[i].date), "HH':'mm'Hrs'")}</strong>
                  </>
                ) : (
                  <></>
                )}
              </>
            ),
            data: data[i],
          },
          ...movements,
        };
        movementsIncoming.push("#" + (i + 1));
      } else if (data[i].type == "out") {
        movements = {
          ["#" + (i + 1)]: {
            icon: "thumbs-down",
            color: "danger",
            url: "",
            label: data[i].description,
            price: `R$ ${data[i].value.toLocaleString()}`,
            date: "",
            by: (
              <>
                {" às "}
                <strong>{format(parseISO(data[i].date), "HH':'mm'Hrs'")}</strong>
              </>
            ),
            data: data[i],
          },
          ...movements,
        };
        movementsOutbound.push("#" + (i + 1));
      } else {
        if (data[i].paymentMethod.is_spun_sales) {
          movements = {
            ["#" + (i + 1)]: {
              icon: "thumbs-clock",
              color: "warning",
              url: "",
              label: data[i].description,
              price: `R$ ${data[i].value.toLocaleString()}`,
              date: "",
              by: (
                <>
                  {data[i].sale_id ? (
                    <>
                      <Link to={`/pdv/show/${data[i].sale_id}`}>[Ver Info]</Link>
                      {" às "}
                      <strong>{format(parseISO(data[i].date), "HH':'mm'Hrs'")}</strong>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ),
              data: data[i],
            },
            ...movements,
          };
          movementsSpun.push("#" + (i + 1));
        }
      }
    }

    this.setState({ movementsIncoming, movementsOutbound, movementsSpun });
    return movements;
  }

  // --> limpa os campos do modal movimentação
  clearFields() {
    this.setState({
      movement_type: {},
      movement_flow_category_id: {},
      movement_date: "",
      movement_value: "",
      movement_description: "",
      movement_obs: "",
      movement_id: "",
    });
  }

  // --> Carrega informações do caixa
  async loadCashier() {
    const { id } = this.props.match.params;

    try {
      const { data } = await api.get(`/operational/cashiers/${id ?? 0}`);

      if (data) {
        this.setState({
          data: { ...data, income: this.getIncome(data.movements), expense: this.getExpense(data.movements) },
          cashier_id: data.id,
          movements: this.getMovements(data.movements),
        });
      } else {
        this.toggle();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status) {
          if (error.response.status === 404) {
            this.toggle();
            this.setState({ opening_balance: 0 });
          }
        }
      }
    }
  }

  // --> Carrega as filiais
  async loadFiliais() {
    const { data } = await api.get("filiais");
    this.setState({
      filiais: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });

    if (Cookies.get("rui-auth-filial_id") != "" && Cookies.get("rui-auth-filial_id") != "undefined") {
      const filial_id = data.find(d => d.id == Cookies.get("rui-auth-filial_id"));

      if (filial_id) this.setState({ filial_id: { value: filial_id.id, label: filial_id.name } });
    }
  }

  // --> Carrega as categorias das movimentaçoes
  async loadCategories() {
    const { data } = await api.get("/flows/categories");
    this.setState({
      flow_categories: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  // --> Carrega as categorias das movimentaçoes
  async loadPaymentMethods() {
    const { data } = await api.get("/payment_methods");
    let payment_methods = data.map(d => {
      return { value: d.id, label: d.name };
    });
    payment_methods.push({ value: null, label: "Nenhuma" });

    this.setState({
      payment_methods: payment_methods,
    });
  }

  // --> envia para api os dado inciais do caixa para realizar a abertura
  async handleSendOpenCashier(event) {
    event.preventDefault();
    const { addToast } = this.props;

    if (!this.state.date || !this.state.filial_id || !this.state.user_id || !this.state.opening_balance) {
      alert("Os campos DATA/HORA, FILIAL, ABERTO POR e SALDO INICIAL são obrigatórios.");
      return false;
    }

    try {
      this.setState({ loading: true });
      const { data } = await api.post(`/operational/cashiers`, {
        date: this.state.date,
        filial_id: this.state.filial_id.value,
        user_id: this.state.user_id.value,
        opening_balance: this.state.opening_balance,
        obs: this.state.obs,
      });

      this.toggleModalConfirmOpeningCashier();
      this.toggle();

      addToast({
        title: "Sucesso!.",
        content: "Caixa foi aberto com sucesso.",
        time: new Date(),
        duration: 10000,
        color: "success",
      });

      this.loadCashier(); //carrega as informaçoes do caixa
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao abrir caixa. Tente novamente");
        }
      } else {
        alert("Erro ao abrir caixa. Tente novamente");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> envia para api os dado finais do caixa para realizar o fechamento
  async handleSendCloseCashier(event) {
    event.preventDefault();
    const { addToast } = this.props;

    try {
      this.setState({ loading: true });
      const { data } = await api.put(`/operational/cashiers/${this.state.cashier_id}`, { state: "closed" });

      this.toggleModalConfirmClosingCashier();

      addToast({
        title: "Sucesso!.",
        content: "Caixa foi fechado com sucesso.",
        time: new Date(),
        duration: 10000,
        color: "success",
      });

      this.loadCashier(); //carrega as informaçoes do caixa
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao fechar caixa. Tente novamente");
        }
      } else {
        alert("Erro ao fechar caixa. Tente novamente");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> envia o fechamento do caixa para api
  async handleSendReopenCashier() {
    const { addToast } = this.props;
    this.setState({ loading: true });

    try {
      const { data } = await api.put(`/operational/cashiers/${this.state.cashier_id}`, { state: "open" });

      this.toggleModalConfirmReopenCashier();

      addToast({
        title: "Sucesso!.",
        content: "Caixa foi reaberto com sucesso.",
        time: new Date(),
        duration: 10000,
        color: "success",
      });

      this.loadCashier(); //carrega as informaçoes do caixa
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao reabrir caixa. Tente novamente");
        }
      } else {
        alert("Erro ao reabrir caixa. Tente novamente");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> envia para api os dados da movmentação
  async handleSaveMovement(event) {
    event.preventDefault();
    const { addToast } = this.props;

    if (
      !this.state.movement_type ||
      !this.state.movement_filial_id ||
      !this.state.movement_flow_category_id ||
      !this.state.movement_user_id ||
      !this.state.movement_value ||
      !this.state.movement_description
    ) {
      alert("Preencha os campos obrigatórios.");
      return false;
    }

    this.setState({ loading: true });

    if (this.state.movement_id) {
      return this.updateMovement();
    }

    try {
      const { data } = await api.post(`/operational/cashiers/${this.state.cashier_id}/movements`, {
        type: this.state.movement_type.value,
        filial_id: this.state.movement_filial_id.value,
        flow_category_id: this.state.movement_flow_category_id.value,
        date: `${format(new Date(), "yyyy-MM-dd")} ${this.state.movement_date}:00`,
        user_id: this.state.movement_user_id.value,
        payment_method_id: this.state.movement_payment_method_id.value,
        value: this.state.movement_value,
        description: this.state.movement_description,
        obs: this.state.movement_obs,
      });
      this.loadCashier();
      this.toggleModalOpenMovement("");
      this.setState({
        movement_type: {},
        movement_payment_method_id: {},
        movement_flow_category_id: {},
        movement_date: "",
        movement_value: "",
        movement_description: "",
        movement_obs: "",
      });
      addToast({ title: "Sucesso!.", content: "Movimentação realizada com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao salvar movimentação. Tente novamente");
        }
      } else {
        alert("Erro ao salvar movimentação. Tente novamente");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> envia para api a atualização da movimentação
  async updateMovement() {
    const { addToast } = this.props;

    if (!this.state.movement_is_editable) {
      addToast({ title: "Acesso Negado!.", content: "Não é possivel editar essa movimentação.", time: new Date(), duration: 10000, color: "danger" });
      return false;
    }

    try {
      const { data } = await api.put(`/operational/cashiers/${this.state.cashier_id}/movements/${this.state.movement_id}`, {
        type: this.state.movement_type.value,
        flow_category_id: this.state.movement_flow_category_id.value,
        date: `${format(parseISO(this.state.data.date), "yyyy-MM-dd")} ${this.state.movement_date}:00`,
        payment_method_id: this.state.movement_payment_method_id.value,
        user_id: this.state.movement_user_id.value,
        value: this.state.movement_value,
        description: this.state.movement_description,
        obs: this.state.movement_obs,
      });
      this.loadCashier();
      this.toggleModalOpenMovement("");
      this.setState({
        movement_type: {},
        movement_payment_method_id: {},
        movement_flow_category_id: {},
        movement_date: "",
        movement_value: "",
        movement_description: "",
        movement_obs: "",
        movement_id: "",
      });
      addToast({ title: "Sucesso!.", content: "Movimentação atualizada com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Erro ao salvar movimentação. Tente novamente");
      } else alert("Erro ao salvar movimentação. Tente novamente");

      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> Ação d usuário para editar determinado lancamento
  async handleEditMovement(item) {
    this.setState({
      movement_is_editable: item.is_editable,
      movement_id: item.id,
      movement_type: this.state.movement_types.filter(i => i.value === item.type),
      movement_user_id: { value: item.user.id, label: item.user.name },
      movement_flow_category_id: { value: item.category.id, label: item.category.name },
      movement_payment_method_id: item.payment_method_id ? { value: item.paymentMethod.id, label: item.paymentMethod.name } : {},
      movement_date: format(parseISO(item.date), "HH':'mm"),
      movement_value: item.value,
      movement_description: item.description,
      movement_obs: item.obs,
    });

    this.toggleModalOpenMovement(this.state.movement_types.filter(i => i.value === item.type));
  }

  // --> envia para api a remoção da movimentação
  async handleRemoveMovement() {
    const { addToast } = this.props;

    if (!this.state.movement_is_editable) {
      addToast({ title: "Acesso Negado!.", content: "Não é possivel editar essa movimentação.", time: new Date(), duration: 10000, color: "danger" });
      return false;
    }

    if (!this.state.movement_id) {
      addToast({ title: "Acesso Negado!.", content: "ID não encontrado", time: new Date(), duration: 10000, color: "danger" });
      return false;
    }

    const conf = window.confirm("Esse processo é irreversível! Deseja continuar?");

    if (!conf) return false;

    this.setState({ loading: true });
    try {
      const { data } = await api.delete(`/operational/cashiers/${this.state.cashier_id}/movements/${this.state.movement_id}`, {});
      this.loadCashier();
      this.toggleModalOpenMovement("");
      this.setState({
        movement_type: {},
        movement_payment_method_id: {},
        movement_flow_category_id: {},
        movement_date: "",
        movement_value: "",
        movement_description: "",
        movement_obs: "",
        movement_id: "",
      });
      addToast({ title: "Sucesso!.", content: "Exclusão realizada com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Erro ao excluir movimentação. Tente novamente");
      } else alert("Erro ao excluir movimentação. Tente novamente");

      console.log(error);
    }

    this.setState({ loading: false });
  }

  renderProjects(items) {
    const { movements } = this.state;

    return items.map(id => {
      const data = movements[id];
      if (!data) {
        return "";
      }

      return (
        <li className="rui-kanban-item" key={id} data-id={id} onClick={() => this.handleEditMovement(data.data)}>
          <div className={classnames("rui-task", data.color ? `rui-task-${data.color}` : "")}>
            <div className="rui-task-icon">
              <Icon name={data.icon} />
            </div>
            <div className="rui-task-content">
              <a className="rui-task-title">{data.label}</a>
              <a className="rui-task-title">
                <strong>{data.price}</strong>
              </a>
              <small className="rui-task-subtitle">{data.by}</small>
            </div>
          </div>
        </li>
      );
    });
  }

  filterHistory(item) {
    if (this.state.term.toUpperCase() === "RECEITAS" || this.state.term.toUpperCase() === "ENTRADAS") {
      if (item.type.toUpperCase().includes("IN")) return true;
    }
    if (this.state.term.toUpperCase() === "SAIDAS" || this.state.term.toUpperCase() === "DESPESAS" || this.state.term.toUpperCase() === "RETIRADAS") {
      if (item.type.toUpperCase().includes("OUT")) return true;
    }

    if (
      item?.paymentMethod?.name.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.category?.name.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.user?.name.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item.type.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.description.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.sale?.coupon?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.sale?.title?.toUpperCase().includes(this.state.term.toUpperCase())
    )
      return true;
    else return false;
  }

  componentDidMount() {
    this.loadCashier();
    this.loadFiliais();
    this.loadCategories();
    this.loadPaymentMethods();
  }

  render() {
    const { movementsOutbound, movementsIncoming, movementsSpun } = this.state;
    let { page_length, page, page_limit } = this.state;
    let pages = [];

    // --> obtem os registros filtrados, conforme a busca pelo usuário
    let movements = this.state.data.movements.filter(item => this.state.term === "" || this.filterHistory(item));

    page_length = Math.ceil(movements.length / page_limit);
    for (let i = 0; i < page_length; i++) {
      pages.push(i);
    }
    // --> obtem os registros conforme pagina selecionada
    movements = movements.slice(page * page_limit, page * page_limit + page_limit);

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
        <blockquote className={`blockquote blockquote-style-2 cashier-${this.state.data.state}`}>
          <p className="mb-0">
            Situação: <strong>{this.state.data.state === "open" ? "Aberto" : this.state.data.state === "closed" ? "Fechado" : "Não iniciado"}</strong>
            <br />
            Aberto em: <strong>{this.state.data.date ? format(parseISO(this.state.data.date), "dd'/'MM'/'yyyy' às 'HH':'mm':'ss") : ""}</strong>
            <br />
            Saldo Inicial: R$ <strong>{this.state.data.opening_balance.toLocaleString()}</strong>
            {this.state.data.closing_balance ? (
              <>
                <br />
                Saldo de Fechamento: R$ <strong>{this.state.data.closing_balance.toLocaleString()}</strong>
              </>
            ) : (
              <></>
            )}
          </p>
          <footer className="blockquote-footer">
            Aberto por: <strong>{this.state.data.user.name}</strong>
          </footer>
        </blockquote>
        <div className="rui-filemanager">
          <div className="rui-filemanager-header">
            <h2 className="mt-15">Movimentações</h2>
            <div className="rui-filemanager-buttons">
              <ul>
                <li className="ml-20">
                  <button
                    id="popover_expenses"
                    onClick={() => {
                      this.clearFields();
                      this.toggleModalOpenMovement({ value: "out", label: "Retirada/Saída/Despesa" });
                    }}
                    type="button"
                    className="btn btn-custom-round btn-danger btn-lg btn-opt">
                    <Icon name="arrow-down-circle" />
                  </button>

                  <UncontrolledPopover placement="right" target="popover_expenses" trigger="hover">
                    <PopoverHeader>Nova Retirada/Saída</PopoverHeader>
                    <PopoverBody>Clique aqui para adicionar uma nova despesa</PopoverBody>
                  </UncontrolledPopover>
                </li>
                <li className="ml-20">
                  <button
                    id="popover_income"
                    onClick={() => {
                      this.clearFields();
                      this.toggleModalOpenMovement({ value: "in", label: "Receita/Entrada" });
                    }}
                    type="button"
                    className="btn btn-custom-round btn-success btn-lg btn-opt">
                    <Icon name="arrow-up-circle" />
                  </button>
                  <UncontrolledPopover placement="right" target="popover_income" trigger="hover">
                    <PopoverHeader>Nova Receita/Entrada</PopoverHeader>
                    <PopoverBody>Clique aqui para adicionar uma nova receita</PopoverBody>
                  </UncontrolledPopover>
                </li>
              </ul>
            </div>
          </div>
          <div className="rui-scrollbar rui-kanban">
            <div className="row flex-nowrap">
              <div className="col">
                <div className="rui-kanban-col kie">
                  <h3 className="h4">Receitas/Entradas</h3>

                  <ReactSortable
                    options={{
                      animation: 150,
                      group: {
                        name: "movements",
                        pull: false,
                        put: false,
                      },
                    }}
                    className="rui-sortable list-unstyled"
                    onChange={items => {
                      this.setState({ movementsIncoming: items });
                    }}>
                    {this.renderProjects(movementsIncoming)}
                  </ReactSortable>
                </div>
              </div>

              <div className="col">
                <div className="rui-kanban-col kie">
                  <h3 className="h4">Retiradas/Saídas</h3>
                  <ReactSortable
                    options={{
                      animation: 150,
                      group: {
                        name: "movements",
                        pull: false,
                        put: false,
                      },
                    }}
                    className="rui-sortable list-unstyled"
                    onChange={items => {
                      this.setState({ movementsOutbound: items });
                    }}>
                    {this.renderProjects(movementsOutbound)}
                  </ReactSortable>
                </div>
              </div>

              <div className="col">
                <div className="rui-kanban-col kie">
                  <h3 className="h4">À Prazo/Fiado</h3>
                  <ReactSortable
                    options={{
                      animation: 150,
                      group: {
                        name: "movements",
                        pull: false,
                        put: false,
                      },
                    }}
                    className="rui-sortable list-unstyled"
                    onChange={items => {
                      this.setState({ movementsSpun: items });
                    }}>
                    {this.renderProjects(movementsSpun)}
                  </ReactSortable>
                </div>
              </div>
            </div>
          </div>
          <div className="rui-filemanager-header">
            <h2 className="mt-30">Balanço</h2>
            <div className="rui-filemanager-buttons">
              <ul>
                {this.state.cashier_id && this.state.data.state === "open" ? (
                  <li className="ml-20">
                    <button id="popover_close" onClick={() => this.toggleModalConfirmClosingCashier()} type="button" className="btn btn-primary btn-lg kie">
                      Fechar Caixa
                    </button>

                    <UncontrolledPopover placement="right" target="popover_close" trigger="hover">
                      <PopoverHeader>Fechar Caixa do Dia</PopoverHeader>
                      <PopoverBody>Clique para fechar o caixa e gerar os lançamentos</PopoverBody>
                    </UncontrolledPopover>
                  </li>
                ) : (
                  <></>
                )}

                {this.state.cashier_id && this.state.data.state === "closed" ? (
                  <>
                    <li className="ml-20">
                      <button id="popover_reopen" onClick={() => this.toggleModalConfirmReopenCashier()} type="button" className="btn btn-warning btn-lg kie ">
                        Reabrir Caixa
                      </button>

                      <UncontrolledPopover placement="right" target="popover_reopen" trigger="hover">
                        <PopoverHeader>Reabrir Caixa do Dia</PopoverHeader>
                        <PopoverBody>Clique para reabrir o caixa</PopoverBody>
                      </UncontrolledPopover>
                    </li>
                  </>
                ) : (
                  <></>
                )}

                {!this.state.cashier_id && !this.state.data.state ? (
                  <>
                    <li className="ml-20">
                      <button
                        id="popover_open"
                        onClick={() => {
                          this.toggle();
                          this.setState({ opening_balance: 0 });
                        }}
                        type="button"
                        className="btn btn-success btn-lg kie">
                        Abrir Caixa
                      </button>

                      <UncontrolledPopover placement="right" target="popover_open" trigger="hover">
                        <PopoverHeader>Abrir Caixa do Dia</PopoverHeader>
                        <PopoverBody>Clique para abrir o caixa</PopoverBody>
                      </UncontrolledPopover>
                    </li>
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>
          <ul className="list-group list-group-flush rui-project-releases-list kie">
            <li className="list-group-item pt-0">
              <div className="rui-changelog">
                <blockquote className="blockquote blockquote-style-2 kie">
                  <div className="balance">
                    <div className="balance-item">
                      <h3 className="rui-changelog-title text-secondary">R$ {this.state.data.opening_balance.toLocaleString()}</h3>
                      <div className="rui-changelog-subtitle text-secondary mt-0">Saldo de Abertura</div>
                    </div>
                    <div className="balance-item">
                      <h3 className="rui-changelog-title text-success">R$ {this.state.data.income.toLocaleString()}</h3>
                      <div className="rui-changelog-subtitle text-success mt-0">Entradas</div>
                    </div>
                    <div className="balance-item">
                      <h3 className="rui-changelog-title text-danger">R$ {this.state.data.expense.toLocaleString()}</h3>
                      <div className="rui-changelog-subtitle text-danger mt-0">Saídas</div>
                    </div>
                    <div className="balance-item">
                      <h3 className="rui-changelog-title text-primary">
                        R$ {(this.state.data.opening_balance + (this.state.data.income - this.state.data.expense)).toLocaleString()}
                      </h3>
                      <div className="rui-changelog-subtitle text-primary mt-0">Saldo</div>
                    </div>
                  </div>
                </blockquote>
              </div>
            </li>
          </ul>

          <div className="rui-filemanager-header">
            <h2 className="mt-30">Por tipo</h2>
          </div>
          <ul className="list-group list-group-flush rui-project-releases-list kie">
            <li className="list-group-item pt-0">
              <div className="rui-changelog">
                <blockquote className="blockquote blockquote-style-2 kie">
                  <div className="balance">
                    {this.state.data.balance.map(item => (
                      <div className="balance-item">
                        <h3 className="rui-changelog-title ">R$ {item.amount.toLocaleString()}</h3>
                        <div className="rui-changelog-subtitle mt-0">{item.payment_method.name}</div>
                      </div>
                    ))}
                  </div>
                </blockquote>
              </div>
            </li>
          </ul>
        </div>

        <h2 className="mt-30">Histórico do dia</h2>
        <div className="card">
          <div className="card-body py-30">
            <div className="rui-project-task-search">
              <div className="input-group input-group-clean">
                <input
                  type="search"
                  className="form-control pl-3 order-12"
                  placeholder="Digite para procurar..."
                  value={this.state.term}
                  onChange={event => this.setState({ term: event.target.value })}
                />
                <div className="input-group-prepend mnl-3 order-1">
                  <button type="button" className="btn btn-clean btn-uniform btn-grey-5 mb-0 mnl-8">
                    <Icon name="search" />
                  </button>
                </div>
              </div>
            </div>
            <div className="rui-project-task-info">
              <a className="rui-project-task-info-link">
                <span className="rui-project-task-info-title">Saldo do dia: </span>
              </a>
              <a className={`rui-task-subtitle price ${this.state.data.income - this.state.data.expense < 0 ? "out" : "in"} `}>
                R$ {(this.state.data.income - this.state.data.expense).toLocaleString()}
              </a>
            </div>
            <ul className="list-group list-group-flush rui-project-task-list">
              {movements.map(item => (
                <li className="list-group-item" key={item.id}>
                  <div className="rui-task ">
                    <div className="rui-task-content">
                      <a className="rui-task-title kie" onClick={() => this.handleEditMovement(item)}>
                        {item.description}
                      </a>
                      <small className="rui-task-subtitle">
                        Às <strong>{format(parseISO(item.date), "HH':'mm'Hrs'")}</strong>, Por{" "}
                        <a>
                          <strong>{item.user.name}</strong>
                        </a>
                      </small>
                      <small className="rui-task-subtitle">
                        Categoria:{" "}
                        <a>
                          <strong>{item.category.name}</strong>
                        </a>
                        , Forma:{" "}
                        <a>
                          <strong>{item.paymentMethod?.name}</strong>
                        </a>
                      </small>
                    </div>
                    <a className={`rui-task-subtitle price ${item.paymentMethod.is_spun_sales ? "spun" : item.type}`}>
                      {item.type === "out" && !item.paymentMethod.is_spun_sales ? (
                        <>
                          - R$ <strong>{item.value.toLocaleString()}</strong>
                        </>
                      ) : (
                        <></>
                      )}
                      {item.type === "in" && !item.paymentMethod.is_spun_sales ? (
                        <>
                          R$ <strong>{item.value.toLocaleString()}</strong>
                        </>
                      ) : (
                        <></>
                      )}
                      {item.paymentMethod.is_spun_sales ? (
                        <>
                          R$ <strong>{item.value.toLocaleString()}</strong>
                        </>
                      ) : (
                        <></>
                      )}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="mt-15" aria-label="Page navigation example">
          <ul className="pagination pagination-sm">
            {pages.map(item => (
              <li onClick={() => this.setState({ page: item })} className={`page-item ${item === this.state.page ? "active" : ""}`}>
                <a className="page-link">{item + 1}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/** modal abri caixa */}
        <Modal
          isOpen={this.state.modalOpen}
          className={this.props.className}
          toggle={this.toggle}
          fade
          onOpened={() => document.querySelector("#opening_balance").focus()}>
          <form onSubmit={this.toggleModalConfirmOpeningCashier}>
            <div className="modal-header">
              <h5 className="modal-title h2">ABERTURA DO CAIXA DO DIA</h5>
              <Button className="close" color="" onClick={this.toggle}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              Realizar abertura do caixa para o dia <mark className="display-4">{format(new Date(), "dd'/'MM'/'yyyy")}</mark>
              <br />
              <br />
              <FormGroup>
                <Label for="date">Data e Hora *</Label>
                <Input id="date" name="date" required readOnly min={new Date()} placeholder="01/01/2021" type="datetime-local" value={this.state.date} />
              </FormGroup>
              <FormGroup>
                <Label for="filial_id">Filial *</Label>
                <Select
                  id="filial_id"
                  name="filial_id"
                  required
                  defaultValue={this.state.filial_id}
                  value={this.state.filial_id}
                  options={this.state.filiais}
                  styles={customStyles}
                  inputProps={{ readOnly: true }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="user_id">Aberto por *</Label>
                <Select
                  id="user_id"
                  name="user_id"
                  required
                  defaultValue={this.state.user_id}
                  value={this.state.user_id}
                  options={this.state.users}
                  styles={customStyles}
                  readOnly
                  disabled
                  inputProps={{ readOnly: true }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="opening_balance">Saldo Inicial *</Label>
                <Input
                  id="opening_balance"
                  name="opening_balance"
                  placeholder="0,00"
                  type="text"
                  required
                  value={this.state.opening_balance}
                  onChange={event => this.setState({ opening_balance: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="obs">Observações</Label>
                <Input id="obs" name="obs" placeholder="" type="text" value={this.state.obs} onChange={event => this.setState({ obs: event.target.value })} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>
                Cancelar
              </Button>
              <Button color="success" type="submit" disabled={this.state.loading}>
                {this.state.loading ? "Abrindo..." : "Abrir Caixa"}
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/** model que confirma a abertura do vaixa */}
        <Modal isOpen={this.state.modalConfirmOpeningCashier} toggle={this.toggleModalConfirmOpeningCashier} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Confirma a abertura do caixa?</h5>
            <Button className="close" color="" onClick={this.toggleModalConfirmOpeningCashier}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            Filial: <mark className="display-4">{this.state.filial_id.label}</mark>
            <br />
            Data e Hora: <mark className="display-4">{format(parseISO(this.state.date), "dd'/'MM'/'yyyy HH':'mm':'ss")}</mark>
            <br />
            Saldo Inicial: <mark className="display-4">R$ {this.state.opening_balance.toLocaleString()}</mark>
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalConfirmOpeningCashier}>
              Corrigir
            </Button>{" "}
            <Button color="success" onClick={this.handleSendOpenCashier} disabled={this.state.loading}>
              {this.state.loading ? "Efetuando Abertura..." : "Confirmar"}
            </Button>
          </ModalFooter>
        </Modal>

        {/** modal nova entrada/saida no */}
        <Modal
          isOpen={this.state.modalOpenMovement}
          className={this.props.className}
          fade
          onOpened={() => document.querySelector("#movement_flow_category_id").focus()}>
          <form onSubmit={this.handleSaveMovement}>
            <div className="modal-header">
              <h5 className="modal-title h2">Movimentação no caixa</h5>
              <Button className="close" color="" onClick={this.toggleModalOpenMovement}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              Registrar uma <mark className="display-4">{this.state.movement_type.value === "in" ? "Receita/Entrada" : "Retirada/Saída/Despesa"}</mark>
              <br />
              <br />
              <FormGroup>
                <Label for="movement_type">Tipo de Movimentação *</Label>
                <Select
                  id="movement_type"
                  name="movement_type"
                  required
                  defaultValue={this.state.movement_type}
                  value={this.state.movement_type}
                  options={this.state.movement_types}
                  styles={customStyles}
                  readOnly
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_filial_id">Filial *</Label>
                <Select
                  id="movement_filial_id"
                  name="movement_filial_id"
                  required
                  defaultValue={this.state.movement_filial_id}
                  value={this.state.movement_filial_id}
                  options={this.state.filiais}
                  styles={customStyles}
                  inputProps={{ readOnly: true }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_flow_category_id">Categoria *</Label>
                <Select
                  id="movement_flow_category_id"
                  name="movement_flow_category_id"
                  required
                  defaultValue={this.state.movement_flow_category_id}
                  value={this.state.movement_flow_category_id}
                  options={this.state.flow_categories}
                  styles={customStyles}
                  onChange={row => this.setState({ movement_flow_category_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_date">Data e Hora *</Label>
                <Input
                  id="movement_date"
                  name="movement_date"
                  min={new Date()}
                  placeholder="01/01/2021"
                  type="time"
                  value={this.state.movement_date}
                  onChange={event => this.setState({ movement_date: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_user_id">Realizado por *</Label>
                <Select
                  id="movement_user_id"
                  name="movement_user_id"
                  required
                  defaultValue={this.state.movement_user_id}
                  value={this.state.movement_user_id}
                  options={this.state.users}
                  styles={customStyles}
                  readOnly
                  disabled
                  inputProps={{ readOnly: true }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_payment_method_id">Movimentação feita através?</Label>
                <Select
                  id="movement_payment_method_id"
                  name="movement_payment_method_id"
                  defaultValue={this.state.movement_payment_method_id}
                  value={this.state.movement_payment_method_id}
                  options={this.state.payment_methods}
                  styles={customStyles}
                  onChange={row => this.setState({ movement_payment_method_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_value">Valor *</Label>
                <Input
                  id="movement_value"
                  name="movement_value"
                  placeholder="0,00"
                  type="text"
                  required
                  value={this.state.movement_value}
                  onChange={event => this.setState({ movement_value: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_description">Descricão *</Label>
                <Input
                  id="movement_description"
                  name="movement_description"
                  placeholder=""
                  type="text"
                  required
                  value={this.state.movement_description}
                  onChange={event => this.setState({ movement_description: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="movement_obs">Observações</Label>
                <Input
                  id="movement_obs"
                  name="movement_obs"
                  placeholder=""
                  type="text"
                  value={this.state.movement_obs}
                  onChange={event => this.setState({ movement_obs: event.target.value })}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleModalOpenMovement}>
                Fechar
              </Button>

              {this.state.movement_is_editable ? (
                <>
                  {this.state.movement_id ? (
                    <Button onClick={() => this.handleRemoveMovement()} color="danger" type="button" disabled={this.state.loading}>
                      {this.state.loading ? "Excluindo..." : "Excluir"}
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button color="success" type="submit" disabled={this.state.loading}>
                    {this.state.loading ? "Salvando..." : "Salvar movimentação"}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </ModalFooter>
          </form>
        </Modal>

        {/** model que confirma o fechamento do caixa */}
        <Modal size="lg" isOpen={this.state.modalConfirmClosingCashier} toggle={this.toggleModalConfirmClosingCashier} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Confirma o fechamento do caixa?</h5>
            <Button className="close" color="" onClick={this.toggleModalConfirmClosingCashier}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            Filial: <mark className="display-4">{this.state.filial_id.label}</mark>
            <br />
            Caixa do dia: <mark className="display-4">{this.state.data.date ? format(parseISO(this.state.data.date), "dd'/'MM'/'yyyy") : ""}</mark>
            <br />
            Data e Hora do fechamento: <mark className="display-4">{format(parseISO(this.state.date), "dd'/'MM'/'yyyy HH':'mm':'ss")}</mark>
            <br />
            Saldo Inicial: <mark className="display-4">R$ {this.state.data.opening_balance.toLocaleString()}</mark>
            <br />
            Saldo Final: <mark className="display-4">R$ {(this.state.data.income - this.state.data.expense).toLocaleString()}</mark>
            <br />
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalConfirmClosingCashier}>
              Cancelar
            </Button>{" "}
            <Button color="success" onClick={this.handleSendCloseCashier} disabled={this.state.loading}>
              {this.state.loading ? "Efetuando Fechamento..." : "Confirmar"}
            </Button>
          </ModalFooter>
        </Modal>

        {/** model que confirma a reabertura do caixa */}
        <Modal isOpen={this.state.modalConfirmReopenCashier} toggle={this.toggleModalConfirmReopenCashier} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Confirma a reabertura do caixa?</h5>
            <Button className="close" color="" onClick={this.toggleModalConfirmReopenCashier}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            <mark className="h4">CAIXA FECHADO! Deseja realmente reabri-lo?</mark>
            <br />
            <mark className="h4">Todos dos laçamentos desse caixa serão impactados!</mark>
            <br />
            <br />
            <br />
            Filial: <mark className="display-5">{this.state.filial_id.label}</mark>
            <br />
            Caixa do dia: <mark className="display-5">{this.state.data.date ? format(parseISO(this.state.data.date), "dd'/'MM'/'yyyy") : ""}</mark>
            <br />
            Data e Hora do fechamento: <mark className="display-5">{format(parseISO(this.state.date), "dd'/'MM'/'yyyy HH':'mm':'ss")}</mark>
            <br />
            Saldo Inicial: <mark className="display-5">R$ {this.state.data.opening_balance.toLocaleString()}</mark>
            <br />
            Saldo Final: <mark className="display-5">R$ {(this.state.data.income - this.state.data.expense).toLocaleString()}</mark>
            <br />
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalConfirmReopenCashier}>
              Cancelar
            </Button>{" "}
            <Button color="success" onClick={this.handleSendReopenCashier} disabled={this.state.loading}>
              {this.state.loading ? "Reabrindo..." : "Reabrir"}
            </Button>
          </ModalFooter>
        </Modal>
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
