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

      data_filial: [],

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
    this.changeFilterDate = this.changeFilterDate.bind(this);
    this.loadFiliais = this.loadFiliais.bind(this);
    this.loadBankAcconts = this.loadBankAcconts.bind(this);
    this.loadDataFilial = this.loadDataFilial.bind(this);
  }

  // --> carrega os dados do grafico das filiais
  async loadDataFilial() {
    try {
      const date_s = format(this.state.filter_start_date, "yyyy-MM-dd");
      const date_e = this.state.filter_end_date ? format(this.state.filter_end_date, "yyyy-MM-dd") : format(this.state.filter_start_date, "yyyy-MM-dd");

      const { data } = await api.get(
        `/dashboard/data/filiais/?start_date=${date_s}&end_date=${date_e}&filial_id=${this.state.filter_filial_id.value}&bank_account_id=${this.state.filter_bank_account_id.value}`,
      );

      this.setState({ data_filial: data });
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar dados das filiais");
    }
  }

  // carrega as filiais
  async loadFiliais() {
    try {
      const { data } = await api.get("/filiais");
      if (data.length > 0) {
        this.setState({
          filiais: data.map(item => {
            return { value: item.id, label: item.name, color: "#" + (((1 << 24) * Math.random()) | 0).toString(16) };
          }),
        });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar filiais");
    }
  }

  // --> Carrega na api as contas
  async loadBankAcconts() {
    try {
      const { data } = await api.get("/banks/accounts");
      if (data.length > 0) {
        this.setState({
          bank_accounts: data.map(item => {
            return { value: item.id, label: item.name };
          }),
        });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar Contas e Carterias");
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

  // --> realiza a alteração do filtro de datas
  changeFilterDate(dates) {
    const [start, end] = dates;
    this.setState({ filter_start_date: start, filter_end_date: end });
  }

  componentDidMount() {
    this.loadDataFilial();
    this.loadFiliais();
    this.loadBankAcconts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.location.href.includes("/dashboard")) {
      if (Cookies.get("rui-auth-token")) {
        if (
          prevState.filter_start_date !== this.state.filter_start_date ||
          prevState.filter_end_date !== this.state.filter_end_date ||
          prevState.filter_filial_id !== this.state.filter_filial_id ||
          prevState.filter_bank_account_id !== this.state.filter_bank_account_id
        ) {
          this.loadDataFilial();
        }
      }
    }
  }

  render() {
    const { data_filial, filiais } = this.state;

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
            <Col xs={12} sm={6} md={3}>
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

            <Col xs={12} sm={6} md={3}>
              <Label for="filter_bank_account_id" className="mt-10">
                Contas & Carterias
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

            <Col xs={12} sm={12} md={6}>
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
          </Row>
        </div>

        {/* grafico do faturamento por filial */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Consolidado Por Filial</h2>
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
                ticks: data_filial[0]?.datas.map((item, index) => {
                  return [index, item.date];
                }),
                color: "transparent",
              },
              grid: {
                borderWidth: 0,
              },
            }}
            data={data_filial.map((item, index) => {
              return {
                data: item.datas.map((item2, index2) => {
                  return [index2, item2.value];
                }),

                label: item.filial_name,
                color: `rgba(171, 184, 255, ${1 - (index + 1) / 10})`,
                shadowSize: index,
                points: {
                  show: true,
                  fillColor: "#fff",
                  lineWidth: 1,
                },
              };
            })}
            width="100%"
            height="320px"
          />
        </div>

        {/* grafico de Evolução Por Contas & Carterias */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Evolução Por Contas & Carterias</h2>
        <div className="chart-filial">
          <ReactFlot
            id="banks-chart"
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
                label: "Filial 1",
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
                label: "Filial 2",
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

        {/* perfomance */}
        <div className="rui-gap-1" />
        <h2 className="mt-0 mb-2">Comparativos de Performance</h2>
        <Carousel getChartjsData={this.getChartjsData} getChartjsOptions={this.getChartjsOptions} getChartistOptions={this.getChartistOptions} />

        <Row>
          <Col xs={12} sm={12} md={6}>
            {/* grafico de Receitas por Categoria */}
            <div className="rui-gap-1" />
            <h2 className="mt-0 mb-2">Receitas por Categoria</h2>
            <div className="chart-filial">
              <ReactFlot
                id="pie-chart-in"
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
          </Col>
          <Col xs={12} sm={12} md={6}>
            {/* grafico de Despesas por Categoria */}
            <div className="rui-gap-1" />
            <h2 className="mt-0 mb-2">Despesas por Categoria</h2>
            <div className="chart-filial">
              <ReactFlot
                id="pie-chart-out"
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
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default connect(({ settings }) => ({
  settings,
}))(Content);
