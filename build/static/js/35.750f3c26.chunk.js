(this["webpackJsonponb-app-demo.agenciaonside.com.br"]=this["webpackJsonponb-app-demo.agenciaonside.com.br"]||[]).push([[35],{236:function(e,a,t){"use strict";var n=t(241),i=t.n(n),r=t(18),s=t.n(r),c=i.a.create({baseURL:"https://onb-api-demo.agenciaonside.com.br"});c.interceptors.request.use((function(e){return e.headers.Authorization="bearer "+s.a.get("rui-auth-token"),e}),(function(e){Promise.reject(e)})),a.a=c},243:function(e,a,t){"use strict";t(245),t(31),t(256),t(98),t(17);var n=t(247),i=t(248),r=(t(16),t(251)),s=t(249),c=t(250),l=t(0),o=t.n(l),u=t(254),d=t(252),f=(t(27),t(99),t(234)),m=(t(246),t(257),t(253),t(258)),b=t(255);function p(e){var a=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=Object(c.a)(e);if(a){var i=Object(c.a)(this).constructor;t=Reflect.construct(n,arguments,i)}else t=n.apply(this,arguments);return Object(s.a)(this,t)}}l.Component;var h=Object(m.a)(f.a);a.a=h},245:function(e,a,t){var n=t(62);e.exports=function(e,a){if(null==e)return{};var t,i,r=n(e,a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(i=0;i<s.length;i++)t=s[i],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}},260:function(e,a,t){"use strict";var n=t(8),i=t(9),r=t(0),s=t.n(r),c=t(1),l=t.n(c),o=t(12),u=t.n(o),d=t(6),f=t(20),m=t(13),b={className:l.a.string,id:l.a.oneOfType([l.a.string,l.a.number]).isRequired,label:l.a.node,valid:l.a.bool,invalid:l.a.bool,bsSize:l.a.string,htmlFor:l.a.string,cssModule:l.a.object,onChange:l.a.func,children:l.a.oneOfType([l.a.node,l.a.array,l.a.func]),innerRef:l.a.oneOfType([l.a.object,l.a.string,l.a.func])},p=function(e){function a(a){var t;return(t=e.call(this,a)||this).state={files:null},t.onChange=t.onChange.bind(Object(f.a)(t)),t}Object(m.a)(a,e);var t=a.prototype;return t.onChange=function(e){var a=e.target,t=this.props.onChange,n=this.getSelectedFiles(a);"function"===typeof t&&t.apply(void 0,arguments),this.setState({files:n})},t.getSelectedFiles=function(e){if(this.props.multiple&&e.files)return[].slice.call(e.files).map((function(e){return e.name})).join(", ");if(-1!==e.value.indexOf("fakepath")){var a=e.value.split("\\");return a[a.length-1]}return e.value},t.render=function(){var e=this.props,a=e.className,t=e.label,r=e.valid,c=e.invalid,l=e.cssModule,o=e.children,f=(e.bsSize,e.innerRef),m=e.htmlFor,b=(e.type,e.onChange,e.dataBrowse),p=e.hidden,h=Object(i.a)(e,["className","label","valid","invalid","cssModule","children","bsSize","innerRef","htmlFor","type","onChange","dataBrowse","hidden"]),v=Object(d.m)(u()(a,"custom-file"),l),g=Object(d.m)(u()(c&&"is-invalid",r&&"is-valid"),l),O=m||h.id,j=this.state.files;return s.a.createElement("div",{className:v,hidden:p||!1},s.a.createElement("input",Object(n.a)({type:"file"},h,{ref:f,"aria-invalid":c,className:u()(g,Object(d.m)("custom-file-input",l)),onChange:this.onChange})),s.a.createElement("label",{className:Object(d.m)("custom-file-label",l),htmlFor:O,"data-browse":b},j||t||"Choose file"),o)},a}(s.a.Component);p.propTypes=b;var h=p,v={className:l.a.string,id:l.a.oneOfType([l.a.string,l.a.number]).isRequired,type:l.a.string.isRequired,label:l.a.node,inline:l.a.bool,valid:l.a.bool,invalid:l.a.bool,bsSize:l.a.string,htmlFor:l.a.string,cssModule:l.a.object,children:l.a.oneOfType([l.a.node,l.a.array,l.a.func]),innerRef:l.a.oneOfType([l.a.object,l.a.string,l.a.func])};function g(e){var a=e.className,t=e.label,r=e.inline,c=e.valid,l=e.invalid,o=e.cssModule,f=e.children,m=e.bsSize,b=e.innerRef,p=e.htmlFor,v=Object(i.a)(e,["className","label","inline","valid","invalid","cssModule","children","bsSize","innerRef","htmlFor"]),g=v.type,O=Object(d.m)(u()(a,"custom-"+g,!!m&&"custom-"+g+"-"+m),o),j=Object(d.m)(u()(l&&"is-invalid",c&&"is-valid"),o),y=p||v.id;if("select"===g){v.type;var k=Object(i.a)(v,["type"]);return s.a.createElement("select",Object(n.a)({},k,{ref:b,className:u()(j,O),"aria-invalid":l}),f)}if("file"===g)return s.a.createElement(h,e);if("checkbox"!==g&&"radio"!==g&&"switch"!==g)return s.a.createElement("input",Object(n.a)({},v,{ref:b,"aria-invalid":l,className:u()(j,O)}));var E=u()(O,Object(d.m)(u()("custom-control",{"custom-control-inline":r}),o)),_=v.hidden,S=Object(i.a)(v,["hidden"]);return s.a.createElement("div",{className:E,hidden:_||!1},s.a.createElement("input",Object(n.a)({},S,{type:"switch"===g?"checkbox":g,ref:b,"aria-invalid":l,className:u()(j,Object(d.m)("custom-control-input",o))})),s.a.createElement("label",{className:Object(d.m)("custom-control-label",o),htmlFor:y},t),f)}g.propTypes=v;a.a=g},645:function(e,a,t){"use strict";t.r(a);var n=t(21),i=t(239),r=t.n(i),s=t(240),c=t(2),l=t(3),o=t(14),u=t(5),d=t(4),f=t(0),m=t.n(f),b=t(26),p=t(275),h=t(274),v=t(276),g=t(260),O=t(90),j=t(243),y=t(19),k=t(236),E=t(11),_=t(22),S=function(e){Object(u.a)(t,e);var a=Object(d.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state={id:"",filial_id:"",bank_id:"",name:"",opening_balance:0,description:"",is_active:!0,default:!1,loading:!1,filiais:[],banks:[]},n.save=n.save.bind(Object(o.a)(n)),n.loadFiliais=n.loadFiliais.bind(Object(o.a)(n)),n.loadBanks=n.loadBanks.bind(Object(o.a)(n)),n.loadData=n.loadData.bind(Object(o.a)(n)),n}return Object(l.a)(t,[{key:"save",value:function(){var e=Object(s.a)(r.a.mark((function e(a){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),t=this.props.addToast,this.setState({loading:!0}),e.prev=3,e.next=6,k.a.put("/banks/accounts/".concat(this.state.id),{filial_id:this.state.filial_id.value,bank_id:this.state.bank_id.value,name:this.state.name,opening_balance:this.state.opening_balance,description:this.state.description,is_active:this.state.is_active,default:this.state.default});case 6:t({title:"Sucesso!.",content:"O Item foi salvo com sucesso.",time:new Date,duration:1e4,color:"success"}),this.setState({loading:!1}),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(3),e.t0.response&&e.t0.response.data&&!0===e.t0.response.data.error?alert(e.t0.response.data.more):alert("Ocorreu um erro ao tentar salvar o item"),console.log(e.t0),this.setState({loading:!1});case 15:case"end":return e.stop()}}),e,this,[[3,10]])})));return function(a){return e.apply(this,arguments)}}()},{key:"loadFiliais",value:function(){var e=Object(s.a)(r.a.mark((function e(){var a,t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k.a.get("/filiais");case 2:a=e.sent,t=a.data,this.setState({filiais:t.map((function(e){return{value:e.id,label:e.name}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadBanks",value:function(){var e=Object(s.a)(r.a.mark((function e(){var a,t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k.a.get("/banks");case 2:a=e.sent,t=a.data,this.setState({banks:t.map((function(e){return{value:e.id,label:"".concat(e.code," - ").concat(e.name)}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadData",value:function(){var e=Object(s.a)(r.a.mark((function e(){var a,t,n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.props.match.params.id,e.next=3,k.a.get("/banks/accounts/".concat(a));case 3:t=e.sent,n=t.data,this.setState({id:n.id,filial_id:{value:n.filial.id,label:n.filial.name},bank_id:{value:n.bank.id,label:"".concat(n.bank.code," - ").concat(n.bank.name)},name:n.name,opening_balance:n.opening_balance,description:n.description,is_active:n.is_active,default:n.default});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.loadFiliais(),this.loadBanks(),this.loadData()}},{key:"render",value:function(){var e=this,a=this.state,t=a.banks,i=a.filiais,r=a.loading,s={control:function(e,a){return Object(n.a)(Object(n.a)({},e),{},{borderColor:a.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0","&:hover":{borderColor:a.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0"},boxShadow:a.isFocused?"0 0 0 0.2rem rgba(114, 94, 195, 0.2)":""})},option:function(e,a){var t="";return a.isSelected?t="#725ec3":a.isFocused&&(t="rgba(114, 94, 195, 0.2)"),Object(n.a)(Object(n.a)({},e),{},{backgroundColor:t})},multiValueLabel:function(e){return Object(n.a)(Object(n.a)({},e),{},{color:"#545b61",backgroundColor:"#eeeeef"})}};return m.a.createElement(f.Fragment,null,m.a.createElement("h2",{id:"formsBase"},"Dados da Conta"),m.a.createElement("form",{className:"rui-snippet-preview demo form-border-effect-kie",onSubmit:this.save},m.a.createElement(p.a,null,m.a.createElement(h.a,{for:"filial_id"},"Filial *"),m.a.createElement(j.a,{id:"filial_id",name:"filial_id",required:!0,defaultValue:this.state.filial_id,value:this.state.filial_id,options:i,styles:s,onChange:function(a){return e.setState({filial_id:a})}})),m.a.createElement(p.a,null,m.a.createElement(h.a,{for:"filial_id"},"Banco / Institui\xe7\xe3o financeira *"),m.a.createElement(j.a,{id:"bank_id",name:"bank_id",required:!0,defaultValue:this.state.bank_id,value:this.state.bank_id,options:t,styles:s,onChange:function(a){return e.setState({bank_id:a})}})),m.a.createElement(p.a,null,m.a.createElement(h.a,{for:"name"},"Nome da Conta *"),m.a.createElement(v.a,{type:"text",name:"name",required:!0,id:"name",placeholder:"Nome",value:this.state.name,onChange:function(a){return e.setState({name:a.target.value})}})),m.a.createElement(p.a,null,m.a.createElement(h.a,{for:"unit"},"Saldo inicial [Para saldo negativo, use o sinal de '-', antes do valor.]"),m.a.createElement(v.a,{type:"text",name:"opening_balance",id:"opening_balance",placeholder:"1.989,00",value:this.state.opening_balance,onChange:function(a){return e.setState({opening_balance:a.target.value})}})),m.a.createElement(p.a,null,m.a.createElement(h.a,{for:"description"},"Descri\xe7\xe3o"),m.a.createElement(v.a,{type:"text",name:"description",id:"description",placeholder:"",value:this.state.description,onChange:function(a){return e.setState({description:a.target.value})}})),m.a.createElement(p.a,null,m.a.createElement(g.a,{type:"switch",id:"is_active",name:"is_active",label:"Ativo/Inativo",checked:this.state.is_active,onChange:function(a){return e.setState({is_active:a.target.checked})}})),m.a.createElement(p.a,null,m.a.createElement(g.a,{type:"switch",id:"default",name:"default",label:"Conta de Movimentac\xe3o Padr\xe3o/Conta Normal",checked:this.state.default,onChange:function(a){return e.setState({default:a.target.checked})}})),m.a.createElement(p.a,{className:"text-right"},m.a.createElement(O.a,{type:"submit",color:"brand",className:"btn-long",disabled:r},m.a.createElement("span",{className:"text"},r?"Gravando...":"Gravar"),r?m.a.createElement(m.a.Fragment,null):m.a.createElement("span",{className:"icon"},m.a.createElement(E.a,{name:"check"}))))))}}]),t}(f.Component);a.default=Object(b.b)((function(e){return{settings:e.settings,toasts:e.toasts}}),{addToast:_.e,removeToast:_.f})(Object(y.f)(S))}}]);
//# sourceMappingURL=35.750f3c26.chunk.js.map