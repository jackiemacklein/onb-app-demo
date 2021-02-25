/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import { withRouter, Link } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, Row, Col } from "reactstrap";

/**
 * import services/utils
 */
import api from "./../../../utils/api";

/**
 * Internal Dependencies
 */
//import Snippet from "../../../components/snippet";
import Icon from "../../../components/icon";
import { addToast as actionAddToast } from "../../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: "",
      data: [],
      spaces: [],
      columns: [
        {
          name: "Cód.",
          selector: "id",
          sortable: true,
        },
        {
          name: "Nome",
          selector: "name",
          sortable: true,
        },
        {
          name: "Situação",
          selector: "is_active",
          sortable: true,
          right: false,
        },
      ],
      modalOpen: false,
      data_id: "",
    };

    this.save = this.save.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleRowDoubleClicked = this.handleRowDoubleClicked.bind(this);
    this.handleRowClicked = this.handleRowClicked.bind(this);
    this.loadSpaces = this.loadSpaces.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  }

  async save() {
    const { addToast } = this.props;

    try {
      await api.delete(`/services/${this.state.data_id}`);
      addToast({
        title: "Sucesso.",
        content: "O Item foi desativado com sucesso.",
        time: new Date(),
        duration: 7000,
        color: "success",
      });
      this.loadData();
    } catch (error) {
      console.log(error);
      addToast({
        title: "Ocorreu um erro ao tentar desativar registro!.",
        content: "Tente novamente",
        time: new Date(),
        duration: 20000,
        color: "error",
      });
    }
    this.toggle();
  }

  async loadData() {
    const { data } = await api.get("/services");
    this.setState({
      data: data.map(d => {
        d.is_active = d.is_active ? "Ativo" : "Inativo";
        return d;
      }),
    });
  }

  async loadSpaces() {
    const { data } = await api.get("/spaces");
    this.setState({ spaces: data });
  }

  async handleRowClicked(row) {
    const { history } = this.props;

    history.push(`/servicos/edit/${row.id}`);
  }

  async handleRowDoubleClicked(row) {
    this.setState({ data_id: row.id });
    this.toggle();
  }

  componentDidMount() {
    this.loadSpaces();
    this.loadData();
  }

  render() {
    const { data, columns, term } = this.state;

    return (
      <Fragment>
        <div className="rui-filemanager-head mb-20">
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
                  className="form-control form-control-clean rui-search-input"
                  placeholder="Digite aqui para pesquisar..."
                />
              </div>
            </div>

            <div className="col-auto">
              <Link to="/servicos/add">
                <button type="button" className="btn btn-brand btn-sm btn-uniform btn-round">
                  <Icon name="plus" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="table-border-effect-kie">
          <DataTable
            title="Listagem"
            pagination
            responsive
            expandableRows
            expandableRowsComponent={<ExpandableRowComponent spaces={this.state.spaces} />}
            pointerOnHover
            columns={columns}
            highlightOnHover
            paginationPerPage={10}
            onRowClicked={this.handleRowClicked}
            onRowDoubleClicked={this.handleRowDoubleClicked}
            data={data.filter(d => d.name.toUpperCase().includes(term.toUpperCase()) || term == d.id)}
          />
        </div>
        <Modal isOpen={this.state.modalOpen} toggle={this.toggle} className={this.props.className} fade>
          <div className="modal-header">
            <h5 className="modal-title h2">Desativar Registro</h5>
            <Button className="close" color="" onClick={this.toggle}>
              <Icon name="x" />
            </Button>
          </div>
          <ModalBody>Tem Certeza que deseja desativar o registro Cód. {this.state.data_id}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Fechar
            </Button>{" "}
            <Button color="brand" onClick={this.save}>
              Desativar
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

const ExpandableRowComponent = ({ data, spaces }) => {
  return (
    <Row className="xs-gap p-10 flex-wrap">
      {spaces.map(item => {
        let value = data.values.find(v => v.space_id === item.id);
        if (value) value = value.price;
        else value = "0,00";

        return (
          <Col xs={6} sm={3}>
            <blockquote className="blockquote">
              <p className="mb-0">Valor no {item.name}</p>
              <footer className="blockquote-footer">R$ {value}</footer>
            </blockquote>
          </Col>
        );
      })}
    </Row>
  );
};

export default connect(
  ({ settings, toasts }) => ({
    settings,
    toasts,
  }),
  {
    addToast: actionAddToast,
  },
)(withRouter(Content));
