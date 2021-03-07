/**
 * Styles
 */
import "./carousel.scss";

/**
 * External Dependencies
 */
import React, { Component } from "react";
import Swiper from "react-id-swiper";
import { Line } from "react-chartjs-2";
import Chartist from "react-chartist";

/**
 * Internal Dependencies
 */
import Icon from "../../../components/icon";

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: Array.from({ length: 40 }, () => Math.floor(Math.random() * (100 - 40) + 40)),
    };

    this.carouselSwiper = false;
    this.maybeUpdateChartData = this.maybeUpdateChartData.bind(this);
  }

  componentDidMount() {
    this.maybeUpdateChartData();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  maybeUpdateChartData() {
    setTimeout(() => {
      if (this.isUnmounted) {
        return;
      }

      const { chartData } = this.state;

      chartData.shift();
      chartData.push(Math.floor(Math.random() * (100 - 40) + 40));

      this.setState({
        chartData,
      });

      this.maybeUpdateChartData();
    }, 3000);
  }

  render() {
    const { getChartjsData, getChartjsOptions, getChartistOptions } = this.props;

    const { chartData } = this.state;

    return (
      <div className="rui-swiper">
        <Swiper
          grabCursor
          centeredSlides
          slidesPerView="auto"
          initialSlide={3}
          spaceBetween={30}
          speed={400}
          keyboard={{ enabled: true }}
          getSwiper={swiper => {
            this.carouselSwiper = swiper;
          }}>
          <div className="swiper-slide">
            <div className="rui-widget rui-widget-chart">
              <div className="rui-widget-chart-info">
                <div className="rui-widget-title h2">+14%</div>
                <small className="rui-widget-subtitle">Receitas</small>
              </div>
              <div className="rui-chartjs-container">
                <Chartist
                  className="rui-chartist rui-chartist-donut"
                  data={{
                    series: [8, 1],
                  }}
                  {...getChartistOptions()}
                />
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="rui-widget rui-widget-chart">
              <div className="rui-widget-chart-info">
                <div className="rui-widget-title h2">-10</div>
                <small className="rui-widget-subtitle">Despesas</small>
              </div>
              <div className="rui-chartjs-container">
                <Chartist
                  className="rui-chartist rui-chartist-donut"
                  data={{
                    series: [5, 5],
                  }}
                  {...getChartistOptions()}
                />
              </div>
            </div>
          </div>
          <div className="swiper-slide rui-swiper-slide-total">
            <div className="rui-widget rui-widget-chart rui-widget-total">
              <div className="rui-widget-chart-info">
                <div className="rui-widget-title h1">R$ 1.371.24</div>
                <small className="rui-widget-subtitle">Receitas</small>
              </div>
            </div>
          </div>
          <div className="swiper-slide rui-swiper-slide-total">
            <div className="rui-widget rui-widget-chart rui-widget-total">
              <div className="rui-widget-chart-info">
                <div className="rui-widget-title h1">R$ 1.371.24</div>
                <small className="rui-widget-subtitle">Despesas</small>
              </div>
            </div>
          </div>
          <div className="swiper-slide rui-swiper-slide-total">
            <div className="rui-widget rui-widget-chart rui-widget-total">
              <div className="rui-widget-chart-info">
                <div className="rui-widget-title h1">R$ 1.371.24</div>
                <small className="rui-widget-subtitle">Saldo</small>
              </div>
            </div>
          </div>
        </Swiper>
      </div>
    );
  }
}

export default Carousel;
