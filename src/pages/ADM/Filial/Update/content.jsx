/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { CustomInput, FormGroup, Button, Label, Input } from "reactstrap";
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
      name: "",
      is_active: true,
      address: "",
      loading: false,
    };

    this.save = this.save.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.put(`/filiais/${this.state.id}`, { ...this.state });
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

  async loadData() {
    const { id } = this.props.match.params;

    const { data } = await api.get(`filiais/${id}`);
    this.setState({
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      address: data.address,
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { name, is_active, address, loading } = this.state;

    return (
      <Fragment>
        <h2 id="formsBase">Dados da Filial: {name}</h2>
        <form className="rui-snippet-preview demo form-border-effect-kie" onSubmit={this.save}>
          <FormGroup>
            <Label for="name">Nome</Label>
            <Input type="text" name="name" required id="name" placeholder="Nome" value={name} onChange={event => this.setState({ name: event.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="address">Endereço</Label>
            <Input
              type="text"
              name="address"
              id="address"
              placeholder="Endereço"
              value={address}
              onChange={event => this.setState({ address: event.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type="switch"
              id="is_active"
              name="is_active"
              label="Ativo/Inativo"
              checked={is_active}
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
