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
import Dropdown from "../../../components/bs-dropdown";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Button, Input, Label, FormGroup } from "reactstrap";
import Select from "react-select";

/**
 * import services/utils
 */
import api from "./../../../utils/api";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";
import DataTables from "../../../components/data-tables";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: "",
      data: [],
      modalOpen: false,
      client_id: "",
      client_name: "",
      user_id: "",
      filial_id: "",
      date: "",
      obs: "",
      filiais: [],
      users: [],
      loading: false,
    };

    this.toggle = this.toggle.bind(this);
    this.handleSchedule = this.handleSchedule.bind(this);
    this.handleScheduleSave = this.handleScheduleSave.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  }

  async loadData() {
    const { data } = await api.get("crm/clients");
    this.setState({
      data: data.map(d => {
        d.is_active = d.is_active ? "Ativo" : "Inativo";
        d.qtde_sales = d.qtde_sales ? d.qtde_sales : 0;
        d.phone = d.phone ? d.phone : "-";
        d.email = d.email ? d.email : "-";
        return d;
      }),
    });
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

  handleSchedule(id, name) {
    this.setState({ client_id: id, client_name: name });
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
      const { data } = await api.post(`/crm/clients/${this.state.client_id}/schedules`, {
        user_id: this.state.user_id.value,
        filial_id: this.state.filial_id.value,
        date: this.state.date,
        obs: this.state.obs,
      });

      this.toggle();

      addToast({
        title: "Sucesso!.",
        content: "Agendamento realizado com sucesso.",
        time: new Date(),
        duration: 10000,
        color: "success",
      });
    } catch (error) {
      if (error.response) {
        if (error.response.data && error.response.data.error === true) {
          alert(error.response.data.more);
        } else {
          alert("Erro ao criar agendamento");
        }
      } else {
        alert("Erro ao criar agendamento");
      }
      console.log(error);
    }

    this.setState({ loading: false });
  }

  async handleChangeStatus(id, status) {
    const { addToast } = this.props;

    try {
      this.setState({ loading: true });

      const { data } = await api.put(`/crm/clients/${id}`, { is_active: status === "Ativo" ? false : true });

      addToast({
        title: "Sucesso!.",
        content: `O registro foi ${status === "Ativo" ? "Desativado" : "Ativado"} com sucesso`,
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
          alert("Erro ao tentar alterar situação");
        }
      } else {
        alert("Erro ao tentar alterar situação");
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
    const { term } = this.state;

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
        <div className="rui-filemanager">
          <div className="rui-filemanager-head">
            <div className="row sm-gap vertical-gap align-items-center">
              <div className="col">
                <div className="input-group">
                  <div className="input-group-prepend mnl-3">
                    <button type="button" className="btn btn-clean btn-grey-5 mb-0 mnl-10">
                      <Icon name="search" />
                    </button>
                  </div>
                  <input
                    type="search"
                    value={term}
                    onChange={event => this.setState({ term: event.target.value })}
                    placeholder="Digite aqui para pesquisar..."
                    className="form-control form-control-clean rui-search-input"
                  />
                </div>
              </div>

              <div className="col-auto">
                <Link to="/crm/clientes/add">
                  <button type="button" className="btn btn-brand btn-sm btn-uniform btn-round">
                    <Icon name="plus" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="rui-filemanager-content">
            <div className="table-responsive-lg">
              {this.state.data.length > 0 ? (
                <DataTables
                  className="rui-datatable rui-filemanager-table table mb-0 "
                  data={{
                    order: [0, "asc"],
                    paging: false,
                    info: false,
                    searching: false,
                  }}>
                  <thead>
                    <tr>
                      <th scope="col">
                        Nome
                        <Icon name="chevron-down" />
                      </th>
                      <th scope="col">
                        Telefone
                        <Icon name="chevron-down" />
                      </th>
                      <th scope="col">
                        Situação
                        <Icon name="chevron-down" />
                      </th>
                      <th scope="col">
                        Atendimentos
                        <Icon name="chevron-down" />
                      </th>
                      <th className="rui-datatable-empty" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data.map(item => {
                      if (term === "" || item.name.toUpperCase().includes(term.toUpperCase()))
                        return (
                          <tr>
                            <th scope="row" className="rui-filemanager-table-name">
                              <span className="rui-filemanager-file">
                                <Link className="rui-filemanager-file-link" to={`/crm/clientes/show/${item.id}`}>
                                  {/*<Icon name="file-text" />*/}
                                  {item.name}
                                </Link>
                              </span>
                            </th>
                            <td className="rui-filemanager-table-date">
                              <a className="rui-filemanager-file-a" href={`tel:${item.phone}`}>
                                <span className="rui-filemanager-file">{item.phone}</span>
                              </a>
                            </td>
                            <td className="rui-filemanager-table-size">
                              <span className="rui-filemanager-file">{item.is_active}</span>
                            </td>
                            <td className="rui-filemanager-table-size">
                              <span className="rui-filemanager-file">{item.qtde_sales}</span>
                            </td>

                            <td className="rui-filemanager-table-icon">
                              <span className="rui-filemanager-file d-flex">
                                <Link className="rui-filemanager-file-icon mr-10" to={`/crm/clientes/edit/${item.id}`}>
                                  <Icon name="edit" />
                                </Link>

                                <Dropdown tag="a" direction="left" className="">
                                  <Dropdown.Toggle tag="a" className="dropdown-item ">
                                    <Icon name="more-vertical" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu tag="ul" className="nav">
                                    <li>
                                      <a className="nav-link" onClick={() => this.handleSchedule(item.id, item.name)}>
                                        <Icon name="calendar" />
                                        <span>Realizar Agendamento</span>
                                        <span className="rui-nav-circle"></span>
                                      </a>
                                    </li>
                                    <li>
                                      <Link to={`/crm/clientes/${item.id}/agendamentos`} className="nav-link">
                                        <Icon name="calendar" />
                                        <span>Ver Agendamentos</span>
                                        <span className="rui-nav-circle"></span>
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to={`/crm/clientes/show/${item.id}/`} className="nav-link">
                                        <Icon name="file-text" />
                                        <span>Histórico de Atendimentos</span>
                                        <span className="rui-nav-circle"></span>
                                      </Link>
                                    </li>
                                    <li>
                                      <a className="nav-link" onClick={() => this.handleChangeStatus(item.id, item.is_active)}>
                                        <Icon name="refresh-cw" />
                                        <span>{this.state.loading ? "Alterando..." : "Ativar/Desativar"}</span>
                                        <span className="rui-nav-circle"></span>
                                      </a>
                                    </li>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </span>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </DataTables>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {/** modal criar agendamento */}
        <Modal isOpen={this.state.modalOpen} toggle={this.toggle} className={this.props.className} fade>
          <form onSubmit={this.handleScheduleSave}>
            <div className="modal-header">
              <h5 className="modal-title h2">Agendar Atendimento</h5>
              <Button className="close" color="" onClick={this.toggle}>
                <Icon name="x" />
              </Button>
            </div>
            <ModalBody>
              Realizar agendamento para <mark className="display-4">{this.state.client_name}</mark>
              <br />
              <br />
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
                {this.state.loading ? "Salvando..." : "Agendar"}
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
)(Content);
