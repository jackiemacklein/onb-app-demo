/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Row, Col, Input, Label, FormGroup } from "reactstrap";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import AsyncSelect from "react-select/async";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import api from "./../../../utils/api";
import { format, parseISO } from "date-fns";
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

      data: {},
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
      item_edit_value: 0,
      item_edit_discount_amount: 0,
      item_edit_discount_percentage: 0,
      item_edit_maximum_discount: 0,
      item_edit_amount: 0,
      item_edit_type: 0,

      client_id: {},
      client_name: "",
      client_phone: "",
      client_cpf: "",
      client_email: "",

      loading: false,
    };

    this.loadData = this.loadData.bind(this);
    this.getState = this.getState.bind(this);
    this.getColor = this.getColor.bind(this);
    this.handleCancelSaleCart = this.handleCancelSaleCart.bind(this);
    this.toggleModalCancelOpen = this.toggleModalCancelOpen.bind(this);
    this.toggleModalEditOpen = this.toggleModalEditOpen.bind(this);

    this.handleEditProductInSale = this.handleEditProductInSale.bind(this);
    this.handleEditServiceInSale = this.handleEditServiceInSale.bind(this);
  }

  async loadData() {
    const { id } = this.props.match.params;
    try {
      const { data } = await api.get(`/sales/${id}`);
      this.setState({ data });
    } catch (error) {
      console.log(error);
    }
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

      this.loadData();
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

  async handleEditProductInSale(id) {
    this.setState({ item_edit_type: "products" });

    this.state.data.products.map(item => {
      if (item.product_id === id) {
        let product = this.state.data.additionals.products.find(i => i.id === item.product_id);
        if (product.virtual_stock) product.virtual_stock = product.virtual_stock;
        else product.virtual_stock = product.stock - item.count;

        this.setState({ item_edit_id: item.product_id });
        this.setState({ item_edit_name: `${item.product.name} (R$ ${item.unit_value.toFixed(2).toLocaleString()})` });
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

  toggleModalEditOpen() {
    this.setState(prevState => ({
      modalEditOpen: !prevState.modalEditOpen,
    }));
  }

  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps, prevState) {}

  render() {
    return (
      <Fragment>
        <div className="row vertical-gap">
          <div className="col-lg-6 order-lg-12 rui-task-sidebar order-1">
            <div className="card card-border-effect-kie">
              <div className="card-body py-30">
                <ul className="list-group list-group-flush rui-task-sidebar-list">
                  <li className="list-group-item">
                    <ul className="list-unstyled rui-task-info-list">
                      {this.state.data?.services?.map(item => (
                        <li key={item.id} onClick={() => this.handleEditServiceInSale(item.service.id)}>
                          <div className="rui-task-info-item">
                            <Icon name="eye" className="mr-5" />
                            <h6 className="h6 rui-task-sidebar-title text-right mb-0 mt-0">
                              <strong>x{item.count}</strong> -
                            </h6>
                            <span className="list-items-sale">{item.service.name}</span>
                            <h6 className="h6 rui-task-sidebar-title text-right mb-0 mt-0">
                              <strong>R$ {item.amount?.toFixed(2).toLocaleString()}</strong>
                            </h6>
                          </div>
                        </li>
                      ))}

                      {this.state.data?.products?.map(item => (
                        <li key={item.product.id} onClick={() => this.handleEditProductInSale(item.product.id)}>
                          <div className="rui-task-info-item">
                            <Icon name="eye" className="mr-5" />

                            <h6 className="h6 rui-task-sidebar-title text-right mb-0 mt-0">
                              <strong>x{item.count}</strong> -
                            </h6>
                            <span className="list-items-sale">{item.product.name}</span>
                            <h6 className="h6 rui-task-sidebar-title text-right mb-0 mt-0">
                              <strong>R$ {item.amount?.toFixed(2).toLocaleString()}</strong>
                            </h6>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="list-group-item">
                    <h5 className="h4 rui-task-sidebar-title text-right mb-0 mt-0">
                      <strong>R$ {this.state.data?.amount?.toFixed(2).toLocaleString()}</strong>
                    </h5>
                  </li>
                  <li className="list-group-item">
                    <h5 className="h4 rui-task-sidebar-title">Pago através:</h5>
                    <ul className="list-unstyled rui-task-project-list payment-types payment-by">
                      <li className="payment-type" style={{ flex: 1 }}>
                        <Button block className="btn-hover-outline text-center" color={this.state?.data?.payment_method?.color}>
                          {this.state?.data?.payment_method?.name}
                        </Button>
                      </li>
                      {this.state.data.state !== "canceled" ? (
                        <>
                          <li className="payment-type" style={{ flex: 1 }}>
                            <Button block className="btn-hover-outline text-center" color="light" onClick={this.toggleModalCancelOpen}>
                              Cancelar
                            </Button>
                          </li>
                        </>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6 order-lg-0 order-0">
            <div className="rui-task-comment">
              <div className="media media-show">
                <div className={`rui-task-status rui-task-status-${this.getColor(this.state.data.state)}`}>
                  <div className="row vertical-gap align-items-center sm-gap">
                    <div className="col-auto">
                      <div className="rui-task-status-item">
                        <div className="rui-task-status-item-icon">
                          <Icon name="check-circle" />
                        </div>
                        {this.state.data.state === "closed" ? (
                          <>
                            Fechada em <mark>{this.state.data.closed_at ? format(parseISO(this.state.data.closed_at), "dd'/'MM'/'yyyy HH':'mm") : ""}</mark>
                          </>
                        ) : (
                          <>
                            {this.state.data.state === "canceled" ? (
                              <>
                                Cancelada em{" "}
                                <mark>{this.state.data.canceled_at ? format(parseISO(this.state.data.canceled_at), "dd'/'MM'/'yyyy HH':'mm") : ""}</mark>
                              </>
                            ) : (
                              <>
                                {this.getState(this.state.data.state)} em{" "}
                                <mark>{this.state.data.date ? format(parseISO(this.state.data.date), "dd'/'MM'/'yyyy HH':'mm") : ""}</mark>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <span className="media-link sale-details">
                  <span className="media-body">
                    <span className="media-title">
                      Aberta por:{" "}
                      <mark>
                        <strong>{this.state.data?.user?.name}</strong>
                      </mark>
                    </span>
                    {this.state.data.state === "closed" ? (
                      <>
                        <span className="media-title">
                          Fechada por:{" "}
                          <mark>
                            <strong>{this.state.data?.closed_by?.name}</strong>
                          </mark>
                        </span>
                      </>
                    ) : (
                      <>
                        {this.state.data.state === "canceled" ? (
                          <>
                            <span className="media-title">
                              Cancelada por:{" "}
                              <mark>
                                <strong>{this.state.data?.canceled_by?.name}</strong>
                              </mark>
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                    <small className="media-title">
                      Cliente:{" "}
                      <mark>
                        {this.state.data.client_id ? (
                          <>
                            <Link to={`/crm/clientes/show/${this.state.data.client_id}`} target="_blank">
                              <strong>{this.state?.data?.client?.name ?? this.state?.data?.client_name}</strong>
                            </Link>
                          </>
                        ) : (
                          <>
                            <strong>{this.state?.data?.client?.name ?? this.state?.data?.client_name}</strong>
                          </>
                        )}
                      </mark>
                    </small>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/** model que solicita a senha para cancelamento */}
        <Modal isOpen={this.state.modalCancelOpen} toggle={this.toggleModalCancelOpen} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Cancelar Venda/Serviço</h5>
            <Button className="close" color="" onClick={this.toggleModalCancelOpen}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            Tem Certeza que deseja cancelar a venda #{this.state.data.id}? <mark>Todos os lançamentos e o fluxo de caixa serão impactados.</mark>
            <br />
            <FormGroup>
              <Label for="password">Senha</Label>
              <Input
                id="password"
                name="password"
                placeholder="***"
                type="password"
                value={this.state.cancelPassword}
                onChange={event => this.setState({ cancelPassword: event.target.value })}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalCancelOpen}>
              Fechar
            </Button>{" "}
            <Button color="brand" onClick={this.handleCancelSaleCart} disabled={this.state.canceling}>
              {this.state.canceling ? "Cancelando..." : "Cancelar"}
            </Button>
          </ModalFooter>
        </Modal>

        {/** modal que edita os items na venda */}
        <Modal isOpen={this.state.modalEditOpen} toggle={this.toggleModalEditOpen} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Item da Venda/Serviço</h5>
            <Button className="close" color="" onClick={this.toggleModalEditOpen}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>
            <mark className="display-4">{this.state.item_edit_name}</mark>
            <br />
            <br />
            <FormGroup>
              <Label for="count">Quantidade</Label>
              <Input id="count" name="count" placeholder="count" type="number" disabled readOnly value={this.state.item_edit_count} />
            </FormGroup>
            <FormGroup>
              <Label for="discount_amount">R$ de Desconto</Label>
              <Input
                id="discount_amount"
                name="discount_amount"
                placeholder="0,00"
                type="text"
                disabled
                readOnly
                value={this.state.item_edit_discount_amount.toFixed(2).toLocaleString()}
              />
            </FormGroup>
            <FormGroup>
              <Label for="item_edit_discount_percentage">% de Desconto</Label>
              <Input
                id="item_edit_discount_percentage"
                name="item_edit_discount_percentage"
                placeholder="0,00"
                type="text"
                disabled
                readOnly
                value={this.state.item_edit_discount_percentage.toFixed(2).toLocaleString()}
              />
            </FormGroup>
            <FormGroup>
              <Label for="item_edit_amount">R$ Total</Label>
              <Input
                id="item_edit_amount"
                disabled
                readOnly
                name="item_edit_amount"
                placeholder="0,00"
                type="text"
                value={this.state.item_edit_amount.toFixed(2).toLocaleString()}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalEditOpen}>
              Fechar
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
  },
)(withRouter(Content));
