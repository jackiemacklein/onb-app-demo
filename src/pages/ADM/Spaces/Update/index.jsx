/**
 * Style
 */
import "../style.scss";

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
class FormsBasePage extends Component {
  render() {
    return (
      <PageWrap>
        <PageTitle
          breadcrumbs={{
            "/": "Home",
            "/espacos": "Espaços de Venda/Serviços",
          }}>
          <h1>Editar Espaço</h1>
        </PageTitle>
        <PageContent>
          <AsyncComponent component={() => import("./content")} />
        </PageContent>
      </PageWrap>
    );
  }
}

export default FormsBasePage;
