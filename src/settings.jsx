/**
 * App Settings
 */
const settings = {
  night_mode: false,
  spotlight_mode: false,
  show_section_lines: true,
  sidebar_dark: false,
  sidebar_static: false,
  sidebar_small: false,
  sidebar_effect: "shrink",
  nav: false,
  nav_dark: false,
  nav_logo_path: "https://bucket.mlcdn.com/a/2639/2639447/images/e9b9e3bd27d0dfa541f286852efbf25af8f30b50.png",
  nav_logo_white_path: "https://bucket.mlcdn.com/a/2639/2639447/images/e9b9e3bd27d0dfa541f286852efbf25af8f30b50.png",
  nav_logo_width: "35px",
  nav_logo_url: "/",
  nav_align: "left",
  nav_expand: "lg",
  nav_sticky: false,
  nav_autohide: true,
  nav_container_fluid: true,
  home_url: "/",
  navigation: {},
  navigation_sidebar: {
    "/": {
      // label: "Get Started",
      name: "Dashboard",
      icon: "home",
      key: "Dashboard",
    },

    //Operacional
    "/pdv/app": {
      label: "Operacional",
      name: "Ponto de Venda",
      icon: "shopping-cart",
      key: "pdv",
      sub: {
        "/pdv/app": {
          name: "Serviços & Vendas do App",
        },
        "/pdv/balcao": {
          name: "Nova Venda Balcão",
        },
      },
    },

    "/caixa": {
      name: "Caixa",
      icon: "monitor",
      key: "caixa",
    },

    //Financeiro
    "/lancamentos": {
      label: "Financeiro",
      name: "Laçamentos",
      icon: "list",
      key: "flow",
      sub: {
        "/lancamentos": {
          name: "Contas à Pagar & à Receber",
        },
      },
    },

    "/contas": {
      name: "Contas & Carteiras",
      icon: "layers",
      key: "contas-e-carteiras",
    },

    "/cartoes-de-credito": {
      name: "Cartões de Crédito",
      icon: "credit-card",
      key: "cartoes-de-credito",
    },

    //CRMc
    "/crm/clientes": {
      label: "CRM",
      name: "Clientes",
      icon: "inbox",
      key: "clientes",
      sub: {
        "/crm/clientes": {
          name: "Listar Todos",
        },
        "/crm/clientes/add": {
          name: "Novo Cliente",
        },
      },
    },

    //CRM Calendar
    "/crm/agenda": {
      name: "Agenda de Reservas",
      icon: "calendar",
      key: "agendamentos",
    },

    //Administraçao
    /*"/clients": {
      label: "Administração",
      name: "Clientes",
      icon: "user-check",
      key: "Client",
    },
    "/sites": {
      name: "Sites",
      icon: "link",
      key: "Site",
    },*/
    "/usuarios": {
      label: "Administração",
      name: "Usuários",
      icon: "users",
      key: "User",
    },
    "/produtos": {
      name: "Produtos",
      icon: "box",
      key: "Product",
    },
    "/servicos": {
      name: "Serviços",
      icon: "pocket",
      key: "Service",
    },
    "/filiais": {
      name: "Filiais",
      icon: "radio",
      key: "Filial",
    },
    "/perfis": {
      name: "Perfils",
      icon: "user",
      key: "Profile",
    },
    "/espacos": {
      name: "Espaços/Salões",
      icon: "grid",
      key: "Space",
    },
  },
  breadcrumbs_presets: {
    /*apps: {
      "/mailbox": "Mailbox",
      "/messenger": "Messenger",
      "/calendar": "Calendar",
      "/project-management": "Project Management",
      "/file-manager": "File Manager",
      "/profile": "Profile",
    },*/
  },
  img_country: {
    usa: require("../common-assets/images/flags/united-states-of-america.svg"),
    china: require("../common-assets/images/flags/china.svg"),
    germany: require("../common-assets/images/flags/germany.svg"),
    japan: require("../common-assets/images/flags/japan.svg"),
    spain: require("../common-assets/images/flags/spain.svg"),
    france: require("../common-assets/images/flags/france.svg"),
    canada: require("../common-assets/images/flags/canada.svg"),
    netherlands: require("../common-assets/images/flags/netherlands.svg"),
    italy: require("../common-assets/images/flags/italy.svg"),
    russia: require("../common-assets/images/flags/russia.svg"),
    czech_republic: require("../common-assets/images/flags/czech-republic.svg"),
  },
  img_file: {
    empty: require("../common-assets/images/icon-empty.svg"),
    zip: require("../common-assets/images/icon-zip.svg"),
    rar: require("../common-assets/images/icon-rar.svg"),
    html: require("../common-assets/images/icon-html.svg"),
    php: require("../common-assets/images/icon-php.svg"),
    css: require("../common-assets/images/icon-css.svg"),
    js: require("../common-assets/images/icon-js.svg"),
    doc: require("../common-assets/images/icon-doc.svg"),
    txt: require("../common-assets/images/icon-txt.svg"),
    pdf: require("../common-assets/images/icon-pdf.svg"),
    xls: require("../common-assets/images/icon-xls.svg"),
    png: require("../common-assets/images/icon-png.svg"),
    jpg: require("../common-assets/images/icon-jpg.svg"),
  },
  users: [
    {
      img: require("../common-assets/images/avatar-1.png"),
      img_profile: require("../common-assets/images/avatar-1-profile.png"),
      name: "Jack Boyd",
    },
    {
      img: require("../common-assets/images/avatar-2.png"),
      name: "Helen Holt",
    },
    {
      img: require("../common-assets/images/avatar-3.png"),
      name: "Avice Harris",
    },
    {
      img: require("../common-assets/images/avatar-4.png"),
      name: "Anna Rice",
    },
    {
      img: require("../common-assets/images/avatar-5.png"),
      name: "Amber Smith",
    },
    {
      img: require("../common-assets/images/avatar-6.png"),
      name: "Mary Rose",
    },
  ],
  letters: [
    {
      img: require("../common-assets/images/letter-1.png"),
      img_min: require("../common-assets/images/letter-1-min.png"),
    },
    {
      img: require("../common-assets/images/letter-2.png"),
      img_min: require("../common-assets/images/letter-2-min.png"),
    },
    {
      img: require("../common-assets/images/letter-3.png"),
      img_min: require("../common-assets/images/letter-3-min.png"),
    },
    {
      img: require("../common-assets/images/letter-4.png"),
      img_min: require("../common-assets/images/letter-4-min.png"),
    },
  ],
};

/* Parse GET variables to change initial settings */
const $_GET = {};
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (a, name, value) => {
  $_GET[name] = value;
});

Object.keys($_GET).forEach(name => {
  const isTrue = $_GET[name] === "1";

  switch (name) {
    case "setting-night-mode":
      settings.night_mode = isTrue;
      break;
    case "setting-show-section-lines":
      settings.show_section_lines = isTrue;
      break;
    case "setting-sidebar-small":
      settings.sidebar_small = isTrue;
      break;
    case "setting-sidebar-dark":
      settings.sidebar_dark = isTrue;
      break;
    case "setting-nav-dark":
      settings.nav_dark = isTrue;
      break;
    // no default
  }
});

export default settings;
