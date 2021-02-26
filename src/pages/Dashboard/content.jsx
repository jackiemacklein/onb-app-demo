/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Chart } from "react-chartjs-2";
import { Row, Col, Label } from "reactstrap";
import Select from "react-select";
import Cookies from "js-cookie";
import ReactFlot from "react-flot";
import "flot/source/jquery.flot.pie.js";

/**
 * Internal Dependencies
 */
import Carousel from "./components/carousel";
import WidgetMemory from "./components/widget-memory";
import WidgetDisc from "./components/widget-disc";
import WidgetCPU from "./components/widget-cpu";
import WidgetTasks from "./components/widget-tasks";
import WidgetUploads from "./components/widget-uploads";
import WidgetActivity from "./components/widget-activity";
import Map from "./components/map";
import WidgetCountries from "./components/widget-countries";

import Icon from "../../components/icon";
import Dropdown from "../../components/bs-dropdown";
import { addToast as actionAddToast, removeToast as actionRemoveToast } from "../../actions";
import DatePicker from "../../components/date-time-picker";

/**
 * import services/utils
 */

import api from "../../utils/api";
import { format, parseISO } from "date-fns";
import pt from "date-fns/locale/pt-BR";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bank_accounts: [],

      flow_categories: [],
      types: [
        { value: "in", label: "Contas à Receber" },
        { value: "out", label: "Contas à Pagar" },
      ],
      filiais: [],
      filter_types: [
        { value: "", label: "Todos os lançamentos" },
        { value: "type=in", label: "Receitas" },
        { value: "type=in&state=paid", label: "Receitas recebidas" },
        { value: "type=in&state=opened", label: "Receitas não pagas" },
        { value: "type=out", label: "Despesas" },
        { value: "type=out&state=paid", label: "Despesas pagas" },
        { value: "type=out&state=opened", label: "Despesas não pagas" },
        { value: "tranf=true", label: "Transferências entre contas" },
        { value: "tranf=true&state=paid", label: "Transferências realizadas" },
        { value: "tranf=true&state=opened", label: "Transferências pendentes" },
        { value: "tranf=true&type=out", label: "Transferências feitas" },
        { value: "tranf=true&type=in", label: "Transferências recebidas" },
      ],
      filter_start_date: new Date(),
      filter_end_date: null,
      filter_filial_id: {
        value: Cookies.get("rui-auth-filial_id") != "undefined" ? Cookies.get("rui-auth-filial_id") : "",
        label: Cookies.get("rui-auth-filial_name") != "undefined" ? Cookies.get("rui-auth-filial_name") : "Selecione",
      },
      filter_category_id: { value: "", label: "Todas" },
      filter_bank_account_id: { value: "", label: "Todos" },
      filter_type: { value: "", label: "Todos os lançamentos" },
    };

    this.getChartjsOptions = this.getChartjsOptions.bind(this);
    this.getChartjsData = this.getChartjsData.bind(this);
    this.getChartistOptions = this.getChartistOptions.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
  }

  // carrega as filiais
  async loadFiliais() {
    try {
      const { data } = await api.get("/filiais");
      if (data.length > 0) {
        this.setState({
          filiais: data.map(item => {
            return { value: item.id, label: item.name };
          }),
        });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar filiais");
    }
  }

  getChartjsOptions(label) {
    return {
      tooltips: {
        mode: "index",
        intersect: false,
        backgroundColor: "#393f49",
        bodyFontSize: 11,
        bodyFontColor: "#d7d9e0",
        bodyFontFamily: "'Open Sans', sans-serif",
        xPadding: 10,
        yPadding: 10,
        displayColors: false,
        caretPadding: 5,
        cornerRadius: 4,
        callbacks: {
          title: () => {},
          label,
        },
      },
      legend: {
        display: false,
      },
      maintainAspectRatio: true,
      spanGaps: false,
      plugins: {
        filler: {
          propagate: false,
        },
      },
      scales: {
        xAxes: [{ display: false }],
        yAxes: [
          {
            display: false,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
  }

  getChartjsData(canvas, data, color = "#8e9fff") {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 90);
    gradient.addColorStop(0, Chart.helpers.color(color).alpha(0.1).rgbString());
    gradient.addColorStop(1, Chart.helpers.color(color).alpha(0).rgbString());

    return {
      labels: data,
      datasets: [
        {
          backgroundColor: gradient,
          borderColor: color,
          borderWidth: 2,
          pointHitRadius: 5,
          pointBorderWidth: 0,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
          pointHoverBorderWidth: 0,
          pointHoverBackgroundColor: color,
          data,
        },
      ],
    };
  }

  getChartistOptions() {
    return {
      type: "Pie",
      options: {
        donut: true,
        showLabel: false,
        donutWidth: 4,
        width: 150,
        height: 150,
      },
      listener: {
        created(ctx) {
          const defs = ctx.svg.elem("defs");
          defs
            .elem("linearGradient", {
              id: "gradient",
              x1: 0,
              y1: 1,
              x2: 0,
              y2: 0,
            })
            .elem("stop", {
              offset: 0,
              "stop-color": "#8e9fff",
            })
            .parent()
            .elem("stop", {
              offset: 1,
              "stop-color": "#2bb7ef",
            });
        },
      },
    };
  }

  componentDidMount() {
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
        <div className="bill-filters">
          <Row>
            <Col xs={12} sm={6} md={2}>
              <Label for="filter_type" className="mt-10">
                Tipo
              </Label>
              <Select
                id="filter_type"
                name="filter_type"
                defaultValue={this.state.filter_type}
                value={this.state.filter_type}
                options={this.state.filter_types}
                styles={customStyles}
                onChange={row => this.setState({ filter_type: row })}
              />
            </Col>

            <Col xs={12} sm={6} md={2}>
              <Label for="filter_filial_id" className="mt-10">
                Filial
              </Label>
              <Select
                id="filter_filial_id"
                name="filter_filial_id"
                defaultValue={this.state.filter_filial_id}
                value={this.state.filter_filial_id}
                options={[{ value: "", label: "Selecione" }, ...this.state.filiais]}
                styles={customStyles}
                onChange={row => this.setState({ filter_filial_id: row })}
              />
            </Col>

            <Col xs={12} sm={12} md={4}>
              <Label className="mt-10">Período</Label>
              <Dropdown tag="div" className="" showTriangle>
                <Dropdown.Toggle tag="button" className="btn btn-brand btn-block mb-5">
                  <span className="text">
                    {format(this.state.filter_start_date, "dd/MM/yyyy")} à {format(this.state.filter_end_date ?? this.state.filter_start_date, "dd/MM/yyyy")}
                  </span>
                  <span className="icon icon ml-auto">
                    <Icon name="chevron-down" />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu tag="ul" className="nav">
                  <li onClick={() => {}}>
                    <DatePicker
                      selected={this.state.filter_start_date}
                      onChange={dates => this.changeFilterDate(dates)}
                      startDate={this.state.filter_start_date}
                      endDate={this.state.filter_end_date}
                      selectsRange
                      inline
                      className="rui-datetimepicker form-control w-auto"
                      locale="pt"
                    />
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            <Col xs={12} sm={6} md={2}>
              <Label for="filter_category_id" className="mt-10">
                Categorias
              </Label>
              <Select
                id="filter_category_id"
                name="filter_category_id"
                defaultValue={this.state.filter_category_id}
                value={this.state.filter_category_id}
                options={[{ value: "", label: "Todas" }, ...this.state.flow_categories]}
                styles={customStyles}
                onChange={row => this.setState({ filter_category_id: row })}
              />
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Label for="filter_bank_account_id" className="mt-10">
                Bancos&Carterias
              </Label>
              <Select
                id="filter_bank_account_id"
                name="filter_bank_account_id"
                defaultValue={this.state.filter_bank_account_id}
                value={this.state.filter_bank_account_id}
                options={[{ value: "", label: "Todos" }, ...this.state.bank_accounts]}
                styles={customStyles}
                onChange={row => this.setState({ filter_bank_account_id: row })}
              />
            </Col>
          </Row>
        </div>

        {/* grafico do faturamento por filial */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Acompanhamento Por Filial</h2>
        <div className="chart-filial">
          <ReactFlot
            id="line-chart"
            options={{
              series: {
                lines: {
                  show: true,
                  lineWidth: 1,
                  fill: false,
                  fillColor: {
                    colors: [{ opacity: 1 }, { opacity: 1 }],
                  },
                },
              },
              yaxis: {
                showTicks: false,
                gridLines: false,
                color: "transparent",
              },
              xaxis: {
                showTicks: false,
                gridLines: false,
                ticks: [
                  [1, "Jan"],
                  [2, "Feb"],
                  [3, "Mar"],
                  [4, "Apr"],
                  [5, "May"],
                  [6, "Jun"],
                  [7, "Jul"],
                  [8, "Aug"],
                  [9, "Sep"],
                ],
                color: "transparent",
              },
              grid: {
                borderWidth: 0,
              },
            }}
            data={[
              {
                data: [
                  [1, 0],
                  [2, 10],
                  [3, 10],
                  [4, 13],
                  [5, 10],
                  [6, 20],
                  [7, 10],
                  [8, 10],
                  [9, 25],
                ],
                color: "rgba(171, 184, 255, 0.8)",
                shadowSize: 0,
                points: {
                  show: true,
                  fillColor: "#fff",
                  lineWidth: 1,
                },
              },
              {
                data: [
                  [1, 0],
                  [2, 9],
                  [3, 15],
                  [4, 10],
                  [5, 30],
                  [6, 15],
                  [7, 25],
                  [8, 18],
                  [9, 20],
                ],
                color: "rgba(94, 119, 255, 0.8)",
                shadowSize: 0,
                points: {
                  show: true,
                  fillColor: "#fff",
                  lineWidth: 1,
                },
              },
            ]}
            width="100%"
            height="320px"
          />
        </div>

        {/* grafico do faturamento por tipo de pagamento */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Total por tipo de pagamento</h2>
        <div className="chart-filial">
          <ReactFlot
            id="pie-chart"
            options={{
              series: {
                pie: {
                  show: true,
                  radius: 1,
                  label: {
                    show: true,
                    radius: 2 / 4,
                    formatter(t) {
                      return `<div style="font-size:12px;text-align:center;padding:2px;color:white;">${t}</div>`;
                    },
                  },
                  stroke: {
                    width: 0,
                  },
                },
              },
              yaxis: {
                showTicks: false,
                gridLines: false,
                color: "transparent",
              },
              xaxis: {
                showTicks: false,
                gridLines: false,
                color: "transparent",
              },
              grid: {
                borderWidth: 0,
              },
            }}
            data={[
              {
                data: 5,
                label: "Jan",
                color: "rgba(94, 119, 255, 0.8)",
              },
              {
                data: 3,
                label: "Feb",
                color: "rgba(94, 119, 255, 0.6)",
              },
              {
                data: 4,
                label: "Mar",
                color: "rgba(94, 119, 255, 0.4)",
              },
            ]}
            width="100%"
            height="320px"
          />
        </div>

        {/* Swiper */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Comparativos de performance</h2>
        <Carousel getChartjsData={this.getChartjsData} getChartjsOptions={this.getChartjsOptions} getChartistOptions={this.getChartistOptions} />

        {/* Earnings by countries and map */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Serviços, Produtos & Colaboradores</h2>
        <Row className="vertical-gap">
          <Col lg="4">
            <WidgetCountries />
          </Col>
          <Col lg="4">
            <WidgetCountries />
          </Col>
          <Col lg="4">
            <WidgetCountries />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default connect(({ settings }) => ({
  settings,
}))(Content);
