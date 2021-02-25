/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, CustomInput, FormGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";
import { withRouter } from "react-router-dom";

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
      credit_card_flag_id: "",
      name: "",
      limit: 0,
      closing_day: "",
      expiration_day: "",
      is_active: true,

      loading: false,
      filiais: [],
      flags: [],
    };

    this.save = this.save.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadFlags = this.loadFlags.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.put(`/credit-cards/${this.state.id}`, {
        filial_id: this.state.filial_id.value,
        credit_card_flag_id: this.state.credit_card_flag_id.value,
        name: this.state.name,
        limit: this.state.limit,
        closing_day: this.state.closing_day,
        expiration_day: this.state.expiration_day,
        is_active: this.state.is_active,
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

  async loadFlags() {
    const { data } = await api.get("/credit-cards/flags");
    this.setState({
      flags: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  async loadData() {
    const { id } = this.props.match.params;

    const { data } = await api.get(`/credit-cards/${id}`);

    this.setState({
      id: data.id,
      filial_id: { value: data.filial.id, label: data.filial.name },
      credit_card_flag_id: { value: data.credit_card_flag.id, label: data.credit_card_flag.name },
      name: data.name,
      limit: data.limit,
      closing_day: data.closing_day,
      expiration_day: data.expiration_day,
      is_active: data.is_active,
    });
  }

  componentDidMount() {
    this.loadFiliais();
    this.loadFlags();
    this.loadData();
  }

  render() {
    const { flags, filiais, loading } = this.state;

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
        <h2 id="formsBase">Informações de seu Cartão</h2>
        <form className="rui-snippet-preview demo form-border-effect-kie" onSubmit={this.save}>
          <FormGroup>
            <Label for="filial_id">Filial *</Label>
            <Select
              id="filial_id"
              name="filial_id"
              required
              defaultValue={this.state.filial_id}
              value={this.state.filial_id}
              options={filiais}
              styles={customStyles}
              onChange={row => this.setState({ filial_id: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="credit_card_flag_id">Bandeira / Instituição financeira *</Label>
            <Select
              id="credit_card_flag_id"
              name="credit_card_flag_id"
              required
              defaultValue={this.state.credit_card_flag_id}
              value={this.state.credit_card_flag_id}
              options={flags}
              styles={customStyles}
              onChange={row => this.setState({ credit_card_flag_id: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Nome do Cartão * [Informe um nome para identificar seu cartão.]</Label>
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
                <Label for="closing_day">Fecha dia *</Label>
                <Input
                  type="number"
                  name="closing_day"
                  id="closing_day"
                  placeholder=""
                  min={1}
                  max={31}
                  value={this.state.closing_day}
                  onChange={event => this.setState({ closing_day: event.target.value })}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label for="expiration_day">Vence dia *</Label>
                <Input
                  type="number"
                  name="expiration_day"
                  id="expiration_day"
                  placeholder=""
                  min={1}
                  max={31}
                  value={this.state.expiration_day}
                  onChange={event => this.setState({ expiration_day: event.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="limit">Limite *</Label>
            <Input
              type="text"
              name="limit"
              id="limit"
              placeholder="12.989,00"
              value={this.state.limit}
              onChange={event => this.setState({ limit: event.target.value })}
            />
          </FormGroup>

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
)(withRouter(Content));
