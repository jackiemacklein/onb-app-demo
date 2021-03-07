/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody, CardText, CardTitle, Button, CustomInput } from "reactstrap";

/**
 * Internal Dependencies
 */
//import Snippet from "../../../components/snippet";
//import Icon from "../../../components/icon";
import api from "./../../../utils/api";
import { format, parseISO } from "date-fns";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selectedItems: [],
      allowLoading: true,
    };

    this.loadData = this.loadData.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.checkItems = this.checkItems.bind(this);
  }

  async loadData() {
    try {
      const { data } = await api.get("/sales?state=open");
      let items = data.map(s => ({ checked: false, id: s.id }));

      this.setState({ data });
      this.setState({ selectedItems: items });
    } catch (error) {
      console.log(error);
    }

    if (window.location.href.includes("/pdv/app")) {
      this.loadData();
    }
  }

  async createPayment(id) {
    const { history } = this.props;
    let items = this.state.selectedItems.filter(s => s.checked);
    items = items.map(i => i.id);

    if (items.length > 0) history.push(`/pdv/app/pagamento/${items.join(",")}`);
    else history.push(`/pdv/app/pagamento/${id}`);
  }

  async checkItems(id, checked) {
    let items = this.state.selectedItems.map(s => {
      if (s.id === id) {
        s.checked = checked;
      }
      return s;
    });

    this.setState({ selectedItems: items });
  }

  componentDidMount() {
    if (window.location.href.includes("/pdv/app")) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    this.setState({ allowLoading: false });
  }

  render() {
    return (
      <Fragment>
        {/*<h2>Header and footer</h2>*/}
        <Row className="xs-gap p-10 flex-wrap">
          {this.state.data.map(item => (
            <Col xs={12} sm={12} md={6} lg={4} className="mb-10">
              <Card key={item.id}>
                <CardHeader className="text-brand display-4 mt-0">
                  <strong>R$ {item.amount?.toLocaleString()}</strong>
                </CardHeader>
                <CardBody>
                  <CardTitle className="h2" style={{ textTransform: "capitalize" }}>
                    {item.client_name}
                  </CardTitle>
                  <CardText style={{ textTransform: "capitalize" }}>
                    <strong>Data</strong>: {format(parseISO(item.date), "dd'/'MM'/'yyyy HH':'mm")} / {item.user_name}
                    <br />
                    <strong>{item.title}</strong>
                  </CardText>
                  <div className="row justify-content-end align-items-center">
                    {/*<CustomInput
                      id={`sale_${item.id}`}
                      checked={this.state.selectedItems.find(s => s.id === item.id)?.checked}
                      label="Mesclar"
                      type="checkbox"
                      onChange={event => this.checkItems(item.id, event.target.checked)}
                    />*/}
                    <Button color="brand" onClick={() => this.createPayment(item.id)}>
                      Pagar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  ({ settings }) => ({
    settings,
  }),
  {},
)(withRouter(Content));
