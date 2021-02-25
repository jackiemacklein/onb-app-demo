/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import { Link } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Row, Col, Input, Label, FormGroup } from "reactstrap";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import Cookies from "js-cookie";
import Select from "react-select";
import AsyncSelect from "react-select/async";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import api from "./../../../utils/api";
import { addToast as actionAddToast } from "../../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalNewClientOpen: false,
      modalEditOpen: false,
      modalPaymentOpen: false,

      inputValue: "",
      data: [],
      payment_methods: [],
      updateValues: false,
      cancelPassword: "",
      canceling: false,
      paying: false,
      payment_method_text: "",
      payment_method_id: "",
      coupon: "",
      item_edit_id: "",
      item_edit_name: "",
      item_edit_count: "",
      item_edit_stock: "",
      item_edit_value: "",
      item_edit_discount_amount: "",
      item_edit_discount_percentage: "",
      item_edit_maximum_discount: 0,
      item_edit_amount: "",
      item_edit_type: "",
      client_id: {},
      client_name: "",
      client_phone: "",
      client_cpf: "",
      client_email: "",

      loading: false,
    };

    this.loadData = this.loadData.bind(this);
    this.loadPaymentMethods = this.loadPaymentMethods.bind(this);
    this.getState = this.getState.bind(this);
    this.getColor = this.getColor.bind(this);
    this.handleAddProduct = this.handleAddProduct.bind(this);
    this.handleAddService = this.handleAddService.bind(this);
    this.handleCancelSaleCart = this.handleCancelSaleCart.bind(this);
    this.toggleModalCancelOpen = this.toggleModalCancelOpen.bind(this);
    this.toggleModalPaymentOpen = this.toggleModalPaymentOpen.bind(this);
    this.toggleModalEditOpen = this.toggleModalEditOpen.bind(this);
    this.handlePay = this.handlePay.bind(this);
    this.handleCloseSaleCart = this.handleCloseSaleCart.bind(this);
    this.handleChangeCountItem = this.handleChangeCountItem.bind(this);
    this.handleEditProductInSale = this.handleEditProductInSale.bind(this);
    this.handleRecalcValuesItem = this.handleRecalcValuesItem.bind(this);
    this.handleCalcDiscountByAmount = this.handleCalcDiscountByAmount.bind(this);
    this.handleCalcDiscountByPercent = this.handleCalcDiscountByPercent.bind(this);
    this.handleEditSaleCart = this.handleEditSaleCart.bind(this);
    this.handleEditServiceInSale = this.handleEditServiceInSale.bind(this);
    this.handleDeleteItemCart = this.handleDeleteItemCart.bind(this);
    this.filterClient = this.filterClient.bind(this);
    this.loadClients = this.loadClients.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.toggleModalNewClientOpen = this.toggleModalNewClientOpen.bind(this);
    this.handleSaveNewClient = this.handleSaveNewClient.bind(this);
  }

  toggleModalNewClientOpen() {
    this.setState(prevState => ({
      modalNewClientOpen: !prevState.modalNewClientOpen,
      client_name: "",
      client_cpf: "",
      client_phone: "",
    }));
  }

  async loadData() {
    try {
      const { data } = await api.get(`/new/sales/`);
      this.setState({ data });
    } catch (error) {
      console.log(error);
    }
  }

  async filterClient(inputValue, callback) {
    const { addToast, history } = this.props;

    if (inputValue != "") {
      if (inputValue.length >= 2) callback(await this.loadClients(inputValue));
      else addToast({ title: "Atenção!", content: "Digite ao menos 2 letras para pesquisar", time: new Date(), duration: 5000, color: "warning" });
    }
  }

  async loadClients(term) {
    const { addToast, history } = this.props;
    try {
      const { data } = await api.get(`/crm/clients/?term=${term}`);
      return data.map(d => {
        return { value: d.id, label: `${d.cpf ? `[${d.cpf}] - ` : d.phone ? `[${d.phone}] - ` : ""}${d.name}` };
      });
    } catch (error) {
      addToast({ title: "Erro!", content: "Ocorreu um erro ao buscar cliente", time: new Date(), duration: 12000, color: "danger" });
      console.log(error);
    }
  }

  handleInputChange(newValue) {
    const inputValue = newValue;
    this.setState({ inputValue });
    return inputValue;
  }

  async loadPaymentMethods() {
    try {
      const { data } = await api.get(`/payment_methods/`);
      this.setState({ payment_methods: data });
    } catch (error) {
      console.log(error);
    }
  }

  //funçoes responsaveis por adicionar items no carrinho
  handleAddProduct(id) {
    const pro = this.state.data.additionals.products.find(i => i.id === id);

    if (!pro) {
      alert("Erro desconhecido");
      return;
    }

    //verifica se tem o produto em estoque
    if (pro.stock <= 0) {
      alert("Estoque indisponível");
      return;
    }

    let productCount = 1;
    //verifica se o produto já está incluso na venda
    const exists = this.state.data.products.find(i => i.product_id === id);
    if (exists) {
      this.state.data.products.map(product => {
        if (product.product_id === id) {
          product.count = product.count + 1;
          if (product.discount_amount) product.amount = (product.unit_value - product.discount_amount) * product.count;
          else product.amount = product.unit_value * product.count;

          productCount = product.count;
        }
      });
    } else {
      this.state.data.products.push({
        amount: pro.sale_price,
        count: 1,
        discount_amount: null,
        discount_percentage: null,
        product_id: pro.id,
        sale_id: this.state.data.id,
        unit_value: pro.sale_price,
        product: pro,
      });
    }

    //atualiza o estoque virtual
    this.state.data.additionals.products.map(product => {
      if (!product.virtual_stock) product.virtual_stock = product.stock;
      if (product.id === id) product.stock = product.virtual_stock - productCount;
    });
    this.setState({ data: this.state.data });
    this.setState({ updateValues: !this.state.updateValues });
  }
  handleAddService(id) {
    const pro = this.state.data.additionals.services.find(i => i.id === id);

    if (!pro) {
      alert("Erro desconhecido");
      return;
    }

    let serviceCount = 1;
    //verifica se o servico já está incluso na venda
    const exists = this.state.data.services.find(i => i.service_id === id);
    if (exists) {
      this.state.data.services.map(service => {
        if (service.service_id === id) {
          service.count = service.count + 1;
          if (service.discount_amount) service.amount = (service.unit_value - service.discount_amount) * service.count;
          else service.amount = service.unit_value * service.count;

          serviceCount = service.count;
        }
      });
    } else {
      this.state.data.services.push({
        amount: pro.value.price,
        count: 1,
        discount_amount: null,
        discount_percentage: null,
        service_id: pro.id,
        sale_id: this.state.data.id,
        unit_value: pro.value.price,
        service: pro,
      });
    }

    this.setState({ data: this.state.data });
    this.setState({ updateValues: !this.state.updateValues });
  }

  //responsavel por enviar o cancelamento da venda
  /* cancel/save sale */
  async handleCancelSaleCart() {
    const { addToast, history } = this.props;

    if (!this.state.cancelPassword) {
      this.toggleModalCancelOpen();
      addToast({ title: "Digite a Senha", content: "Por favor, informe sua senha de acesso.", time: new Date(), duration: 12000, color: "warning" });
      return false;
    }

    this.setState({ canceling: true });

    try {
      await api.post(`/sale/cancel/${this.state.data.id}`, { password: this.state.cancelPassword });
      addToast({ title: "Sucesso!", content: "Venda/Serviço Cancelada(o) com sucesso.", time: new Date(), duration: 12000, color: "success" });

      history.push("/pdv/app");
    } catch (error) {
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            addToast({
              title: "Acesso Negado!",
              content: "Desculpe, não foi possivel cancelar a(o) venda/servico!",
              time: new Date(),
              duration: 12000,
              color: "warning",
            });
          }
        }
      } else {
        addToast({ title: "Erro desconhecido!", content: "Desculpe, Tente novamente", time: new Date(), duration: 12000, color: "error" });
      }
      this.setState({ cancelPassword: "", canceling: false });
      this.toggleModalCancelOpen();
    }
  }
  //funcao responsavel por fechar a venda
  async handleCloseSaleCart() {
    const { addToast, history } = this.props;

    const pack = {
      client_id: this.state.client_id.value ?? "",
      value: this.state.data.amount,
      amount: this.state.data.amount,
      discount_amount: this.state.data.discount_amount,
      discount_percentage: this.state.data.discount_percentage,
      origin: this.state.data.origin,
      payment_method_id: this.state.payment_method_id,
      state: "closed",
      coupon: this.state.coupon,
      services: this.state.data.services.filter(p => p.count > 0),
      products: this.state.data.products.filter(p => p.count > 0),
    };

    if (pack.services.length > 0 || pack.products.length > 0) {
      this.setState({ paying: true });
      try {
        await api.post(`/new/sales/`, pack);
        addToast({ title: "Pagamento Realizado", content: "O Pagamento foi realizado com sucesso", time: new Date(), duration: 12000, color: "success" });

        history.push("/pdv/app");
      } catch (error) {
        console.log(error);
        addToast({ title: "Erro!", content: "Tente novamente, erro ao efetuar pagamento", time: new Date(), duration: 15000, color: "error" });
        this.toggleModalPaymentOpen();
      }
      this.setState({ paying: false, coupon: "" });
    } else {
      this.toggleModalPaymentOpen();
      addToast({
        title: "Carrinho Vazio",
        content: "Por favor, adicione ao menos um serviço ou produto para eftuar o Pagamento.",
        time: new Date(),
        duration: 12000,
        color: "warning",
      });
      return false;
    }
  }

  async handlePay(pay_id, pay_text) {
    this.setState({ payment_method_text: pay_text, payment_method_id: pay_id });

    this.toggleModalPaymentOpen();
  }

  async handleChangeCountItem(count) {
    count = parseInt(count);
    if (count > 0) {
      if (count > this.state.item_edit_stock) {
        this.setState({ item_edit_count: this.state.item_edit_stock });

        alert(`${this.state.item_edit_stock} é quantidade máxima em estoque`);

        const newAmount = (this.state.item_edit_value - this.state.item_edit_discount_amount) * this.state.item_edit_stock;
        this.setState({ item_edit_amount: newAmount });
      } else {
        const newAmount = (this.state.item_edit_value - this.state.item_edit_discount_amount) * count;
        this.setState({ item_edit_amount: newAmount, item_edit_count: count });
      }
    } else {
      this.setState({ item_edit_count: 1 });
      const newAmount = (this.state.item_edit_value - this.state.item_edit_discount_amount) * 1;
      this.setState({ item_edit_amount: newAmount });
    }
  }

  async handleRecalcValuesItem() {
    if (this.state.item_edit_count > 0) {
      if (this.state.item_edit_count > this.state.item_edit_stock) {
        this.setState({ item_edit_count: this.state.item_edit_stock });

        alert(`${this.state.item_edit_stock} é quantidade máxima em estoque`);

        const newAmount = (this.state.item_edit_value - this.state.item_edit_discount_amount) * this.state.item_edit_stock;
        this.setState({ item_edit_amount: newAmount });
      } else {
        const newAmount = (this.state.item_edit_value - this.state.item_edit_discount_amount) * this.state.item_edit_count;
        this.setState({ item_edit_amount: newAmount, item_edit_count: this.state.item_edit_count });
      }
    } else {
      this.setState({ item_edit_count: 1 });
      const newAmount = (this.state.item_edit_value - this.state.item_edit_discount_amount) * 1;
      this.setState({ item_edit_amount: newAmount });
    }
  }

  async handleEditProductInSale(id) {
    this.setState({ item_edit_type: "products" });

    this.state.data.products.map(item => {
      if (item.product_id === id) {
        let product = this.state.data.additionals.products.find(i => i.id === item.product_id);
        if (product.virtual_stock) product.virtual_stock = product.virtual_stock;
        else product.virtual_stock = product.stock - item.count;

        this.setState({ item_edit_id: item.product_id });
        this.setState({ item_edit_name: `${item.product.name} (R$ ${item.unit_value?.toLocaleString()})` });
        this.setState({ item_edit_count: item.count });
        this.setState({ item_edit_stock: product.virtual_stock });
        this.setState({ item_edit_value: item.unit_value });
        this.setState({ item_edit_discount_amount: item.discount_amount ?? 0 });
        this.setState({ item_edit_discount_percentage: item.discount_percentage ?? 0 });
        this.setState({ item_edit_maximum_discount: item.product.maximum_discount ?? 0 });
        this.setState({ item_edit_amount: item.amount });
      }
    });

    this.toggleModalEditOpen();
  }
  async handleEditServiceInSale(id) {
    this.setState({ item_edit_type: "services" });
    this.state.data.services.map(item => {
      if (item.service_id === id) {
        this.setState({ item_edit_id: item.service_id });
        this.setState({ item_edit_name: `${item.service.name} (R$ ${item.unit_value?.toLocaleString()})` });
        this.setState({ item_edit_count: item.count });
        this.setState({ item_edit_stock: 10000000 });
        this.setState({ item_edit_value: item.unit_value });
        this.setState({ item_edit_discount_amount: item.discount_amount ?? 0 });
        this.setState({ item_edit_discount_percentage: item.discount_percentage ?? 0 });
        this.setState({ item_edit_maximum_discount: 100 });
        this.setState({ item_edit_amount: item.amount });
      }
    });

    this.toggleModalEditOpen();
  }

  async handleCalcDiscountByAmount(value) {
    const percent = (parseFloat(value) * 100) / this.state.item_edit_value;
    this.setState({ item_edit_discount_percentage: percent, item_edit_discount_amount: value });

    this.handleRecalcValuesItem();
  }
  async handleCalcDiscountByPercent(value) {
    const discont = (value / 100) * this.state.item_edit_value;
    await this.setState({ item_edit_discount_amount: discont, item_edit_discount_percentage: value });

    this.handleRecalcValuesItem();
  }

  async handleEditSaleCart() {
    if (this.state.item_edit_maximum_discount === 0 && this.state.item_edit_discount_percentage > 0) {
      alert(`Não é permitido aplicar descontos nesse produto`);
      this.handleCalcDiscountByPercent(0);
    } else {
      if (this.state.item_edit_discount_percentage > this.state.item_edit_maximum_discount) {
        alert(`A porcentagem máxima de desconto é de: ${this.state.item_edit_maximum_discount?.toLocaleString()}%`);

        this.setState({ item_edit_discount_percentage: this.state.item_edit_maximum_discount });
        this.handleCalcDiscountByPercent(this.state.item_edit_maximum_discount);
      } else {
        if (this.state.item_edit_type === "products") {
          this.state.data.products.map((item, index) => {
            if (item.product_id === this.state.item_edit_id) {
              let virtualStock = this.state.data.additionals.products.find(i => i.id === item.product_id);
              if (virtualStock.virtual_stock) virtualStock = virtualStock.virtual_stock;
              else virtualStock = virtualStock.stock;

              this.state.data.products[index] = {
                ...item,
                count: this.state.item_edit_count,
                amount: this.state.item_edit_amount,
                discount_amount: this.state.item_edit_discount_amount,
                discount_percentage: this.state.item_edit_discount_percentage,
                //maximum_discount: itemEditMaximum_discount,
                stock: virtualStock - this.state.item_edit_count,
              };
            }
          });

          this.state.data.additionals.products.map(product => {
            if (!product.virtual_stock) product.virtual_stock = product.stock;
            if (product.id === this.state.item_edit_id) {
              product.stock = product.virtual_stock - this.state.item_edit_count;
            }
          });

          this.setState({ data: this.state.data });
        } else if (this.state.item_edit_type === "services") {
          this.state.data.services.map((item, index) => {
            if (item.service_id === this.state.item_edit_id) {
              this.state.data.services[index] = {
                ...item,
                count: this.state.item_edit_count,
                amount: this.state.item_edit_amount,
                discount_amount: this.state.item_edit_discount_amount,
                discount_percentage: this.state.item_edit_discount_percentage,
                // maximum_discount: itemEditMaximum_discount,
              };
            }

            this.setState({ data: this.state.data });
          });
        }
        this.setState({ updateValues: !this.state.updateValues });
        this.toggleModalEditOpen();
      }
    }
  }

  /* handle delete an item from the cart */
  async handleDeleteItemCart() {
    const { addToast } = this.props;

    if (this.state.item_edit_type === "products") {
      this.state.data.additionals.products.map(product => {
        if (!product.virtual_stock) product.virtual_stock = product.stock;
        if (product.id === this.state.item_edit_id) {
          product.stock = product.virtual_stock;
        }
      });

      const news = this.state.data.products.filter(item => item.product_id !== this.state.item_edit_id);

      this.state.data.products = news;

      this.setState({ data: this.state.data });
    } else if (this.state.item_edit_type === "services") {
      const news = this.state.data.services.filter(item => item.service_id !== this.state.item_edit_id);

      this.state.data.services = news;

      this.setState({ data: this.state.data });
    }
    addToast({
      title: "Sucesso",
      content: "O item foi removido com sucesso",
      time: new Date(),
      duration: 12000,
      color: "success",
    });

    this.toggleModalEditOpen();
    this.setState({ updateValues: !this.state.updateValues });
  }

  async handleSaveNewClient(event) {
    event.preventDefault();
    const { addToast } = this.props;

    if (!this.state.client_name) {
      alert("Informe o nome do Cliente");
      return false;
    }

    this.setState({ loading: true });

    try {
      const { data } = await api.post(`/crm/clients`, {
        profile_id: 5,
        cpf: this.state.client_cpf,
        name: this.state.client_name ?? "-",
        phone: this.state.client_phone,
        email: this.state.client_email,
        is_active: true,
      });

      if (data) {
        this.setState({ client_id: { value: data.id, label: `${data.cpf ? `[${data.cpf}] - ` : data.phone ? `[${data.phone}] - ` : ""}${data.name}` } });
      }

      this.toggleModalNewClientOpen();
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        if (error.response.data.data)
          this.setState({
            client_id: {
              value: error.response.data.data.id,
              label: `${
                error.response.data.data.cpf
                  ? `[${error.response.data.data.cpf}] - `
                  : error.response.data.data.phone
                  ? `[${error.response.data.data.phone}] - `
                  : ""
              }${error.response.data.data.name}`,
            },
          });
        else alert("Desculpe, não foi possivel salvar o cliente");
      } else alert("Desculpe, não foi possivel salvar o cliente");

      console.log(error);
    }

    this.setState({ loading: false });
  }

  getState(state) {
    switch (state) {
      case "open":
        return "Aberta";
        break;
      case "closed":
        return "Fechada";
        break;
      case "canceled":
        return "Cancelada";
        break;
    }
  }

  getColor(state) {
    switch (state) {
      case "open":
        return "warning";
        break;
      case "closed":
        return "success";
        break;
      case "canceled":
        return "danger";
        break;
    }
  }

  toggleModalCancelOpen() {
    this.setState(prevState => ({
      modalCancelOpen: !prevState.modalCancelOpen,
    }));
  }

  toggleModalPaymentOpen() {
    this.setState(prevState => ({
      modalPaymentOpen: !prevState.modalPaymentOpen,
    }));
  }

  toggleModalEditOpen() {
    this.setState(prevState => ({
      modalEditOpen: !prevState.modalEditOpen,
    }));
  }

  componentDidMount() {
    this.loadData();
    this.loadPaymentMethods();
  }

  componentDidUpdate(prevProps, prevState) {
    let totalValue = 0;

    if (prevState.updateValues !== this.state.updateValues) {
      this.state.data.products.map(item => {
        if (item.count > 0) {
          totalValue = totalValue + item.amount;
        }
      });

      this.state.data.services.map(item => {
        if (item.count > 0) {
          totalValue = totalValue + item.amount;
        }
      });

      this.setState({ data: { ...this.state.data, amount: totalValue } });
    }
  }

  render() {
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
        <div className="row vertical-gap">
          <div className="col-lg-4 order-lg-12 rui-task-sidebar order-1">
            <div className="card card-border-effect-kie">
              <div className="card-body py-30">
                <ul className="list-group list-group-flush rui-task-sidebar-list">
                  <li className="list-group-item">
                    <ul className="list-unstyled rui-task-info-list">
                      {this.state.data?.services?.map(item => (
                        <li key={item.id}>
                          <div className="rui-task-info-item">
                            <Icon name="edit" className="mr-5" onClick={() => this.handleEditServiceInSale(item.service.id)} />
                            <span>
                              <strong>x{item.count}</strong> -
                            </span>
                            <span className="list-items-sale">{item.service.name}</span>
                            <h6 className="h6 rui-task-sidebar-title text-right mb-0 mt-0">
                              <strong>R$ {item.amount.toLocaleString()}</strong>
                            </h6>
                          </div>
                        </li>
                      ))}

                      {this.state.data?.products?.map(item => (
                        <li key={item.product.id}>
                          <div className="rui-task-info-item">
                            <Icon name="edit" className="mr-5" onClick={() => this.handleEditProductInSale(item.product.id)} />
                            <span>
                              <strong>x{item.count}</strong> -
                            </span>
                            <span className="list-items-sale">{item.product.name}</span>
                            <h6 className="h6 rui-task-sidebar-title text-right mb-0 mt-0">
                              <strong>R$ {item.amount.toLocaleString()}</strong>
                            </h6>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="list-group-item">
                    <h5 className="h4 rui-task-sidebar-title text-right mb-0 mt-0">
                      <strong>R$ {this.state.data?.amount?.toLocaleString()}</strong>
                    </h5>
                  </li>
                  <li className="list-group-item">
                    <h5 className="h4 rui-task-sidebar-title">Forma de Pagamento</h5>
                    <ul className="list-unstyled rui-task-project-list payment-types">
                      {this.state.payment_methods.map(item => (
                        <li key={item.id} className="payment-type">
                          <Button block className="btn-hover-outline text-center" color={item.color} onClick={() => this.handlePay(item.id, item.name)}>
                            {item.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-8 order-lg-0 order-0">
            <div className="bill-filters">
              <Row>
                <Col xs={12} sm={8} md={8} className="mb-5">
                  <Label for="filter_type">DIGITE P/ PESQUISAR O CLIENTE</Label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={this.filterClient}
                    defaultOptions
                    onInputChange={this.handleInputChange}
                    id="filter_type"
                    name="filter_type"
                    styles={customStyles}
                    defaultValue={this.state.client_id}
                    value={this.state.client_id}
                    onChange={row => this.setState({ client_id: row })}
                  />
                </Col>
                <Col className="mb-5">
                  <Label for="filter_type">NÃO LOCALIZOU?</Label>
                  <Button xs={12} sm={2} md={2} block className="btn-hover-outline text-center" color="brand" onClick={() => this.toggleModalNewClientOpen()}>
                    NOVO CLIENTE
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="rui-task-comment p-0">
              <div className="rui-task-comment-text mt-0">
                <Row className="xs-gap p-0 flex-wrap">
                  {this.state.data?.additionals?.products.map(item => (
                    <Col xs={12} sm={12} md={6} lg={4} className="mb-10" key={item.id}>
                      <Card>
                        <CardImg
                          alt=""
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADICAYAAACZBDirAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKNSURBVHgB7dQBEQAQAAAx9O/nnDAE+S3E5j73DYCgNQCiBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBrA+NWgUa6x769AAAAABJRU5ErkJggg=="
                          top
                        />
                        <CardBody className="card-body pt-10 pb-10 pl-15 pr-15">
                          <CardTitle className="h2">{item.name}</CardTitle>
                          <CardText>
                            R$ {item.sale_price.toLocaleString()} <mark>{item.stock}</mark>
                          </CardText>
                          <Button color="brand" onClick={() => this.handleAddProduct(item.id)}>
                            Adicionar
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                  {this.state.data?.additionals?.services.map(item => (
                    <Col xs={12} sm={12} md={6} lg={4} className="mb-10" key={item.id}>
                      <Card>
                        <CardImg
                          alt=""
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADICAYAAACZBDirAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKNSURBVHgB7dQBEQAQAAAx9O/nnDAE+S3E5j73DYCgNQCiBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBrA+NWgUa6x769AAAAABJRU5ErkJggg=="
                          top
                        />
                        <CardBody className="card-body pt-10 pb-10 pl-15 pr-15">
                          <CardTitle className="h2">{item.name}</CardTitle>
                          <CardText>R$ {item.value.price.toLocaleString()}</CardText>
                          <Button color="brand" onClick={() => this.handleAddService(item.id)}>
                            Adicionar
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </div>

        {/** model que confirma o pagamento */}
        <Modal isOpen={this.state.modalPaymentOpen} toggle={this.toggleModalPaymentOpen} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Confirmação de Pagamento</h5>
            <Button className="close" color="" onClick={this.toggleModalPaymentOpen}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            Confirma o pagamento no <mark className="display-4">{this.state.payment_method_text}</mark> no valor de R${" "}
            <mark className="display-4">{this.state.data?.amount?.toLocaleString()}</mark> ?<br />
            <br />
            <FormGroup>
              <Label for="coupon">Cupom Fiscal</Label>
              <Input
                id="coupon"
                name="coupon"
                placeholder="45654566"
                type="text"
                value={this.state.coupon}
                onChange={event => this.setState({ coupon: event.target.value })}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalPaymentOpen}>
              Fechar
            </Button>{" "}
            <Button color="success" onClick={this.handleCloseSaleCart} disabled={this.state.paying}>
              {this.state.paying ? "Efetuando Pagamento..." : "Confirmar"}
            </Button>
          </ModalFooter>
        </Modal>

        {/** modal que edita os items na venda */}
        <Modal isOpen={this.state.modalEditOpen} toggle={this.toggleModalEditOpen} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Editar Item</h5>
            <Button className="close" color="" onClick={this.toggleModalEditOpen}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            Editar item <mark className="display-4">{this.state.item_edit_name}</mark>
            <br />
            <br />
            <FormGroup>
              <Label for="count">Quantidade</Label>
              <Input
                id="count"
                name="count"
                placeholder="count"
                type="number"
                min={1}
                max={this.state.item_edit_stock}
                value={this.state.item_edit_count}
                onChange={event => this.handleChangeCountItem(event.target.value)}
                onKeyUp={event => this.handleChangeCountItem(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="discount_amount">R$ de Desconto</Label>
              <Input
                id="discount_amount"
                name="discount_amount"
                placeholder="0,00"
                type="text"
                value={this.state.item_edit_discount_amount}
                onChange={event => this.handleCalcDiscountByAmount(event.target.value)}
                onKeyUp={event => this.handleCalcDiscountByAmount(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="item_edit_discount_percentage">% de Desconto</Label>
              <Input
                id="item_edit_discount_percentage"
                name="item_edit_discount_percentage"
                placeholder="0,00"
                type="text"
                value={this.state.item_edit_discount_percentage}
                onChange={event => this.handleCalcDiscountByPercent(event.target.value)}
                onKeyUp={event => this.handleCalcDiscountByPercent(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="item_edit_amount">R$ Total</Label>
              <Input id="item_edit_amount" name="item_edit_amount" placeholder="0,00" type="text" value={this.state.item_edit_amount} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalEditOpen}>
              Fechar
            </Button>{" "}
            <Button color="danger" onClick={this.handleDeleteItemCart}>
              Excluir da Venda
            </Button>{" "}
            <Button color="success" onClick={this.handleEditSaleCart}>
              Alterar
            </Button>
          </ModalFooter>
        </Modal>

        {/** modal adiciona cliente */}
        <Modal isOpen={this.state.modalNewClientOpen} toggle={this.toggleModalNewClientOpen} className={this.props.className} fade>
          <form onSubmit={this.handleSaveNewClient}>
            <div className="modal-header">
              <h5 className="modal-title h2">Novo Cliente</h5>
              <Button className="close" color="" onClick={this.toggleModalNewClientOpen}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              <FormGroup>
                <Label for="client_name">Nome *</Label>
                <Input
                  required
                  id="client_name"
                  name="client_name"
                  placeholder="Nome Completo"
                  type="text"
                  value={this.state.client_name}
                  onChange={event => this.setState({ client_name: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="client_cpf">CPF</Label>
                <Input
                  id="client_cpf"
                  name="client_cpf"
                  placeholder=""
                  type="text"
                  value={this.state.client_cpf}
                  onChange={event => this.setState({ client_cpf: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="client_phone">Telefone</Label>
                <Input
                  id="client_phone"
                  name="client_phone"
                  placeholder="(99) 9 9999-9999"
                  type="text"
                  value={this.state.client_phone}
                  onChange={event => this.setState({ client_phone: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="client_email">E-mail</Label>
                <Input
                  id="client_email"
                  name="client_email"
                  placeholder=""
                  type="email"
                  value={this.state.client_email}
                  onChange={event => this.setState({ client_email: event.target.value })}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" type="button" onClick={this.toggleModalNewClientOpen}>
                Cancelar
              </Button>{" "}
              <Button color="success" disabled={this.state.loading}>
                {this.state.loading ? "Salvando..." : "Salvar"}
              </Button>
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
  },
)(withRouter(Content));
