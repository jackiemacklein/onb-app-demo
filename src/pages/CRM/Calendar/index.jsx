/**
 * External Dependencies
 */
import React, { Component } from "react";

/**
 * Internal Dependencies
 */
import AsyncComponent from "../../../components/async-component";
import PageWrap from "../../../components/page-wrap";
import PageTitle from "../../../components/page-title";
import PageContent from "../../../components/page-content";

/**
 * Component
 */
class CalendarPage extends Component {
  render() {
    return (
      <PageWrap>
        <PageTitle
          breadcrumbs={{
            "/": "Home",
            "/crm/clientes": "CRM",
          }}>
          <h1>Agenda de Reservas</h1>
        </PageTitle>
        <PageContent>
          <AsyncComponent component={() => import("./content")} />
        </PageContent>
      </PageWrap>
    );
  }
}

export default CalendarPage;
