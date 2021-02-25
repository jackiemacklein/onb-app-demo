/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import { withRouter, Link } from "react-router-dom";
import { Button, ModalBody, ModalFooter } from "reactstrap";

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
          name: "Cor",
          selector: "color",
          sortable: false,
        },
      ],
    };

    this.handleRowDoubleClicked = this.handleRowDoubleClicked.bind(this);
    this.handleRowClicked = this.handleRowClicked.bind(this);
  }

  async loadData() {
    const { data } = await api.get("/spaces");
    this.setState({
      data: data.map(d => {
        d.is_active = d.is_active ? "Ativo" : "Inativo";
        return d;
      }),
    });
  }

  async handleRowClicked(row) {
    const { history } = this.props;

    history.push(`/espacos/edit/${row.id}`);
  }

  async handleRowDoubleClicked(row) {
    this.setState({ data_id: row.id });
    this.toggle();
  }

  componentDidMount() {
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
              <Link to="/espacos/add">
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
            pointerOnHover
            columns={columns}
            highlightOnHover
            paginationPerPage={10}
            onRowClicked={this.handleRowClicked}
            onRowDoubleClicked={this.handleRowDoubleClicked}
            data={data.filter(d => d.name.toUpperCase().includes(term.toUpperCase()) || term == d.id)}
          />
        </div>
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
  },
)(withRouter(Content));
