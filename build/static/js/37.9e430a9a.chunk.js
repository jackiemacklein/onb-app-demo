(this.webpackJsonpOnb=this.webpackJsonpOnb||[]).push([[37],{236:function(e,a,t){"use strict";var n=t(241),i=t.n(n),r=t(18),l=t.n(r),c=i.a.create({baseURL:"http://onb-api-demo.agenciaonside.com.br"});c.interceptors.request.use((function(e){return e.headers.Authorization="bearer "+l.a.get("rui-auth-token"),e}),(function(e){Promise.reject(e)})),a.a=c},243:function(e,a,t){"use strict";t(245),t(31),t(256),t(98),t(17);var n=t(247),i=t(248),r=(t(16),t(251)),l=t(249),c=t(250),s=t(0),o=t.n(s),d=t(254),u=t(252),m=(t(27),t(99),t(234)),f=(t(246),t(257),t(253),t(258)),h=t(255);function p(e){var a=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=Object(c.a)(e);if(a){var i=Object(c.a)(this).constructor;t=Reflect.construct(n,arguments,i)}else t=n.apply(this,arguments);return Object(l.a)(this,t)}}s.Component;var b=Object(f.a)(m.a);a.a=b},245:function(e,a,t){var n=t(62);e.exports=function(e,a){if(null==e)return{};var t,i,r=n(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(i=0;i<l.length;i++)t=l[i],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}},260:function(e,a,t){"use strict";var n=t(8),i=t(9),r=t(0),l=t.n(r),c=t(1),s=t.n(c),o=t(12),d=t.n(o),u=t(6),m=t(20),f=t(13),h={className:s.a.string,id:s.a.oneOfType([s.a.string,s.a.number]).isRequired,label:s.a.node,valid:s.a.bool,invalid:s.a.bool,bsSize:s.a.string,htmlFor:s.a.string,cssModule:s.a.object,onChange:s.a.func,children:s.a.oneOfType([s.a.node,s.a.array,s.a.func]),innerRef:s.a.oneOfType([s.a.object,s.a.string,s.a.func])},p=function(e){function a(a){var t;return(t=e.call(this,a)||this).state={files:null},t.onChange=t.onChange.bind(Object(m.a)(t)),t}Object(f.a)(a,e);var t=a.prototype;return t.onChange=function(e){var a=e.target,t=this.props.onChange,n=this.getSelectedFiles(a);"function"===typeof t&&t.apply(void 0,arguments),this.setState({files:n})},t.getSelectedFiles=function(e){if(this.props.multiple&&e.files)return[].slice.call(e.files).map((function(e){return e.name})).join(", ");if(-1!==e.value.indexOf("fakepath")){var a=e.value.split("\\");return a[a.length-1]}return e.value},t.render=function(){var e=this.props,a=e.className,t=e.label,r=e.valid,c=e.invalid,s=e.cssModule,o=e.children,m=(e.bsSize,e.innerRef),f=e.htmlFor,h=(e.type,e.onChange,e.dataBrowse),p=e.hidden,b=Object(i.a)(e,["className","label","valid","invalid","cssModule","children","bsSize","innerRef","htmlFor","type","onChange","dataBrowse","hidden"]),v=Object(u.m)(d()(a,"custom-file"),s),g=Object(u.m)(d()(c&&"is-invalid",r&&"is-valid"),s),_=f||b.id,y=this.state.files;return l.a.createElement("div",{className:v,hidden:p||!1},l.a.createElement("input",Object(n.a)({type:"file"},b,{ref:m,"aria-invalid":c,className:d()(g,Object(u.m)("custom-file-input",s)),onChange:this.onChange})),l.a.createElement("label",{className:Object(u.m)("custom-file-label",s),htmlFor:_,"data-browse":h},y||t||"Choose file"),o)},a}(l.a.Component);p.propTypes=h;var b=p,v={className:s.a.string,id:s.a.oneOfType([s.a.string,s.a.number]).isRequired,type:s.a.string.isRequired,label:s.a.node,inline:s.a.bool,valid:s.a.bool,invalid:s.a.bool,bsSize:s.a.string,htmlFor:s.a.string,cssModule:s.a.object,children:s.a.oneOfType([s.a.node,s.a.array,s.a.func]),innerRef:s.a.oneOfType([s.a.object,s.a.string,s.a.func])};function g(e){var a=e.className,t=e.label,r=e.inline,c=e.valid,s=e.invalid,o=e.cssModule,m=e.children,f=e.bsSize,h=e.innerRef,p=e.htmlFor,v=Object(i.a)(e,["className","label","inline","valid","invalid","cssModule","children","bsSize","innerRef","htmlFor"]),g=v.type,_=Object(u.m)(d()(a,"custom-"+g,!!f&&"custom-"+g+"-"+f),o),y=Object(u.m)(d()(s&&"is-invalid",c&&"is-valid"),o),O=p||v.id;if("select"===g){v.type;var j=Object(i.a)(v,["type"]);return l.a.createElement("select",Object(n.a)({},j,{ref:h,className:d()(y,_),"aria-invalid":s}),m)}if("file"===g)return l.a.createElement(b,e);if("checkbox"!==g&&"radio"!==g&&"switch"!==g)return l.a.createElement("input",Object(n.a)({},v,{ref:h,"aria-invalid":s,className:d()(y,_)}));var E=d()(_,Object(u.m)(d()("custom-control",{"custom-control-inline":r}),o)),x=v.hidden,S=Object(i.a)(v,["hidden"]);return l.a.createElement("div",{className:E,hidden:x||!1},l.a.createElement("input",Object(n.a)({},S,{type:"switch"===g?"checkbox":g,ref:h,"aria-invalid":s,className:d()(y,Object(u.m)("custom-control-input",o))})),l.a.createElement("label",{className:Object(u.m)("custom-control-label",o),htmlFor:O},t),m)}g.propTypes=v;a.a=g},648:function(e,a,t){"use strict";t.r(a);var n=t(21),i=t(239),r=t.n(i),l=t(240),c=t(2),s=t(3),o=t(14),d=t(5),u=t(4),m=t(0),f=t.n(m),h=t(26),p=t(275),b=t(274),v=t(276),g=t(227),_=t(228),y=t(260),O=t(90),j=t(243),E=t(19),x=t(236),S=t(11),C=t(22),F=function(e){Object(d.a)(t,e);var a=Object(u.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state={id:"",filial_id:"",credit_card_flag_id:"",name:"",limit:0,closing_day:"",expiration_day:"",is_active:!0,loading:!1,filiais:[],flags:[]},n.save=n.save.bind(Object(o.a)(n)),n.loadFiliais=n.loadFiliais.bind(Object(o.a)(n)),n.loadFlags=n.loadFlags.bind(Object(o.a)(n)),n.loadData=n.loadData.bind(Object(o.a)(n)),n}return Object(s.a)(t,[{key:"save",value:function(){var e=Object(l.a)(r.a.mark((function e(a){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),t=this.props.addToast,this.setState({loading:!0}),e.prev=3,e.next=6,x.a.put("/credit-cards/".concat(this.state.id),{filial_id:this.state.filial_id.value,credit_card_flag_id:this.state.credit_card_flag_id.value,name:this.state.name,limit:this.state.limit,closing_day:this.state.closing_day,expiration_day:this.state.expiration_day,is_active:this.state.is_active});case 6:t({title:"Sucesso!.",content:"O Item foi salvo com sucesso.",time:new Date,duration:1e4,color:"success"}),this.setState({loading:!1}),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(3),console.log(e.t0),t({title:"Ocorreu um erro ao tentar salvar o item!.",content:"Consulte o log do navegador, ou contate o administrador.",time:new Date,duration:2e4,color:"error"}),this.setState({loading:!1});case 15:case"end":return e.stop()}}),e,this,[[3,10]])})));return function(a){return e.apply(this,arguments)}}()},{key:"loadFiliais",value:function(){var e=Object(l.a)(r.a.mark((function e(){var a,t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x.a.get("/filiais");case 2:a=e.sent,t=a.data,this.setState({filiais:t.map((function(e){return{value:e.id,label:e.name}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadFlags",value:function(){var e=Object(l.a)(r.a.mark((function e(){var a,t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x.a.get("/credit-cards/flags");case 2:a=e.sent,t=a.data,this.setState({flags:t.map((function(e){return{value:e.id,label:e.name}}))});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadData",value:function(){var e=Object(l.a)(r.a.mark((function e(){var a,t,n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.props.match.params.id,e.next=3,x.a.get("/credit-cards/".concat(a));case 3:t=e.sent,n=t.data,this.setState({id:n.id,filial_id:{value:n.filial.id,label:n.filial.name},credit_card_flag_id:{value:n.credit_card_flag.id,label:n.credit_card_flag.name},name:n.name,limit:n.limit,closing_day:n.closing_day,expiration_day:n.expiration_day,is_active:n.is_active});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.loadFiliais(),this.loadFlags(),this.loadData()}},{key:"render",value:function(){var e=this,a=this.state,t=a.flags,i=a.filiais,r=a.loading,l={control:function(e,a){return Object(n.a)(Object(n.a)({},e),{},{borderColor:a.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0","&:hover":{borderColor:a.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0"},boxShadow:a.isFocused?"0 0 0 0.2rem rgba(114, 94, 195, 0.2)":""})},option:function(e,a){var t="";return a.isSelected?t="#725ec3":a.isFocused&&(t="rgba(114, 94, 195, 0.2)"),Object(n.a)(Object(n.a)({},e),{},{backgroundColor:t})},multiValueLabel:function(e){return Object(n.a)(Object(n.a)({},e),{},{color:"#545b61",backgroundColor:"#eeeeef"})}};return f.a.createElement(m.Fragment,null,f.a.createElement("h2",{id:"formsBase"},"Informa\xe7\xf5es de seu Cart\xe3o"),f.a.createElement("form",{className:"rui-snippet-preview demo form-border-effect-kie",onSubmit:this.save},f.a.createElement(p.a,null,f.a.createElement(b.a,{for:"filial_id"},"Filial *"),f.a.createElement(j.a,{id:"filial_id",name:"filial_id",required:!0,defaultValue:this.state.filial_id,value:this.state.filial_id,options:i,styles:l,onChange:function(a){return e.setState({filial_id:a})}})),f.a.createElement(p.a,null,f.a.createElement(b.a,{for:"credit_card_flag_id"},"Bandeira / Institui\xe7\xe3o financeira *"),f.a.createElement(j.a,{id:"credit_card_flag_id",name:"credit_card_flag_id",required:!0,defaultValue:this.state.credit_card_flag_id,value:this.state.credit_card_flag_id,options:t,styles:l,onChange:function(a){return e.setState({credit_card_flag_id:a})}})),f.a.createElement(p.a,null,f.a.createElement(b.a,{for:"name"},"Nome do Cart\xe3o * [Informe um nome para identificar seu cart\xe3o.]"),f.a.createElement(v.a,{type:"text",name:"name",required:!0,id:"name",placeholder:"Nome",value:this.state.name,onChange:function(a){return e.setState({name:a.target.value})}})),f.a.createElement(g.a,null,f.a.createElement(_.a,{xs:6},f.a.createElement(p.a,null,f.a.createElement(b.a,{for:"closing_day"},"Fecha dia *"),f.a.createElement(v.a,{type:"number",name:"closing_day",id:"closing_day",placeholder:"",min:1,max:31,value:this.state.closing_day,onChange:function(a){return e.setState({closing_day:a.target.value})}}))),f.a.createElement(_.a,{xs:6},f.a.createElement(p.a,null,f.a.createElement(b.a,{for:"expiration_day"},"Vence dia *"),f.a.createElement(v.a,{type:"number",name:"expiration_day",id:"expiration_day",placeholder:"",min:1,max:31,value:this.state.expiration_day,onChange:function(a){return e.setState({expiration_day:a.target.value})}})))),f.a.createElement(p.a,null,f.a.createElement(b.a,{for:"limit"},"Limite *"),f.a.createElement(v.a,{type:"text",name:"limit",id:"limit",placeholder:"12.989,00",value:this.state.limit,onChange:function(a){return e.setState({limit:a.target.value})}})),f.a.createElement(p.a,null,f.a.createElement(y.a,{type:"switch",id:"is_active",name:"is_active",label:"Ativo/Inativo",checked:this.state.is_active,onChange:function(a){return e.setState({is_active:a.target.checked})}})),f.a.createElement(p.a,{className:"text-right"},f.a.createElement(O.a,{type:"submit",color:"brand",className:"btn-long",disabled:r},f.a.createElement("span",{className:"text"},r?"Gravando...":"Gravar"),r?f.a.createElement(f.a.Fragment,null):f.a.createElement("span",{className:"icon"},f.a.createElement(S.a,{name:"check"}))))))}}]),t}(m.Component);a.default=Object(h.b)((function(e){return{settings:e.settings,toasts:e.toasts}}),{addToast:C.e,removeToast:C.f})(Object(E.f)(F))}}]);
//# sourceMappingURL=37.9e430a9a.chunk.js.map