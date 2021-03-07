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
      name: "",
      email: "",
      cpf: "",
      phone: "",
      profile_id: "",
      user_id: "",
      is_active: true,
      token: "",
      loading: false,
      profiles: [],
      users: [],
    };

    this.save = this.save.bind(this);
    this.loadProfiles = this.loadProfiles.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.post("/crm/clients", {
        profile_id: this.state.profile_id.value,
        user_id: this.state.user_id.value,
        name: this.state.name,
        email: this.state.email,
        cpf: this.state.cpf,
        phone: this.state.phone,
        is_active: this.state.is_active,
        token: this.state.token,
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

  async loadProfiles() {
    const { data } = await api.get("/profiles");
    this.setState({
      profiles: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  async loadUsers() {
    const { data } = await api.get("/users/?all=true");
    this.setState({
      users: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  componentDidMount() {
    this.loadProfiles();
    this.loadUsers();
  }

  render() {
    const { profiles, loading } = this.state;

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
        <form className="rui-snippet-preview demo form-border-effect-kie" onSubmit={this.save}>
          <FormGroup>
            <Label for="profile_id">Perfil *</Label>
            <Select
              id="profile_id"
              name="profile_id"
              required
              defaultValue={this.state.profile_id}
              options={profiles}
              styles={customStyles}
              onChange={row => this.setState({ profile_id: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="user_id">É um colaborador?</Label>
            <Select
              id="user_id"
              name="user_id"
              defaultValue={this.state.user_id}
              value={this.state.user_id}
              options={this.state.users}
              styles={customStyles}
              onChange={row => this.setState({ user_id: row })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Nome *</Label>
            <Input
              type="text"
              name="name"
              required
              id="name"
              placeholder=""
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="email">E-mail</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder=""
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
          </FormGroup>

          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label for="cpf">CPF</Label>
                <Input type="text" name="cpf" id="cpf" placeholder="" value={this.state.cpf} onChange={event => this.setState({ cpf: event.target.value })} />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label for="phone">Telefone</Label>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="(00) 0 0000-0000"
                  value={this.state.phone}
                  onChange={event => this.setState({ phone: event.target.value })}
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
