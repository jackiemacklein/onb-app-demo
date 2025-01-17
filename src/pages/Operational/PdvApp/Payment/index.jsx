import "./style.scss";

/**
 * External Dependencies
 */
import React, { Component } from "react";

/**
 * Internal Dependencies
 */
import AsyncComponent from "../../../../components/async-component";
import PageWrap from "../../../../components/page-wrap";
import PageTitle from "../../../../components/page-title";
import PageContent from "../../../../components/page-content";

/**
 * Component
 */
class TaskPage extends Component {
  render() {
    return (
      <PageWrap>
        <PageTitle
          breadcrumbs={{
            "/": "Home",
            "/pdv/app": {
              title: "Ponto de Venda",
            },
            "/pdv/app": "Vendas&Serviços do App",
          }}>
          <h1>Pagamento</h1>
        </PageTitle>
        <PageContent>
          <AsyncComponent component={() => import("./content")} />
        </PageContent>
      </PageWrap>
    );
  }
}

export default TaskPage;
