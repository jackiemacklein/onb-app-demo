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
      is_active: true,
      loading: false,
      values: [],
    };

    this.save = this.save.bind(this);
    this.loadSpaces = this.loadSpaces.bind(this);
    this.changeValues = this.changeValues.bind(this);
  }

  async save(event) {
    event.preventDefault();
    const { addToast } = this.props;

    this.setState({ loading: true });

    try {
      await api.post("/services", { ...this.state });

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

  async loadSpaces() {
    const { data } = await api.get("/spaces");
    this.setState({
      values: data.map(item => ({ space_id: item.id, name: item.name, price: "0,00" })),
    });
  }

  async changeValues(space_id, price) {
    let values = this.state.values;

    values = values.map(value => {
      if (value.space_id === space_id) {
        value = { space_id: value.space_id, name: value.name, price };
      }
      return value;
    });

    this.setState({ values });
  }

  componentDidMount() {
    this.loadSpaces();
  }

  render() {
    const { values, loading } = this.state;

    return (
      <Fragment>
        <h2 id="formsBase">Dados do Serviço</h2>
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

          {values.map(({ space_id, name, price }, index) => (
            <FormGroup key={index}>
              <Label for={`space-${space_id}`}>Valor no {name} *</Label>
              <Input
                id={`space-${space_id}`}
                name={`space-${space_id}`}
                defaultValue={price}
                required
                onChange={event => this.changeValues(space_id, event.target.value)}
              />
            </FormGroup>
          ))}

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
