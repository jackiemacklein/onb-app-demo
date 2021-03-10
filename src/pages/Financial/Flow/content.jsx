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

import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Button, Input, Label, FormGroup } from "reactstrap";

import { Row, Col } from "reactstrap";
import { Card, CardBody, CardText, CardTitle, CardSubtitle } from "reactstrap";
import { CardLink, CustomInput } from "reactstrap";
import Cookies from "js-cookie";
import Select from "react-select";

import queryString from "query-string";

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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    const params = queryString.parse(props.location.search);

    this.state = {
      get_client_id: params.client_id ?? "",

      page: 0,
      page_limit: 20,
      page_length: 1,

      modalOpenIn: false,
      modalOpenOut: false,
      modalOpenTransf: false,

      users: [{ value: Cookies.get("rui-auth-user_id"), label: Cookies.get("rui-auth-user_name") }],
      filiais: [],
      bills: [],
      bank_accounts: [],
      bank_accounts_in: [],
      flow_categories: [],
      clients: [],
      previous_balance: null,
      term: "",
      loading: false,

      types: [
        { value: "in", label: "Contas à Receber" },
        { value: "out", label: "Contas à Pagar" },
      ],

      is_editable: true,
      id: "",
      type: {},
      date: "",
      bank_account_id: {},
      user_id: { value: Cookies.get("rui-auth-user_id"), label: Cookies.get("rui-auth-user_name") },
      flow_category_id: {},
      state: false,
      client_id: {},
      description: "",
      value: "",
      obs: "",
      target: "",
      origin: "",

      bank_account_id_out: {},
      bank_account_id_in: {},

      auxItem: {},

      calculations: {
        realized_in: 0, // --> receitas realizadas
        expected_in: 0, // --> receitas previstas
        realized_out: 0, // --> despesas realizadas
        expected_out: 0, // --> despesas previstas
        balance: 0, // --> saldo atual
        balance_expected: 0, // -> saldo previsto
      },
      filter_types: [
        { value: "", label: "Todos os lançamentos" },
        { value: "type=in", label: "Receitas" },
        { value: "type=in&state=paid", label: "Receitas recebidas" },
        { value: "type=in&state=opened", label: "Receitas não pagas" },
        { value: "type=out", label: "Despesas" },
        { value: "type=out&state=paid", label: "Despesas pagas" },
        { value: "type=out&state=opened", label: "Despesas não pagas" },
        { value: "tranf=true", label: "Transferências entre contas" },
        { value: "tranf=true&state=paid", label: "Transferências realizadas" },
        { value: "tranf=true&state=opened", label: "Transferências pendentes" },
        { value: "tranf=true&type=out", label: "Transferências feitas" },
        { value: "tranf=true&type=in", label: "Transferências recebidas" },
      ],
      filter_start_date: params.start_date ? parseISO(params.start_date) : new Date(),
      filter_end_date: params.end_date ? parseISO(params.end_date) : null,
      filter_filial_id: {
        value: Cookies.get("rui-auth-filial_id") != "undefined" ? Cookies.get("rui-auth-filial_id") : "",
        label: Cookies.get("rui-auth-filial_name") != "undefined" ? Cookies.get("rui-auth-filial_name") : "Selecione",
      },
      filter_category_id: { value: "", label: "Todas" },
      filter_bank_account_id: { value: "", label: "Todos" },
      filter_type: { value: "", label: "Todos os lançamentos" },
      filter_client_id: { value: "-", label: "Todos" },
    };

    this.toggleIn = this.toggleIn.bind(this);
    this.toggleOut = this.toggleOut.bind(this);
    this.toggleTransf = this.toggleTransf.bind(this);
    this.toggleModalSave = this.toggleModalSave.bind(this);
    this.toggleModalSaveTransf = this.toggleModalSaveTransf.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.update = this.update.bind(this);
    this.updateTransf = this.updateTransf.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadBills = this.loadBills.bind(this);
    this.loadBankAcconts = this.loadBankAcconts.bind(this);
    this.loadBankAccontsIn = this.loadBankAccontsIn.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.loadClients = this.loadClients.bind(this);
    this.filterHistory = this.filterHistory.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUpdateState = this.handleUpdateState.bind(this);
    this.calculations = this.calculations.bind(this);
  }

  // --> realizada os calculos do balanço
  async calculations(items) {
    let realized_in = 0;
    let expected_in = 0;
    let realized_out = 0;
    let expected_out = 0;
    let balance = 0;
    let balance_expected = 0;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type === "in") {
        expected_in = expected_in + items[i].value;

        if (items[i].state === "paid") {
          realized_in = realized_in + items[i].value;
        }
      } else if (items[i].type === "out") {
        expected_out = expected_out + items[i].value;

        if (items[i].state === "paid") {
          realized_out = realized_out + items[i].value;
        }
      }
    }

    balance = realized_in - realized_out;
    balance_expected = expected_in - expected_out;

    this.setState({ calculations: { realized_in, expected_in, realized_out, expected_out, balance, balance_expected } });
  }

  // --> responsavel por abrir e fechar o modal da Contas a receber
  toggleIn() {
    this.setState(prevState => ({
      type: { value: "in", label: "Contas à Receber" },
      modalOpenIn: !prevState.modalOpenIn,
    }));
  }

  // --> responsavel por abrir e fechar o modal da Contas a receber
  toggleOut() {
    this.setState(prevState => ({
      type: { value: "out", label: "Contas à Pagar" },
      modalOpenOut: !prevState.modalOpenOut,
    }));
  }

  // --> responsavel por abrir e fechar o modal da Contas a receber
  toggleTransf() {
    this.setState(prevState => ({
      modalOpenTransf: !prevState.modalOpenTransf,
    }));
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

  // carrega as clients
  async loadClients() {
    try {
      const { data } = await api.get("/crm/clients?is_active=true");
      const clients = data.map(item => {
        return { value: item.id, label: item.name };
      });
      this.setState({ clients });

      if (this.state.get_client_id) this.setState({ filter_client_id: clients.find(i => i.value == this.state.get_client_id) });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar os clientes");
    }
  }

  // --> Carrega na api os lancamentos de contas a pagar e a receber
  async loadBills() {
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      const client_id = this.state.filter_client_id.value !== "-" ? this.state.filter_client_id.value : this.state.get_client_id;

      const { data } = await api.get(
        `/bills/?client_id=${client_id}&start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}&flow_category_id=${this.state.filter_category_id.value}&bank_account_id=${this.state.filter_bank_account_id.value}&${this.state.filter_type.value}`,
      );

      this.setState({ bills: data.bills, previous_balance: data.previous_balance });

      this.calculations(data.bills);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Lançamentos");
    }
  }

  // --> Carrega na api as contas
  async loadBankAcconts() {
    const { location } = this.props;

    const params = queryString.parse(location.search);

    try {
      const { data } = await api.get("/banks/accounts");
      const bank_accounts = data.map(item => {
        return { value: item.id, label: item.name };
      });

      this.setState({ bank_accounts });

      if (params.bank_account_id) {
        this.loadBills();
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Contas e Carterias");
    }
  }

  // --> Carrega na api as contas de entrada
  async loadBankAccontsIn() {
    try {
      const { data } = await api.get("/banks/accounts?all=true");
      if (data.length > 0) {
        this.setState({
          bank_accounts_in: data.map(item => {
            return { value: item.id, label: item.name };
          }),
        });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Contas e Carterias de Entrada de Recursos");
    }
  }

  // --> Carrega as categorias das dos lancamentos
  async loadCategories() {
    const { data } = await api.get("/flows/categories");
    this.setState({
      flow_categories: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  // --> salva o registro
  async toggleModalSave(event) {
    event.preventDefault();
    const { addToast } = this.props;

    if (
      !this.state.description ||
      !this.state.flow_category_id ||
      !this.state.date ||
      !this.state.bank_account_id ||
      !this.state.value ||
      !this.state.user_id
    ) {
      alert("Preencha os campos obrigatórios.");
      return false;
    }

    this.setState({ loading: true });

    if (this.state.id) {
      return this.update();
    }

    try {
      const { data } = await api.post(`/bills`, {
        bank_account_id: this.state.bank_account_id.value,
        client_id: this.state?.client_id?.value,
        flow_category_id: this.state.flow_category_id.value,
        description: this.state.description,
        date: this.state.date,
        value: this.state.value,
        type: this.state.type.value,
        obs: this.state.obs,
        state: this.state.state ? "paid" : "opened",
        user_id: this.state.user_id.value,
      });

      this.loadBills();
      this.clearFields();
      this.setState({ modalOpenIn: false, modalOpenOut: false, modalOpenTransf: false });

      addToast({ title: "Sucesso!.", content: "Lançamento realizado com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao salvar lançamento. Tente novamente");
        }
      } else {
        alert("Erro ao salvar lançamento. Tente novamente");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> salva o registro de transferencia
  async toggleModalSaveTransf(event) {
    event.preventDefault();
    const { addToast } = this.props;

    if (!this.state.bank_account_id_out || !this.state.bank_account_id_in || !this.state.date || !this.state.value || !this.state.description) {
      alert("Preencha os campos obrigatórios.");
      return false;
    }

    this.setState({ loading: true });

    if (this.state.id) {
      return this.updateTransf();
    }

    try {
      // --> realiza a saida do recurso na conta de origem
      const { data } = await api.post(`/bills`, {
        bank_account_id: this.state.bank_account_id_out.value,
        flow_category_id: 46, // --> 45 = transferencia entre contas
        description: this.state.description,
        date: this.state.date,
        value: this.state.value,
        type: "out",
        obs: this.state.obs,
        state: "paid",
        user_id: this.state.user_id.value,
        target_bank_account_id: this.state.bank_account_id_in.value,
      });

      if (data) {
        // --> se houver sucesso na retirada do recursos entao envia para entrada do mesmo
        // --> realiza a entrada do recurso na conta de destino
        const res = await api.post(`/bills`, {
          bank_account_id: this.state.bank_account_id_in.value,
          flow_category_id: 46, // --> 45 = transferencia entre contas
          description: this.state.description,
          date: this.state.date,
          value: this.state.value,
          type: "in",
          obs: this.state.obs,
          state: "paid",
          user_id: this.state.user_id.value,
          origin: data.id,
          origin_bank_account_id: this.state.bank_account_id_out.value,
        });

        if (res.data) {
          const res2 = await api.put(`/bills/${data.id}`, { target: res.data.id });
        }
      }

      this.loadBills();
      this.clearFields();
      this.setState({ modalOpenIn: false, modalOpenOut: false, modalOpenTransf: false });

      addToast({ title: "Sucesso!.", content: "Transferência realizada com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Erro ao salvar transferência. Tente novamente");
      } else alert("Erro ao salvar transferência. Tente novamente");

      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> identifica o tipo de edição, se é entrada, saida ou transferencia
  async handleEdit(item) {
    this.setState({
      auxItem: item,
      is_editable: item.is_editable,
      id: item.id,
      type: this.state.types.find(i => i.value === item.type),
      date: format(parseISO(item.date), "yyyy'-'MM'-'dd"),
      bank_account_id: { value: item.bank_account.id, label: item.bank_account.name },
      flow_category_id: { value: item.flow_category.id, label: item.flow_category.name },
      state: item.state === "paid",
      client_id: { value: item?.client?.id, label: item?.client?.name },
      description: item.description,
      value: item.value,
      obs: item.obs,
      target: item.target,
      origin: item.origin,
      bank_account_id_out: this.state.bank_accounts_in.find(i => i.value === (item.origin_bank_account_id ?? item.bank_account_id)),
      bank_account_id_in: this.state.bank_accounts_in.find(i => i.value === (item.target_bank_account_id ?? item.bank_account_id)),
    });

    if (item.type === "in" && item.flow_category_id !== 46) {
      // --> se for entrada e nao for do tipo transferenca
      this.toggleIn();
    } else if (item.type === "out" && item.flow_category_id !== 46) {
      // --> se for saida e nao for do tipo transferenca
      this.toggleOut();
    } else if (item.type === "in" && item.flow_category_id === 46) {
      // --> se for entrada e for do tipo transferenca
      this.toggleTransf();
    } else if (item.type === "out" && item.flow_category_id === 46) {
      // --> se for saida e for do tipo transferenca
      this.toggleTransf();
    }
  }

  // --> atualiza o registro
  async update() {
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      const { data } = await api.put(`/bills/${this.state.id}`, {
        bank_account_id: this.state.bank_account_id.value,
        client_id: this.state?.client_id?.value,
        flow_category_id: this.state.flow_category_id.value,
        description: this.state.description,
        date: this.state.date,
        value: this.state.value,
        type: this.state.type.value,
        obs: this.state.obs,
        state: this.state.state ? "paid" : "opened",
        user_id: this.state.user_id.value,
      });

      this.loadBills();
      this.clearFields();
      this.setState({ modalOpenIn: false, modalOpenOut: false, modalOpenTransf: false });

      addToast({ title: "Sucesso!.", content: "Lançamento atualizado com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Erro ao salvar lançamento. Tente novamente");
      } else alert("Erro ao salvar lançamento. Tente novamente");

      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> atualizada uma transferencia
  async updateTransf() {
    const { addToast } = this.props;

    this.setState({ loading: false });

    try {
      // verifica se está editando a saida do recurso
      if (this.state.type.value === "out") {
        const { data } = await api.put(`/bills/${this.state.id}`, {
          bank_account_id: this.state.bank_account_id_out.value,
          flow_category_id: 46, // --> 46 = transferencia entre contas
          description: this.state.description,
          date: this.state.date,
          value: this.state.value,
          obs: this.state.obs,
          target_bank_account_id: this.state.bank_account_id_in.value,
        });

        if (data) {
          const res = await api.put(`/bills/${data.target}`, {
            bank_account_id: this.state.bank_account_id_in.value,
            flow_category_id: 46, // --> 46 = transferencia entre contas
            description: this.state.description,
            date: this.state.date,
            value: this.state.value,
            obs: this.state.obs,
            origin_bank_account_id: this.state.bank_account_id_out.value,
          });
        }
      } else if (this.state.type.value === "in") {
        //se estiver editando a entrada de recurso
        const { data } = await api.put(`/bills/${this.state.id}`, {
          bank_account_id: this.state.bank_account_id_in.value,
          flow_category_id: 46, // --> 46 = transferencia entre contas
          description: this.state.description,
          date: this.state.date,
          value: this.state.value,
          obs: this.state.obs,
          origin_bank_account_id: this.state.bank_account_id_out.value,
        });

        if (data) {
          const res = await api.put(`/bills/${data.origin}`, {
            bank_account_id: this.state.bank_account_id_out.value,
            flow_category_id: 46, // --> 46 = transferencia entre contas
            description: this.state.description,
            date: this.state.date,
            value: this.state.value,
            obs: this.state.obs,
            target_bank_account_id: this.state.bank_account_id_in.value,
          });
        }
      }

      this.loadBills();
      this.clearFields();
      this.setState({ modalOpenIn: false, modalOpenOut: false, modalOpenTransf: false });

      addToast({ title: "Sucesso!.", content: "Transferência atualizada com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Erro ao salvar transferência. Tente novamente");
      } else alert("Erro ao salvar transferência. Tente novamente");

      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> remove o registro
  async handleRemove() {
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      // verifica se está editando a saida do recurso
      if (this.state.auxItem.type === "out") {
        await api.delete(`/bills/${this.state.auxItem.id}`);
        if (this.state.auxItem.target) {
          await api.delete(`/bills/${this.state.auxItem.target}`);
        }
      } else if (this.state.auxItem.type === "in") {
        //se estiver editando a entrada de recurso
        await api.delete(`/bills/${this.state.auxItem.id}`);
        if (this.state.auxItem.origin) {
          await api.delete(`/bills/${this.state.auxItem.origin}`);
        }
      }

      this.loadBills();
      this.clearFields();
      this.setState({ modalOpenIn: false, modalOpenOut: false, modalOpenTransf: false });

      addToast({ title: "Sucesso!.", content: "Lançamento removido com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Erro ao remover lançamento. Tente novamente");
      } else alert("Erro ao remover lançamento. Tente novamente");

      console.log(error);
    }
    this.setState({ loading: false });
  }

  // --> atualiza o registro
  async handleUpdateState(item) {
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      const state = item.state === "paid" ? "opened" : "paid";

      // verifica se está editando a saida do recurso
      if (item.type === "out") {
        await api.put(`/bills/${item.id}`, { state });
        if (item.target) {
          await api.put(`/bills/${item.target}`, { state });
        }
      } else if (item.type === "in") {
        //se estiver editando a entrada de recurso
        await api.put(`/bills/${item.id}`, { state });
        if (item.origin) {
          await api.put(`/bills/${item.origin}`, { state });
        }
      }

      this.loadBills();
      addToast({ title: "Sucesso!.", content: "A Situação foi atualizada com sucesso.", time: new Date(), duration: 10000, color: "success" });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true)
          addToast({ title: "Erro!.", content: error.response.data.more, time: new Date(), duration: 10000, color: "danger" });
        else addToast({ title: "Erro!.", content: "Desculpe, não foi possivel atualizar a situação", time: new Date(), duration: 10000, color: "danger" });
      } else addToast({ title: "Erro!.", content: "Desculpe, não foi possivel atualizar a situação", time: new Date(), duration: 10000, color: "danger" });

      console.log(error);
    }

    this.setState({ loading: false });
  }

  // --> Filtra os registros
  filterHistory(item) {
    if (
      item?.bank_account?.name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.cashier?.name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.client?.name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item.description.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.filial?.name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.obs?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.user?.name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.flow_category?.name?.toUpperCase().includes(this.state.term.toUpperCase()) ||
      item?.flow_category?.category?.toUpperCase().includes(this.state.term.toUpperCase())
    )
      return true;
    else return false;
  }

  // --> limpa os campos do modal
  clearFields() {
    this.setState({
      auxItem: {},
      is_editable: true,
      id: "",
      type: {},
      date: "",
      bank_account_id: {},
      flow_category_id: {},
      obs: "",
      value: "",
      description: "",
      bank_account_id_out: {},
      bank_account_id_in: {},
    });
  }

  // --> realiza a alteração do filtro de datas
  changeFilterDate(dates) {
    const [start, end] = dates;
    this.setState({ filter_start_date: start, filter_end_date: end });
  }

  componentDidMount() {
    this.loadBills();
    this.loadFiliais();
    this.loadBankAcconts();
    this.loadBankAccontsIn();
    this.loadCategories();
    this.loadClients();
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.location.href.includes("/lancamentos")) {
      if (Cookies.get("rui-auth-token")) {
        if (
          prevState.filter_start_date !== this.state.filter_start_date ||
          prevState.filter_end_date !== this.state.filter_end_date ||
          prevState.filter_filial_id !== this.state.filter_filial_id ||
          prevState.filter_category_id !== this.state.filter_category_id ||
          prevState.filter_bank_account_id !== this.state.filter_bank_account_id ||
          prevState.filter_client_id !== this.state.filter_client_id ||
          prevState.filter_type !== this.state.filter_type
        ) {
          this.loadBills();
        }
      }
    }
  }

  render() {
    let { bills, page_length, page, page_limit } = this.state;
    let pages = [];

    // --> obtem os registros filtrados, conforme a busca pelo usuário
    let items = bills.filter(item => this.state.term === "" || this.filterHistory(item));

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
            <Col xs={12} sm={6} md={3}>
              <Label for="filter_type" className="mt-10">
                Tipo
              </Label>
              <Select
                id="filter_type"
                name="filter_type"
                defaultValue={this.state.filter_type}
                value={this.state.filter_type}
                options={this.state.filter_types}
                styles={customStyles}
                onChange={row => this.setState({ filter_type: row })}
              />
            </Col>

            <Col xs={12} sm={6} md={3}>
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

            <Col xs={12} sm={6} md={3}>
              <Label for="filter_category_id" className="mt-10">
                Categorias
              </Label>
              <Select
                id="filter_category_id"
                name="filter_category_id"
                defaultValue={this.state.filter_category_id}
                value={this.state.filter_category_id}
                options={[{ value: "", label: "Todas" }, ...this.state.flow_categories]}
                styles={customStyles}
                onChange={row => this.setState({ filter_category_id: row })}
              />
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Label for="filter_bank_account_id" className="mt-10">
                Contas & Carterias
              </Label>
              <Select
                id="filter_bank_account_id"
                name="filter_bank_account_id"
                defaultValue={this.state.filter_bank_account_id}
                value={this.state.filter_bank_account_id}
                options={[{ value: "", label: "Todos" }, ...this.state.bank_accounts]}
                styles={customStyles}
                onChange={row => this.setState({ filter_bank_account_id: row })}
              />
            </Col>
          </Row>
          <Row>
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

            <Col xs={12} sm={6} md={6}>
              <Label for="filter_client_id" className="mt-10">
                Clientes
              </Label>
              <Select
                id="filter_client_id"
                name="filter_client_id"
                defaultValue={this.state.filter_client_id}
                value={this.state.filter_client_id}
                options={[{ value: "", label: "Todos" }, ...this.state.clients]}
                styles={customStyles}
                onChange={row => this.setState({ filter_client_id: row })}
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
                  <button
                    id="popover_expenses"
                    onClick={() => {
                      this.clearFields();
                      this.toggleOut();
                    }}
                    type="button"
                    className="ml-15 btn btn-custom-round btn-danger btn-lg btn-opt">
                    <Icon name="arrow-down-circle" />
                  </button>

                  <UncontrolledPopover placement="right" target="popover_expenses" trigger="hover">
                    <PopoverHeader>Nova Conta à Pagar</PopoverHeader>
                    <PopoverBody>Clique aqui para adicionar uma nova Conta à Pagar</PopoverBody>
                  </UncontrolledPopover>

                  <button
                    id="popover_income"
                    onClick={() => {
                      this.clearFields();
                      this.toggleIn();
                    }}
                    type="button"
                    className="ml-15 btn btn-custom-round btn-success btn-lg btn-opt">
                    <Icon name="arrow-up-circle" />
                  </button>
                  <UncontrolledPopover placement="right" target="popover_income" trigger="hover">
                    <PopoverHeader>Nova Conta à Receber</PopoverHeader>
                    <PopoverBody>Clique aqui para adicionar uma nova Conta à Receber</PopoverBody>
                  </UncontrolledPopover>

                  <button
                    id="popover_transf"
                    onClick={() => {
                      this.clearFields();
                      this.toggleTransf();
                    }}
                    type="button"
                    className="ml-15 btn btn-custom-round btn-primary btn-lg btn-opt">
                    <Icon name="git-branch" />
                  </button>

                  <UncontrolledPopover placement="right" target="popover_transf" trigger="hover">
                    <PopoverHeader>Transferência de recursos</PopoverHeader>
                    <PopoverBody>Clique para realizar uma transferência entre contas</PopoverBody>
                  </UncontrolledPopover>

                  <ExcelFile
                    element={
                      <button id="popover_download" type="button" className="ml-15 btn btn-custom-round btn-primary btn-down btn-lg btn-opt">
                        <Icon name="download" />
                      </button>
                    }
                    filename="contas-a-pagar-e-receber">
                    <ExcelSheet data={this.state.bills} name="Contas a pagar e receber">
                      <ExcelColumn label="ID" value="id" />
                      <ExcelColumn label="Filial" value={col => col.filial?.name} />
                      <ExcelColumn label="Data" value={col => format(parseISO(col.date), "dd'/'MM'/'yyyy")} />
                      <ExcelColumn label="Tipo" value={col => (col.type === "out" ? "Contas à Pagar" : "Contas à receber")} />
                      <ExcelColumn label="Situação" value={col => (col.state === "paid" ? "PAGO" : "À PAGAR")} />
                      <ExcelColumn label="Valor da Movimentação" value={col => `R$ ${col.type === "out" ? col.value * -1 : col.value}`} />
                      <ExcelColumn label="Descrição" value={col => col.description} />
                      <ExcelColumn label="Categoria" value={col => col.flow_category?.name} />
                      <ExcelColumn label="Grupo da Categoria" value={col => col.flow_category?.category} />
                      <ExcelColumn label="Movimentação no Banco" value={col => col.bank_account?.name} />
                      <ExcelColumn label="Nome Cliente" value={col => col.client?.name} />
                      <ExcelColumn label="CPF Cliente" value={col => col.client?.cpf} />
                      <ExcelColumn label="Observações" value="obs" />
                    </ExcelSheet>
                  </ExcelFile>
                  <UncontrolledPopover placement="top" target="popover_download" trigger="hover">
                    <PopoverHeader>Baixar EXCEL</PopoverHeader>
                    <PopoverBody>Clique para fazer o download do arquivo excel</PopoverBody>
                  </UncontrolledPopover>
                </div>
              </div>
            </div>
            <div className="rui-project-task-info">
              {this.state.previous_balance !== null && this.state.previous_balance != undefined ? (
                <>
                  <a className="rui-project-task-info-link ml-20 mr-0">
                    <span className="rui-project-task-info-title">Saldo Anterior: </span>
                  </a>
                  <a className={`rui-task-subtitle balance ml-10 mr-0 ${this.state.previous_balance < 0 ? "out" : "in"} `}>
                    {this.state.previous_balance < 0 ? (
                      <>
                        <strong>
                          <small>- R$ </small>
                          {(this.state.previous_balance * -1).toLocaleString()}
                        </strong>
                      </>
                    ) : (
                      <>
                        <strong>
                          <small>R$ </small>
                          {this.state.previous_balance.toLocaleString()}
                        </strong>
                      </>
                    )}
                  </a>
                </>
              ) : (
                <></>
              )}
              <a className="rui-project-task-info-link ml-20 mr-0">
                <span className="rui-project-task-info-title">Saldo: </span>
              </a>
              <a className={`rui-task-subtitle balance ml-10 mr-0 ${this.state.calculations.balance < 0 ? "out" : "in"} `}>
                {this.state.calculations.balance < 0 ? (
                  <>
                    <strong>
                      <small>- R$ </small>
                      {(this.state.calculations.balance * -1).toLocaleString()}
                    </strong>
                  </>
                ) : (
                  <>
                    <strong>
                      <small>R$ </small>
                      {this.state.calculations.balance.toLocaleString()}
                    </strong>
                  </>
                )}
              </a>
              <a className="rui-project-task-info-link ml-20 mr-0">
                <span className="rui-project-task-info-title">Previsto: </span>
              </a>
              <a className={`rui-task-subtitle balance ml-10 mr-0 ${this.state.calculations.balance_expected < 0 ? "out" : "in"} `}>
                {this.state.calculations.balance_expected < 0 ? (
                  <>
                    <strong>
                      <small>- R$ </small>
                      {(this.state.calculations.balance_expected * -1).toLocaleString()}
                    </strong>
                  </>
                ) : (
                  <>
                    <strong>
                      <small>R$ </small>
                      {this.state.calculations.balance_expected.toLocaleString()}
                    </strong>
                  </>
                )}
              </a>
            </div>
            <ul className="list-group list-group-flush rui-project-task-list bills">
              {items.map((item, indice) => (
                <div className="row-bill">
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
                  <Card key={item.id} className="card">
                    <CardBody>
                      <CardTitle className="h2" onClick={() => this.handleEdit(item)}>
                        {item.description}
                      </CardTitle>
                      <CardSubtitle className="h5 text-muted mb-2 card-subtitle mt-2">
                        <strong>{item?.flow_category?.name ?? "-"}</strong>
                      </CardSubtitle>
                      <CardSubtitle className="h4 text-muted mb-5">{item?.bank_account?.name}</CardSubtitle>
                      {item.client_id && !item.commission_id ? (
                        <>
                          <CardText className="mb-5">
                            <Link to={`/crm/clientes/show/${item.client_id}`} className="card-link">
                              {item?.client?.name}
                            </Link>
                          </CardText>
                        </>
                      ) : (
                        <></>
                      )}

                      {item.client_id && item.commission_id ? (
                        <>
                          <CardText className="mb-5">
                            <Link to={`/relatorios/gerenciais/comissoes?id=${item.id}`} className="card-link" target="_blank">
                              {item?.client?.name}
                            </Link>
                          </CardText>
                        </>
                      ) : (
                        <></>
                      )}

                      <CardLink onClick={() => this.handleUpdateState(item)} className={`${item.state} mt-10`} id={`popover_paid_${item.id}`}>
                        {item.flow_category_id === 46 ? ( // --> caso seja transferencia entre contas
                          <>
                            {item.type === "in" ? (
                              <>{this.state.loading ? "Atualizando..." : item.state === "paid" ? "Recebido" : "À Receber"}</>
                            ) : (
                              <>{this.state.loading ? "Atualizando..." : item.state === "paid" ? "Realizado" : "À Realizar"}</>
                            )}
                          </>
                        ) : (
                          <>
                            {this.state.loading ? (
                              "Atualizando..."
                            ) : item.type === "in" ? (
                              <>{this.state.loading ? "Atualizando..." : item.state === "paid" ? "Recebido" : "À Receber"}</>
                            ) : (
                              <>{this.state.loading ? "Atualizando..." : item.state === "paid" ? "Pago" : "À Pagar"}</>
                            )}
                          </>
                        )}
                      </CardLink>
                      <UncontrolledPopover placement="top" target={`popover_paid_${item.id}`} trigger="hover">
                        <PopoverHeader>
                          {item.flow_category_id === 46 ? ( // --> caso seja transferencia entre contas
                            <>
                              {item.type === "in" ? (
                                <>{item.state === "paid" ? "Recebido" : "À Receber"}</>
                              ) : (
                                <>{item.state === "paid" ? "Realizado" : "À Realizar"}</>
                              )}
                            </>
                          ) : (
                            <>
                              {item.type === "in" ? <>{item.state === "paid" ? "Recebido" : "À Receber"}</> : <>{item.state === "paid" ? "Pago" : "À Pagar"}</>}
                            </>
                          )}
                        </PopoverHeader>
                        <PopoverBody>
                          Clique para marcar como:{" "}
                          <strong>
                            {item.flow_category_id === 46 ? ( // --> caso seja transferencia entre contas
                              <>
                                {item.type === "in" ? (
                                  <>{item.state === "paid" ? "À RECEBER" : "RECEBIDO"}</>
                                ) : (
                                  <>{item.state === "paid" ? "À REALIZAR" : "REALIZADO"}</>
                                )}
                              </>
                            ) : (
                              <>
                                {item.type === "in" ? (
                                  <>{item.state === "paid" ? "À RECEBER" : "RECEBIDO"}</>
                                ) : (
                                  <>{item.state === "paid" ? "À PAGAR" : "PAGO"}</>
                                )}
                              </>
                            )}
                          </strong>
                        </PopoverBody>
                      </UncontrolledPopover>

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
                    <a className={`rui-task-subtitle price ${item.type}`}>
                      {item.type === "out" ? (
                        <>
                          <strong>
                            <small>- R$ </small>
                            {item.value.toLocaleString()}
                          </strong>
                        </>
                      ) : (
                        <></>
                      )}
                      {item.type === "in" ? (
                        <>
                          <strong>
                            <small>R$ </small>
                            {item.value.toLocaleString()}
                          </strong>
                        </>
                      ) : (
                        <></>
                      )}
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

        {/** modal lancamento CONTAS A RECEBER */}
        <Modal
          isOpen={this.state.modalOpenIn}
          toggle={this.toggleIn}
          className={this.props.className}
          fade
          onOpened={() => document.querySelector("#description").focus()}>
          <form onSubmit={this.toggleModalSave}>
            <div className="modal-header">
              <h5 className="modal-title h2">{this.state.id ? "Editar" : "Nova"} Conta à Receber</h5>
              <Button className="close" color="" onClick={this.toggleIn}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              {this.state.id ? "Editar" : "Adicionar"} uma <mark className="display-4">Conta à Receber</mark>
              <br />
              <br />
              <FormGroup>
                <Label for="description">Descrição *</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder=""
                  type="text"
                  required
                  value={this.state.description}
                  onChange={event => this.setState({ description: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="flow_category_id">Categoria *</Label>
                <Select
                  id="flow_category_id"
                  name="flow_category_id"
                  required
                  defaultValue={this.state.flow_category_id}
                  value={this.state.flow_category_id}
                  options={this.state.flow_categories}
                  styles={customStyles}
                  onChange={row => this.setState({ flow_category_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="date">Data *</Label>
                <Input
                  id="date"
                  required
                  name="date"
                  placeholder="01/01/2021"
                  type="date"
                  value={this.state.date}
                  onChange={event => this.setState({ date: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bank_account_id">Contas&Carteiras *</Label>
                <Select
                  id="filial_id"
                  name="filial_id"
                  required
                  defaultValue={this.state.bank_account_id}
                  value={this.state.bank_account_id}
                  options={this.state.bank_accounts}
                  styles={customStyles}
                  onChange={row => this.setState({ bank_account_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="value">Valor *</Label>
                <Input
                  id="value"
                  name="value"
                  placeholder="0,00"
                  type="text"
                  required
                  value={this.state.value}
                  onChange={event => this.setState({ value: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="user_id">Realizado por *</Label>
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
                <Label for="obs">Observações</Label>
                <Input id="obs" name="obs" placeholder="" type="text" value={this.state.obs} onChange={event => this.setState({ obs: event.target.value })} />
              </FormGroup>
              <FormGroup>
                <CustomInput
                  type="switch"
                  id="state"
                  name="state"
                  label="Recebido?"
                  checked={this.state.state}
                  onChange={event => this.setState({ state: event.target.checked })}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" type="button" onClick={this.toggleIn}>
                Fechar
              </Button>

              {this.state.is_editable ? (
                <>
                  {this.state.id ? (
                    <Button onClick={() => this.handleRemove()} color="danger" type="button" disabled={this.state.loading}>
                      {this.state.loading ? "Excluindo..." : "Excluir"}
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button color="success" type="submit" disabled={this.state.loading}>
                    {this.state.loading ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </ModalFooter>
          </form>
        </Modal>

        {/** modal lancamento CONTAS A PAGAR */}
        <Modal
          isOpen={this.state.modalOpenOut}
          toggle={this.toggleOut}
          className={this.props.className}
          fade
          onOpened={() => document.querySelector("#description").focus()}>
          <form onSubmit={this.toggleModalSave}>
            <div className="modal-header">
              <h5 className="modal-title h2">{this.state.id ? "Editar" : "Nova"} Conta à Pagar</h5>
              <Button className="close" color="" onClick={this.toggleOut}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              {this.state.id ? "Editar" : "Adicionar"} uma <mark className="display-4">Conta à Pagar</mark>
              <br />
              <br />
              <FormGroup>
                <Label for="description">Descrição *</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder=""
                  type="text"
                  required
                  value={this.state.description}
                  onChange={event => this.setState({ description: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="flow_category_id">Categoria *</Label>
                <Select
                  id="flow_category_id"
                  name="flow_category_id"
                  required
                  defaultValue={this.state.flow_category_id}
                  value={this.state.flow_category_id}
                  options={this.state.flow_categories}
                  styles={customStyles}
                  onChange={row => this.setState({ flow_category_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="date">Data *</Label>
                <Input
                  id="date"
                  required
                  name="date"
                  placeholder="01/01/2021"
                  type="date"
                  value={this.state.date}
                  onChange={event => this.setState({ date: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bank_account_id">Contas&Carteiras *</Label>
                <Select
                  id="filial_id"
                  name="filial_id"
                  required
                  defaultValue={this.state.bank_account_id}
                  value={this.state.bank_account_id}
                  options={this.state.bank_accounts}
                  styles={customStyles}
                  onChange={row => this.setState({ bank_account_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="value">Valor *</Label>
                <Input
                  id="value"
                  name="value"
                  placeholder="0,00"
                  type="text"
                  required
                  value={this.state.value}
                  onChange={event => this.setState({ value: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="user_id">Realizado por *</Label>
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
                <Label for="obs">Observações</Label>
                <Input id="obs" name="obs" placeholder="" type="text" value={this.state.obs} onChange={event => this.setState({ obs: event.target.value })} />
              </FormGroup>
              <FormGroup>
                <CustomInput
                  type="switch"
                  id="state"
                  name="state"
                  label="Pago?"
                  checked={this.state.state}
                  onChange={event => this.setState({ state: event.target.checked })}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" type="button" onClick={this.toggleOut}>
                Fechar
              </Button>

              {this.state.is_editable ? (
                <>
                  {this.state.id ? (
                    <Button onClick={() => this.handleRemove()} color="danger" type="button" disabled={this.state.loading}>
                      {this.state.loading ? "Excluindo..." : "Excluir"}
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button color="success" type="submit" disabled={this.state.loading}>
                    {this.state.loading ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </ModalFooter>
          </form>
        </Modal>

        {/** modal lancamento TRANSFERENCIA ENTRE CONTAS */}
        <Modal
          isOpen={this.state.modalOpenTransf}
          toggle={this.toggleTransf}
          className={this.props.className}
          fade
          onOpened={() => document.querySelector("#bank_account_id_out").focus()}>
          <form onSubmit={this.toggleModalSaveTransf}>
            <div className="modal-header">
              <h5 className="modal-title h2">{this.state.id ? "Editar" : "Nova"} Transferência entre Contas</h5>
              <Button className="close" color="" onClick={this.toggleTransf}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              Realizar uma <mark className="display-4">{this.state.id ? "Editar" : "Nova"} Transferência entre Contas</mark>
              <br />
              <br />
              <FormGroup>
                <Label for="bank_account_id_out">Saiu da Conta *</Label>
                <Select
                  id="bank_account_id_out"
                  name="bank_account_id_out"
                  required
                  defaultValue={this.state.bank_account_id_out}
                  value={this.state.bank_account_id_out}
                  options={this.state.bank_accounts}
                  styles={customStyles}
                  onChange={row => this.setState({ bank_account_id_out: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bank_account_id_in">Entrou na Conta *</Label>
                <Select
                  id="bank_account_id_in"
                  name="bank_account_id_in"
                  required
                  defaultValue={this.state.bank_account_id_in}
                  value={this.state.bank_account_id_in}
                  options={this.state.bank_accounts_in}
                  styles={customStyles}
                  onChange={row => this.setState({ bank_account_id_in: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Descrição *</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder=""
                  type="text"
                  required
                  value={this.state.description}
                  onChange={event => this.setState({ description: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="date">Data *</Label>
                <Input
                  id="date"
                  required
                  name="date"
                  placeholder="01/01/2021"
                  type="date"
                  value={this.state.date}
                  onChange={event => this.setState({ date: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="value">Valor *</Label>
                <Input
                  id="value"
                  name="value"
                  placeholder="0,00"
                  type="text"
                  required
                  value={this.state.value}
                  onChange={event => this.setState({ value: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="user_id">Registrado por *</Label>
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
                <Label for="obs">Observações</Label>
                <Input id="obs" name="obs" placeholder="" type="text" value={this.state.obs} onChange={event => this.setState({ obs: event.target.value })} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" type="button" onClick={this.toggleTransf}>
                Fechar
              </Button>

              {this.state.is_editable ? (
                <>
                  {this.state.id ? (
                    <Button onClick={() => this.handleRemove()} color="danger" type="button" disabled={this.state.loading}>
                      {this.state.loading ? "Excluindo..." : "Excluir"}
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button color="success" type="submit" disabled={this.state.loading}>
                    {this.state.loading ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </ModalFooter>
          </form>
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
