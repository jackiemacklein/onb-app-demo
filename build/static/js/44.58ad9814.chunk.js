(this.webpackJsonpOnb=this.webpackJsonpOnb||[]).push([[44],{236:function(e,t,a){"use strict";var n=a(241),i=a.n(n),s=a(18),l=a.n(s),r=i.a.create({baseURL:"http://onb-api-demo.agenciaonside.com.br"});r.interceptors.request.use((function(e){return e.headers.Authorization="bearer "+l.a.get("rui-auth-token"),e}),(function(e){Promise.reject(e)})),t.a=r},580:function(e,t,a){},653:function(e,t,a){"use strict";a.r(t);var n=a(36),i=a(21),s=a(239),l=a.n(s),r=a(240),o=a(2),c=a(3),d=a(14),u=a(5),h=a(4),m=(a(319),a(391),a(580),a(0)),f=a.n(m),v=a(26),b=a(400),p=a(320),g=a(392),_=a(393),E=a(399),O=a(268),S=a(266),y=a(267),j=a(90),k=a(275),w=a(274),C=a(276),x=a(243),N=a(673),D=a(636),A=a(11),F=a(236),T=a(22),V=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={options:{locale:"pt-br",initialView:"listWeek",expandRows:!0,plugins:[p.b,g.a,_.a,E.a],headerToolbar:{end:"newCustomButton,today,prev,next",center:"title",start:"dayGridMonth,listWeek"},events:[],customButtons:{newCustomButton:{text:"NOVA RESERVA",click:function(){return n.handleNewSchedule(Object(d.a)(n))}}}},events:[],id:"",schedule_id:"",data:{name:"",phone:"",email:"",cpf:"",profile:{name:""},schedules:[]},modalOpen:!1,user_id:"",filial_id:"",client_id:"",client_name:"",date:"",obs:"",filiais:[],users:[],clients:[],loading:!1,states:[{value:"scheduled",label:"Agendado"},{value:"canceled",label:"Cancelado"},{value:"realized",label:"Realizado"}]},n.loadData=n.loadData.bind(Object(d.a)(n)),n.toggle=n.toggle.bind(Object(d.a)(n)),n.loadUsers=n.loadUsers.bind(Object(d.a)(n)),n.loadClients=n.loadClients.bind(Object(d.a)(n)),n.loadFiliais=n.loadFiliais.bind(Object(d.a)(n)),n.handleSchedule=n.handleSchedule.bind(Object(d.a)(n)),n.handleScheduleSave=n.handleScheduleSave.bind(Object(d.a)(n)),n.handleNewSchedule=n.handleNewSchedule.bind(Object(d.a)(n)),n}return Object(c.a)(a,[{key:"loadData",value:function(){var e=Object(r.a)(l.a.mark((function e(){var t,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("crm/schedules/");case 2:t=e.sent,a=t.data,this.setState({data:a,events:a.map((function(e){var t;return{id:e.id,title:null===e||void 0===e||null===(t=e.client)||void 0===t?void 0:t.name,start:Object(N.a)(Object(D.a)(e.date),"yyyy'-'MM'-'dd'T'HH:mm"),allDay:!1,className:"fc-event-".concat(e.state),schedule:e}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"toggle",value:function(){this.setState((function(e){return{modalOpen:!e.modalOpen}}))}},{key:"loadUsers",value:function(){var e=Object(r.a)(l.a.mark((function e(){var t,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("users/");case 2:t=e.sent,a=t.data,this.setState({users:a.map((function(e){return{value:e.id,label:e.name}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadFiliais",value:function(){var e=Object(r.a)(l.a.mark((function e(){var t,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("filiais/");case 2:t=e.sent,a=t.data,this.setState({filiais:a.map((function(e){return{value:e.id,label:e.name}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadClients",value:function(){var e=Object(r.a)(l.a.mark((function e(){var t,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("crm/clients/?is_active=true");case 2:t=e.sent,a=t.data,this.setState({clients:a.map((function(e){return{value:e.id,label:e.name}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"handleSchedule",value:function(e){var t,a,n,i,s,l,r,o,c,d={value:null===(t=e=this.state.data.find((function(t){return t.id==e.event.id})))||void 0===t?void 0:t.user_id,label:null===(a=e)||void 0===a||null===(n=a.user)||void 0===n?void 0:n.name},u={value:null===(i=e)||void 0===i?void 0:i.client_id,label:null===(s=e)||void 0===s||null===(l=s.client)||void 0===l?void 0:l.name},h={value:null===(r=e)||void 0===r?void 0:r.filial_id,label:null===(o=e)||void 0===o||null===(c=o.filial)||void 0===c?void 0:c.name},m=this.state.states.find((function(t){return t.value===e.state})),f=Object(N.a)(Object(D.a)(e.date),"yyyy'-'MM'-'dd'T'HH:mm");this.setState({schedule_id:e.id,user_id:d,client_id:u,filial_id:h,date:f,obs:e.obs,state:m}),this.toggle()}},{key:"handleNewSchedule",value:function(e){e.setState({schedule_id:"",user_id:"",client_id:"",filial_id:"",date:"",obs:"",state:""}),e.toggle()}},{key:"handleScheduleSave",value:function(){var e=Object(r.a)(l.a.mark((function e(t){var a,n,i;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),a=this.props.addToast,this.state.date&&this.state.filial_id&&this.state.user_id&&this.state.client_id){e.next=5;break}return alert("Os campos CLIENTE, DATA, FILIAL E ATENDENTE s\xe3o obrigat\xf3rios."),e.abrupt("return",!1);case 5:if(e.prev=5,this.setState({loading:!0}),!this.state.schedule_id){e.next=16;break}return e.next=10,F.a.put("/crm/schedules/".concat(this.state.schedule_id),{client_id:this.state.client_id.value,user_id:this.state.user_id.value,filial_id:this.state.filial_id.value,date:this.state.date,obs:this.state.obs,state:this.state.state.value});case 10:n=e.sent,n.data,this.toggle(),a({title:"Sucesso!.",content:"Agendamento atualizado com sucesso.",time:new Date,duration:1e4,color:"success"}),e.next=22;break;case 16:return e.next=18,F.a.post("/crm/schedules/",{client_id:this.state.client_id.value,user_id:this.state.user_id.value,filial_id:this.state.filial_id.value,date:this.state.date,obs:this.state.obs,state:this.state.state.value});case 18:i=e.sent,i.data,this.toggle(),a({title:"Sucesso!.",content:"Agendamento adicionado com sucesso.",time:new Date,duration:1e4,color:"success"});case 22:this.loadData(),e.next=29;break;case 25:e.prev=25,e.t0=e.catch(5),e.t0.response&&e.t0.response.data&&!0===e.t0.response.data.error?alert(e.t0.response.data.more):alert("Erro ao atualizar agendamento"),console.log(e.t0);case 29:this.setState({loading:!1});case 30:case"end":return e.stop()}}),e,this,[[5,25]])})));return function(t){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.loadData(),this.loadUsers(),this.loadFiliais(),this.loadClients()}},{key:"render",value:function(){var e=this,t=this.state,a=t.options,s=t.events;a.events=s;var l={control:function(e,t){return Object(i.a)(Object(i.a)({},e),{},{borderColor:t.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0","&:hover":{borderColor:t.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0"},boxShadow:t.isFocused?"0 0 0 0.2rem rgba(114, 94, 195, 0.2)":""})},option:function(e,t){var a="";return t.isSelected?a="#725ec3":t.isFocused&&(a="rgba(114, 94, 195, 0.2)"),Object(i.a)(Object(i.a)({},e),{},{backgroundColor:a})},multiValueLabel:function(e){return Object(i.a)(Object(i.a)({},e),{},{color:"#545b61",backgroundColor:"#eeeeef"})}};return f.a.createElement(m.Fragment,null,f.a.createElement("div",{className:"rui-calendar rui-calendar-navs"},f.a.createElement(b.a,Object(n.a)({},a,{eventClick:this.handleSchedule}))),f.a.createElement(O.a,{isOpen:this.state.modalOpen,toggle:this.toggle,className:this.props.className,fade:!0},f.a.createElement("form",{onSubmit:this.handleScheduleSave},f.a.createElement("div",{className:"modal-header"},f.a.createElement("h5",{className:"modal-title h2"},"Agendamento"),f.a.createElement(j.a,{className:"close",color:"",onClick:this.toggle},f.a.createElement(A.a,{name:"x"}))),f.a.createElement(S.a,null,"Preencha corretamente os campos a seguir",f.a.createElement("br",null),f.a.createElement("br",null),f.a.createElement(k.a,null,f.a.createElement(w.a,{for:"state"},"Situa\xe7\xe3o *"),f.a.createElement(x.a,{id:"state",name:"state",required:!0,defaultValue:this.state.state,options:this.state.states,styles:l,onChange:function(t){return e.setState({state:t})}})),f.a.createElement(k.a,null,f.a.createElement(w.a,{for:"client_id"},"Cliente *"),f.a.createElement(x.a,{id:"client_id",name:"client_id",required:!0,defaultValue:this.state.client_id,options:this.state.clients,styles:l,onChange:function(t){return e.setState({client_id:t})}})),f.a.createElement(k.a,null,f.a.createElement(w.a,{for:"filial_id"},"Filial *"),f.a.createElement(x.a,{id:"filial_id",name:"filial_id",required:!0,defaultValue:this.state.filial_id,options:this.state.filiais,styles:l,onChange:function(t){return e.setState({filial_id:t})}})),f.a.createElement(k.a,null,f.a.createElement(w.a,{for:"user_id"},"Atendente *"),f.a.createElement(x.a,{id:"user_id",name:"user_id",required:!0,defaultValue:this.state.user_id,options:this.state.users,styles:l,onChange:function(t){return e.setState({user_id:t})}})),f.a.createElement(k.a,null,f.a.createElement(w.a,{for:"date"},"Data e Hora *"),f.a.createElement(C.a,{id:"date",name:"date",required:!0,min:new Date,placeholder:"01/01/2021",type:"datetime-local",value:this.state.date,onChange:function(t){return e.setState({date:t.target.value})}})),f.a.createElement(k.a,null,f.a.createElement(w.a,{for:"obs"},"Observa\xe7\xf5es"),f.a.createElement(C.a,{id:"obs",name:"obs",placeholder:"",type:"text",value:this.state.obs,onChange:function(t){return e.setState({obs:t.target.value})}}))),f.a.createElement(y.a,null,f.a.createElement(j.a,{color:"secondary",type:"button",onClick:this.toggle,disabled:this.state.loading},"Fechar")," ",f.a.createElement(j.a,{color:"success",type:"submit",disabled:this.state.loading},this.state.loading?"Salvando...":"Salvar")))))}}]),a}(m.Component);t.default=Object(v.b)((function(e){return{settings:e.settings,toasts:e.toasts}}),{addToast:T.e,removeToast:T.f})(V)}}]);
//# sourceMappingURL=44.58ad9814.chunk.js.map