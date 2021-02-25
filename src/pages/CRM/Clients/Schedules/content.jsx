/**
 * Styles
 */
import "./style.scss";

/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Button, Input, Label, FormGroup } from "reactstrap";
import Select from "react-select";
import { parseISO, format } from "date-fns";

/**
 * import services/utils
 */
import api from "./../../../../utils/api";

/**
 * Internal Dependencies
 */
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
      schedule_id: "",
      data: { name: "", phone: "", email: "", cpf: "", profile: { name: "" }, schedules: [] },
      modalOpen: false,
      user_id: "",
      filial_id: "",
      date: "",
      obs: "",
      filiais: [],
      users: [],
      loading: false,
      states: [
        { value: "scheduled", label: "Agendado" },
        { value: "canceled", label: "Cancelado" },
        { value: "realized", label: "Realizado" },
      ],
    };

    this.loadData = this.loadData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.handleSchedule = this.handleSchedule.bind(this);
    this.handleScheduleSave = this.handleScheduleSave.bind(this);
  }

  async loadData() {
    const { id } = this.props.match.params;

    const { data } = await api.get(`crm/clients/${id}`);

    this.setState({
      data: data,
      id,
    });
  }

  toggle() {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  }

  async loadUsers() {
    const { data } = await api.get("users/");
    this.setState({
      users: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  async loadFiliais() {
    const { data } = await api.get("filiais/");
    this.setState({
      filiais: data.map(d => {
        return { value: d.id, label: d.name };
      }),
    });
  }

  handleSchedule(param) {
    const { addToast } = this.props;

    if (param.state === "canceled" || param.state === "rescheduled") {
      addToast({
        title: "Atenção!",
        content: "Não é possivel editar agedamentos cancelados e/ou reagendados.",
        time: new Date(),
        duration: 10000,
        color: "info",
      });
      return false;
    }

    const user_id = { value: param?.user_id, label: param?.user?.name };
    const client_id = param.client_id;
    const filial_id = { value: param?.filial_id, label: param?.filial?.name };
    const state = this.state.states.find(i => i.value === param.state);
    const date = format(parseISO(param.date), "yyyy'-'MM'-'dd'T'HH:mm");

    this.setState({ schedule_id: param.id, user_id, client_id, filial_id, date, obs: param.obs, state });
    this.toggle();
  }

  async handleScheduleSave(event) {
    event.preventDefault();
    const { addToast } = this.props;

    if (!this.state.date || !this.state.filial_id || !this.state.user_id) {
      alert("Os campos DATA, FILIAL E ATENDENTE são obrigatórios.");
      return false;
    }

    try {
      this.setState({ loading: true });
      const { data } = await api.put(`/crm/schedules/${this.state.schedule_id}`, {
        client_id: this.state.id,
        user_id: this.state.user_id.value,
        filial_id: this.state.filial_id.value,
        date: this.state.date,
        obs: this.state.obs,
        state: this.state.state.value,
      });

      this.toggle();

      addToast({
        title: "Sucesso!.",
        content: "Agendamento atualizado com sucesso.",
        time: new Date(),
        duration: 10000,
        color: "success",
      });

      this.loadData();
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao atualizado agendamento");
        }
      } else {
        alert("Erro ao atualizado agendamento");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  componentDidMount() {
    this.loadData();
    this.loadUsers();
    this.loadFiliais();
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
        <div className="rui-profile row vertical-gap">
          <div className="col-lg-6 col-xl-5">
            <div className="card">
              <div className="card-body">
                <div className="row vertical-gap">
                  {/*<div className="col-auto">
                    <div className="rui-profile-img">
                      <img src={settings.users[0].img_profile} alt="" />
                    </div>
    </div>*/}
                  <div className="col">
                    <div className="rui-profile-info">
                      <h3 className="rui-profile-info-title h4">{this.state.data.name}</h3>
                      <small className="text-grey-6 mt-2 mb-15">{this.state.data.cpf}</small>
                      <Link className="rui-profile-info-mail" to={`mailto:${this.state.data.email}`}>
                        {this.state.data.email}
                      </Link>
                      <Link className="rui-profile-info-phone" to={`tel:${this.state.data.phone}`}>
                        {this.state.data.phone}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-7">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <h2 className="card-title mnb-6 mr-auto">Agendamentos</h2>

                  <Link to={`/crm/clientes/${this.state.id}/calendario`}>
                    <button className="btn btn-brand btn-uniform btn-round btn-sm mnt-8 mnb-8" type="button">
                      <Icon name="calendar" />
                    </button>
                  </Link>
                </div>
                <ul className="list-group list-group-flush rui-profile-task-list">
                  {this.state.data.schedules.map(item => (
                    <li className="list-group-item" key={item.id} onClick={() => this.handleSchedule(item)}>
                      <div className={`rui-task rui-task-${item.state}`}>
                        <div className="rui-task-icon">
                          <Icon name={icon(item.state)} />
                        </div>
                        <div className="rui-task-content">
                          <a className="rui-task-title">{format(parseISO(item.date), "dd'/'MM'/'yyyy' às 'HH:mm'h'")}</a>

                          <small className="rui-task-subtitle">
                            Atendente:{" "}
                            <a>
                              <strong>{item?.user?.name}</strong>
                            </a>
                          </small>
                          <small className="rui-task-subtitle">
                            Filial:{" "}
                            <a>
                              <strong>{item.filial.name}</strong>
                            </a>{" "}
                            / Situação:{" "}
                            <a>
                              <strong>{translate(item.state)}</strong>
                            </a>
                          </small>
                          <small className="rui-task-subtitle">
                            Obs:{" "}
                            <a>
                              <strong>{item.obs}</strong>
                            </a>
                          </small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/** modal editar agendamento */}
        <Modal isOpen={this.state.modalOpen} toggle={this.toggle} className={this.props.className} fade>
          <form onSubmit={this.handleScheduleSave}>
            <div className="modal-header">
              <h5 className="modal-title h2">Editar Agendamento</h5>
              <Button className="close" color="" onClick={this.toggle}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              Editar agendamento para <mark className="display-4">{this.state.data.name}</mark>
              <br />
              <br />
              <FormGroup>
                <Label for="state">Situação *</Label>
                <Select
                  id="state"
                  name="state"
                  required
                  defaultValue={this.state.state}
                  options={this.state.states}
                  styles={customStyles}
                  onChange={row => this.setState({ state: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="filial_id">Filial *</Label>
                <Select
                  id="filial_id"
                  name="filial_id"
                  required
                  defaultValue={this.state.filial_id}
                  options={this.state.filiais}
                  styles={customStyles}
                  onChange={row => this.setState({ filial_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="user_id">Atendente *</Label>
                <Select
                  id="user_id"
                  name="user_id"
                  required
                  defaultValue={this.state.user_id}
                  options={this.state.users}
                  styles={customStyles}
                  onChange={row => this.setState({ user_id: row })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="date">Data e Hora *</Label>
                <Input
                  id="date"
                  name="date"
                  required
                  min={new Date()}
                  placeholder="01/01/2021"
                  type="datetime-local"
                  value={this.state.date}
                  onChange={event => this.setState({ date: event.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="obs">Observações</Label>
                <Input id="obs" name="obs" placeholder="" type="text" value={this.state.obs} onChange={event => this.setState({ obs: event.target.value })} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" type="button" onClick={this.toggle} disabled={this.state.loading}>
                Fechar
              </Button>{" "}
              <Button color="success" type="submit" disabled={this.state.loading}>
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
    removeToast: actionRemoveToast,
  },
)(withRouter(Content));

function translate(text) {
  if (text === "scheduled") {
    return "Agendado";
  } else if (text === "canceled") {
    return "Cancelado";
  } else if (text === "realized") {
    return "Realizado/Atendido";
  } else if (text === "rescheduled") {
    return "Reagendado";
  }
}

function icon(text) {
  if (text === "scheduled") {
    return "calendar";
  } else if (text === "canceled") {
    return "x-square";
  } else if (text === "realized") {
    return "check-square";
  } else if (text === "rescheduled") {
    return "copy";
  }
}
