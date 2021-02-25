/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { CustomInput, FormGroup, Button, Label, Input } from "reactstrap";
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
      name: "",
      email: "",
      method_login: { value: "cpf", label: "CPF" },
      password: "",
      profile_id: "",
      filial_id: "",
      is_active: true,
      sales_commission: 0,
      sales_cancel: false,
      selected_modules: [],
      selected_spaces: [],
      loading: false,
      filiais: [],
      profiles: [],
      modules: [],
      spaces: [],
      methods_login: [
        { value: "cpf", label: "CPF" },
        { value: "email", label: "E-mail" },
        { value: "user", label: "Usuário" },
      ],
    };

    this.save = this.save.bind(this);
    this.loadProfile = this.loadProfile.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadModules = this.loadModules.bind(this);
    this.loadSpaces = this.loadSpaces.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.post("/users", {
        name: this.state.name,
        email: this.state.email,
        method_login: this.state.method_login.value,
        password: this.state.password,
        profile_id: this.state.profile_id,
        filial_id: this.state.filial_id,
        is_active: this.state.is_active,
        sales_commission: this.state.sales_commission,
        sales_cancel: this.state.sales_cancel,
        modules: this.state.selected_modules.map(m => m.value),
        spaces: this.state.selected_spaces.map(m => m.value),
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

  async loadProfile() {
    const { data } = await api.get("/profiles");
    this.setState({
      profiles: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  async loadFiliais() {
    const { data } = await api.get("/filiais");
    this.setState({
      filiais: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  async loadSpaces() {
    const { data } = await api.get("/spaces");
    this.setState({
      spaces: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  async loadModules() {
    const { data } = await api.get("/modules");
    this.setState({
      modules: data.map(d => {
        return { value: d.id, label: d.title };
      }),
    });
  }

  componentDidMount() {
    this.loadProfile();
    this.loadFiliais();
    this.loadModules();
    this.loadSpaces();
  }

  render() {
    const { methods_login, profiles, filiais, modules, spaces, loading } = this.state;

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
        <h2 id="formsBase">Dados do Usuário</h2>
        <form className="rui-snippet-preview demo form-border-effect-kie" onSubmit={this.save}>
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

          <FormGroup>
            <Label for="method_login">Forma de Acesso *</Label>
            <Select
              id="method_login"
              name="method_login"
              defaultValue={this.state.method_login}
              options={methods_login}
              styles={customStyles}
              onChange={row => this.setState({ method_login: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="email">{methods_login.find(i => i.value === this.state.method_login.value).label} *</Label>
            <Input
              type="text"
              name="email"
              required
              id="email"
              placeholder={methods_login.find(i => i.value === this.state.method_login.value).label}
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="password">Senha *</Label>
            <Input
              type="password"
              name="password"
              required
              id="password"
              placeholder="******"
              value={this.state.password}
              onChange={event => this.setState({ password: event.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="sales_commission">% Comissão serviços</Label>
            <Input
              type="text"
              name="sales_commission"
              id="sales_commission"
              placeholder="50,00%"
              value={this.state.sales_commission}
              onChange={event => this.setState({ sales_commission: event.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="profile_id">Perfil *</Label>
            <Select
              id="profile_id"
              name="profile_id"
              required
              defaultValue={this.state.profile_id}
              options={profiles}
              styles={customStyles}
              onChange={row => this.setState({ profile_id: row.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="filial_id">Filial *</Label>
            <Select
              id="filial_id"
              name="filial_id"
              required
              defaultValue={this.state.filial_id}
              options={filiais}
              styles={customStyles}
              onChange={row => this.setState({ filial_id: row.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="modules">Módulos WEB *</Label>
            <Select
              id="modules"
              name="modules"
              defaultValue={this.state.selected_modules}
              options={modules}
              styles={customStyles}
              isMulti
              onChange={rows => this.setState({ selected_modules: rows })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="spaces">Espaços App</Label>
            <Select
              id="spaces"
              name="spaces"
              defaultValue={this.state.selected_spaces}
              options={spaces}
              styles={customStyles}
              isMulti
              onChange={rows => this.setState({ selected_spaces: rows })}
            />
          </FormGroup>

          <FormGroup>
            <CustomInput
              type="switch"
              id="sales_cancel"
              name="sales_cancel"
              label="Cancela Venda/Serviços?"
              checked={this.state.sales_cancel}
              onChange={event => this.setState({ sales_cancel: event.target.checked })}
            />

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
