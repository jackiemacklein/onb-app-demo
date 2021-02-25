/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { CustomInput, FormGroup, Button, Label, Input } from "reactstrap";
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
      bank_id: "",
      name: "",
      opening_balance: 0,
      description: "",
      is_active: true,
      default: false,

      loading: false,
      filiais: [],
      banks: [],
    };

    this.save = this.save.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadBanks = this.loadBanks.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.put(`/banks/accounts/${this.state.id}`, {
        filial_id: this.state.filial_id.value,
        bank_id: this.state.bank_id.value,
        name: this.state.name,
        opening_balance: this.state.opening_balance,
        description: this.state.description,
        is_active: this.state.is_active,
        default: this.state.default,
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
      if (error.response) {
        if (error.response.data && error.response.data.error === true) alert(error.response.data.more);
        else alert("Ocorreu um erro ao tentar salvar o item");
      } else alert("Ocorreu um erro ao tentar salvar o item");

      console.log(error);
      /*console.log(error);
      addToast({
        title: "Ocorreu um erro ao tentar salvar o item!.",
        content: "Consulte o log do navegador, ou contate o administrador.",
        time: new Date(),
        duration: 20000,
        color: "error",
      });*/
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

  async loadBanks() {
    const { data } = await api.get("/banks");
    this.setState({
      banks: data.map(d => {
        return { value: d.id, label: `${d.code} - ${d.name}` };
      }),
    });
  }

  async loadData() {
    const { id } = this.props.match.params;

    const { data } = await api.get(`/banks/accounts/${id}`);

    this.setState({
      id: data.id,
      filial_id: { value: data.filial.id, label: data.filial.name },
      bank_id: { value: data.bank.id, label: `${data.bank.code} - ${data.bank.name}` },
      name: data.name,
      opening_balance: data.opening_balance,
      description: data.description,
      is_active: data.is_active,
      default: data.default,
    });
  }

  componentDidMount() {
    this.loadFiliais();
    this.loadBanks();
    this.loadData();
  }

  render() {
    const { banks, filiais, loading } = this.state;

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
        <h2 id="formsBase">Dados da Conta</h2>
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
            <Label for="filial_id">Banco / Instituição financeira *</Label>
            <Select
              id="bank_id"
              name="bank_id"
              required
              defaultValue={this.state.bank_id}
              value={this.state.bank_id}
              options={banks}
              styles={customStyles}
              onChange={row => this.setState({ bank_id: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Nome da Conta *</Label>
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

          <FormGroup>
            <Label for="unit">Saldo inicial [Para saldo negativo, use o sinal de '-', antes do valor.]</Label>
            <Input
              type="text"
              name="opening_balance"
              id="opening_balance"
              placeholder="1.989,00"
              value={this.state.opening_balance}
              onChange={event => this.setState({ opening_balance: event.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Descrição</Label>
            <Input
              type="text"
              name="description"
              id="description"
              placeholder=""
              value={this.state.description}
              onChange={event => this.setState({ description: event.target.value })}
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
          <FormGroup>
            <CustomInput
              type="switch"
              id="default"
              name="default"
              label="Conta de Movimentacão Padrão/Conta Normal"
              checked={this.state.default}
              onChange={event => this.setState({ default: event.target.checked })}
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
