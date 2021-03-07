/**
 * Internal Dependencies
 */
// -> Auth
import AuthSignIn from "./AuthSignIn";
import AuthSignUp from "./AuthSignUp";

// -> Start
import Dashboard from "./Dashboard";

// -> Operacional
// --> PDV
import PdvApp from "./Operational/PdvApp";
import PdvAppPayment from "./Operational/PdvApp/Payment";
import PdvBalcao from "./Operational/PdvBalcao";
// --> Visualiza as vendas
import PDVShow from "./Operational/PdvShow";
// --> Caixa
import Cashier from "./Operational/Cashier";
// --> Relatório do dia de vendas e serviços
import PDVReport from "./Operational/Report";
// --> Ranking de vendas e serviços
import PDVRanking from "./Operational/Ranking";

// -> Financeiro
// --> Contas a pagar e a receber
import Flow from "./Financial/Flow";
// --> Contas Bancárias
import BankAccount from "./Financial/BankAccount";
import BankAccountCreate from "./Financial/BankAccount/Create";
import BankAccountUpdate from "./Financial/BankAccount/Update";
// --> Cartões de crédito
import CreditCard from "./Financial/CreditCard";
import CreditCardCreate from "./Financial/CreditCard/Create";
import CreditCardUpdate from "./Financial/CreditCard/Update";

// -> CRM
// --> Clientes
import CRMClients from "./CRM/Clients";
import CRMClientsCreate from "./CRM/Clients/Create";
import CRMClientsUpdate from "./CRM/Clients/Update";
import CRMClientsDetails from "./CRM/Clients/Details";
// --> --> schedules
import CRMClientsSchedules from "./CRM/Clients/Schedules";
import CRMClientsCalendar from "./CRM/Clients/Calendar";
// --> schedules
import CRMCalendar from "./CRM/Calendar";

// -> Relatórios
// --> Gerenciais
import ReportGerencialCashier from "./Report/Gerencial/Cashier";
import ReportGerencialCommission from "./Report/Gerencial/Commission";

// -> Adminsitrations
// --> Filiais
import Filial from "./ADM/Filial";
import FilialCreate from "./ADM/Filial/Create";
import FilialUpdate from "./ADM/Filial/Update";
// --> Perfis dos usuários
import UserProfiles from "./ADM/UserProfiles";
import UserProfilesCreate from "./ADM/UserProfiles/Create";
import UserProfilesUpdate from "./ADM/UserProfiles/Update";
// --> Usuários
import Users from "./ADM/Users";
import UsersCreate from "./ADM/Users/Create";
import UsersUpdate from "./ADM/Users/Update";
// --> Espacos
import Spaces from "./ADM/Spaces";
import SpacesCreate from "./ADM/Spaces/Create";
import SpacesUpdate from "./ADM/Spaces/Update";
// --> Produtos
import Product from "./ADM/Product";
import ProductCreate from "./ADM/Product/Create";
import ProductUpdate from "./ADM/Product/Update";
// --> Serviços
import Service from "./ADM/Service";
import ServiceCreate from "./ADM/Service/Create";
import ServiceUpdate from "./ADM/Service/Update";

export default {
  "/sign-in": AuthSignIn,
  "/sign-up": AuthSignUp,

  "/": Dashboard,

  //operacional
  "/pdv/app": PdvApp,
  "/pdv/app/pagamento/:id": PdvAppPayment,
  "/pdv/balcao/": PdvBalcao,
  "/pdv/relatorio": PDVReport,
  "/pdv/ranking": PDVRanking,
  "/pdv/show/:id": PDVShow,
  "/caixa/": Cashier,
  "/caixa/:id": Cashier,

  //financeiro
  "/lancamentos": Flow,

  "/contas/:id/relatorio": BankAccountUpdate,
  "/contas": BankAccount,
  "/contas/add": BankAccountCreate,
  "/contas/edit/:id": BankAccountUpdate,

  "/cartoes-de-credito/:id/relatorio": CreditCardUpdate,
  "/cartoes-de-credito": CreditCard,
  "/cartoes-de-credito/add": CreditCardCreate,
  "/cartoes-de-credito/edit/:id": CreditCardUpdate,

  // -> CRM
  // --> Clients
  "/crm/clientes": CRMClients,
  "/crm/clientes/add": CRMClientsCreate,
  "/crm/clientes/edit/:id": CRMClientsUpdate,
  "/crm/clientes/show/:id": CRMClientsDetails,
  // --> --> schedules
  "/crm/clientes/:id/agendamentos": CRMClientsSchedules,
  "/crm/clientes/:id/calendario": CRMClientsCalendar,
  // --> schedules
  "/crm/agenda": CRMCalendar,

  // -> Report
  // --> Gerenciais
  "/relatorios/gerenciais/caixas": ReportGerencialCashier,
  "/relatorios/gerenciais/comissoes": ReportGerencialCommission,

  //Adminstrations
  "/filiais": Filial,
  "/filiais/add": FilialCreate,
  "/filiais/edit/:id": FilialUpdate,

  "/perfis": UserProfiles,
  "/perfis/add": UserProfilesCreate,
  "/perfis/edit/:id": UserProfilesUpdate,

  "/usuarios": Users,
  "/usuarios/add": UsersCreate,
  "/usuarios/edit/:id": UsersUpdate,

  "/espacos": Spaces,
  "/espacos/add": SpacesCreate,
  "/espacos/edit/:id": SpacesUpdate,

  "/produtos": Product,
  "/produtos/add": ProductCreate,
  "/produtos/edit/:id": ProductUpdate,

  "/servicos": Service,
  "/servicos/add": ServiceCreate,
  "/servicos/edit/:id": ServiceUpdate,
};
