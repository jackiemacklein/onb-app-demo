/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, CustomInput, FormGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";

/**
 * Internal Dependencies
 */
import api from "./../../../../utils/api";
import Icon from "../../../../components/icon";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      filial_id: "",
      name: "",
      stock: 0,
      unit: { value: "Un", label: "Unidade" },
      cost_price: 0,
      sale_price: 0,
      is_active: true,
      maximum_discount: 0,
      sales_commission: 0,
      loading: false,
      filiais: [],
      units: [
        { value: "Un", label: "Unidade" },
        { value: "Ser.", label: "Serviço" },
        { value: "Pç.", label: "Peça" },
      ],
    };

    this.save = this.save.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.post("/products", {
        filial_id: this.state.filial_id.value,
        name: this.state.name,
        stock: this.state.stock,
        unit: this.state.unit.value,
        cost_price: this.state.cost_price,
        sale_price: this.state.sale_price,
        is_active: this.state.is_active,
        maximum_discount: this.state.maximum_discount,
        sales_commission: this.state.sales_commission,
      });

      addToast({
        title: "Sucesso!.",
        content: "O Item foi salvo com sucesso.",
        time: new Date(),
        duration: 10000,
        color: "success",
      });

      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      addToast({
        title: "Ocorreu um erro ao tentar salvar o item!.",
        content: "Consulte o log do navegador, ou contate o administrador.",
        time: new Date(),
        duration: 20000,
        color: "error",
      });
      this.setState({ loading: false });
    }
  }

  async loadFiliais() {
    const { data } = await api.get("/filiais");
    this.setState({
      filiais: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  componentDidMount() {
    this.loadFiliais();
  }

  render() {
    const { units, filiais, loading } = this.state;

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
        <h2 id="formsBase">Dados do Produto</h2>
        <form className="rui-snippet-preview demo form-border-effect-kie" onSubmit={this.save}>
          <FormGroup>
            <Label for="filial_id">Filial *</Label>
            <Select
              id="filial_id"
              name="filial_id"
              required
              defaultValue={this.state.filial_id}
              options={filiais}
              styles={customStyles}
              onChange={row => this.setState({ filial_id: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Nome *</Label>
            <Input
              type="text"
              name="name"
              required
              id="name"
              placeholder="Nome"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </FormGroup>

          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label for="unit">Vender Por *</Label>
                <Select
                  id="unit"
                  name="unit"
                  defaultValue={this.state.unit}
                  options={units}
                  required
                  styles={customStyles}
                  onChange={row => this.setState({ unit: row })}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label for="sales_commission">Comissão de Venda [R$]</Label>
                <Input
                  type="text"
                  name="sales_commission"
                  id="sales_commission"
                  placeholder="2,00"
                  value={this.state.sales_commission}
                  onChange={event => this.setState({ sales_commission: event.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label for="maximum_discount">Desconto Máximo [%]</Label>
                <Input
                  type="text"
                  name="maximum_discount"
                  id="maximum_discount"
                  placeholder="5,00%"
                  value={this.state.maximum_discount}
                  onChange={event => this.setState({ maximum_discount: event.target.value })}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label for="stock">Quantidade em Estoque</Label>
                <Input
                  type="number"
                  name="stock"
                  id="stock"
                  placeholder="2"
                  value={this.state.stock}
                  onChange={event => this.setState({ stock: event.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label for="cost_price">Valor de Custo [R$]</Label>
                <Input
                  type="text"
                  name="cost_price"
                  id="cost_price"
                  placeholder="0,00"
                  value={this.state.cost_price}
                  onChange={event => this.setState({ cost_price: event.target.value })}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label for="sale_price">Valor de Venda [R$]</Label>
                <Input
                  type="text"
                  name="sale_price"
                  required
                  id="sale_price"
                  placeholder="50,00"
                  value={this.state.sale_price}
                  onChange={event => this.setState({ sale_price: event.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <CustomInput
              type="switch"
              id="is_active"
              name="is_active"
              label="Ativo/Inativo"
              checked={this.state.is_active}
              onChange={event => this.setState({ is_active: event.target.checked })}
            />
          </FormGroup>
          <FormGroup className="text-right">
            <Button type="submit" color="brand" className="btn-long" disabled={loading}>
              <span className="text">{loading ? "Gravando..." : "Gravar"}</span>
              {loading ? (
                <></>
              ) : (
                <span className="icon">
                  <Icon name="check" />
                </span>
              )}
            </Button>
          </FormGroup>
        </form>
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
