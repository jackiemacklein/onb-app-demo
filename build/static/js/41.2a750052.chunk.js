(this.webpackJsonpOnb=this.webpackJsonpOnb||[]).push([[41],{236:function(e,t,a){"use strict";var n=a(241),s=a.n(n),o=a(18),r=a.n(o),i=s.a.create({baseURL:"http://onb-api-demo.agenciaonside.com.br"});i.interceptors.request.use((function(e){return e.headers.Authorization="bearer "+r.a.get("rui-auth-token"),e}),(function(e){Promise.reject(e)})),t.a=i},274:function(e,t,a){"use strict";var n=a(8),s=a(9),o=a(0),r=a.n(o),i=a(1),c=a.n(i),l=a(12),u=a.n(l),d=a(6),f=c.a.oneOfType([c.a.number,c.a.string]),m=c.a.oneOfType([c.a.bool,c.a.string,c.a.number,c.a.shape({size:f,order:f,offset:f})]),p={children:c.a.node,hidden:c.a.bool,check:c.a.bool,size:c.a.string,for:c.a.string,tag:d.q,className:c.a.string,cssModule:c.a.object,xs:m,sm:m,md:m,lg:m,xl:m,widths:c.a.array},b={tag:"label",widths:["xs","sm","md","lg","xl"]},h=function(e,t,a){return!0===a||""===a?e?"col":"col-"+t:"auto"===a?e?"col-auto":"col-"+t+"-auto":e?"col-"+a:"col-"+t+"-"+a},g=function(e){var t=e.className,a=e.cssModule,o=e.hidden,i=e.widths,c=e.tag,l=e.check,f=e.size,m=e.for,p=Object(s.a)(e,["className","cssModule","hidden","widths","tag","check","size","for"]),b=[];i.forEach((function(t,n){var s=e[t];if(delete p[t],s||""===s){var o,r=!n;if(Object(d.k)(s)){var i,c=r?"-":"-"+t+"-";o=h(r,t,s.size),b.push(Object(d.m)(u()(((i={})[o]=s.size||""===s.size,i["order"+c+s.order]=s.order||0===s.order,i["offset"+c+s.offset]=s.offset||0===s.offset,i))),a)}else o=h(r,t,s),b.push(o)}}));var g=Object(d.m)(u()(t,!!o&&"sr-only",!!l&&"form-check-label",!!f&&"col-form-label-"+f,b,!!b.length&&"col-form-label"),a);return r.a.createElement(c,Object(n.a)({htmlFor:m},p,{className:g}))};g.propTypes=p,g.defaultProps=b,t.a=g},275:function(e,t,a){"use strict";var n=a(8),s=a(9),o=a(0),r=a.n(o),i=a(1),c=a.n(i),l=a(12),u=a.n(l),d=a(6),f={children:c.a.node,row:c.a.bool,check:c.a.bool,inline:c.a.bool,disabled:c.a.bool,tag:d.q,className:c.a.string,cssModule:c.a.object},m=function(e){var t=e.className,a=e.cssModule,o=e.row,i=e.disabled,c=e.check,l=e.inline,f=e.tag,m=Object(s.a)(e,["className","cssModule","row","disabled","check","inline","tag"]),p=Object(d.m)(u()(t,!!o&&"row",c?"form-check":"form-group",!(!c||!l)&&"form-check-inline",!(!c||!i)&&"disabled"),a);return"fieldset"===f&&(m.disabled=i),r.a.createElement(f,Object(n.a)({},m,{className:p}))};m.propTypes=f,m.defaultProps={tag:"div"},t.a=m},276:function(e,t,a){"use strict";var n=a(8),s=a(9),o=a(20),r=a(13),i=a(0),c=a.n(i),l=a(1),u=a.n(l),d=a(12),f=a.n(d),m=a(6),p={children:u.a.node,type:u.a.string,size:u.a.oneOfType([u.a.number,u.a.string]),bsSize:u.a.string,valid:u.a.bool,invalid:u.a.bool,tag:m.q,innerRef:u.a.oneOfType([u.a.object,u.a.func,u.a.string]),plaintext:u.a.bool,addon:u.a.bool,className:u.a.string,cssModule:u.a.object},b=function(e){function t(t){var a;return(a=e.call(this,t)||this).getRef=a.getRef.bind(Object(o.a)(a)),a.focus=a.focus.bind(Object(o.a)(a)),a}Object(r.a)(t,e);var a=t.prototype;return a.getRef=function(e){this.props.innerRef&&this.props.innerRef(e),this.ref=e},a.focus=function(){this.ref&&this.ref.focus()},a.render=function(){var e=this.props,t=e.className,a=e.cssModule,o=e.type,r=e.bsSize,i=e.valid,l=e.invalid,u=e.tag,d=e.addon,p=e.plaintext,b=e.innerRef,h=Object(s.a)(e,["className","cssModule","type","bsSize","valid","invalid","tag","addon","plaintext","innerRef"]),g=["radio","checkbox"].indexOf(o)>-1,v=new RegExp("\\D","g"),O=u||("select"===o||"textarea"===o?o:"input"),j="form-control";p?(j+="-plaintext",O=u||"input"):"file"===o?j+="-file":"range"===o?j+="-range":g&&(j=d?null:"form-check-input"),h.size&&v.test(h.size)&&(Object(m.s)('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'),r=h.size,delete h.size);var y=Object(m.m)(f()(t,l&&"is-invalid",i&&"is-valid",!!r&&"form-control-"+r,j),a);return("input"===O||u&&"function"===typeof u)&&(h.type=o),h.children&&!p&&"select"!==o&&"string"===typeof O&&"select"!==O&&(Object(m.s)('Input with a type of "'+o+'" cannot have children. Please use "value"/"defaultValue" instead.'),delete h.children),c.a.createElement(O,Object(n.a)({},h,{ref:b,className:y,"aria-invalid":l}))},t}(c.a.Component);b.propTypes=p,b.defaultProps={type:"text"},t.a=b},658:function(e,t,a){"use strict";a.r(t);var n=a(239),s=a.n(n),o=a(21),r=a(240),i=a(2),c=a(3),l=a(14),u=a(5),d=a(4),f=a(0),m=a.n(f),p=a(26),b=a(275),h=a(274),g=a(276),v=a(90),O=a(236),j=a(11),y=a(22),k=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={id:"",name:"",loading:!1},n.save=n.save.bind(Object(l.a)(n)),n}return Object(c.a)(a,[{key:"save",value:function(){var e=Object(r.a)(s.a.mark((function e(t){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a=this.props.addToast,this.setState({loading:!0}),e.prev=3,e.next=6,O.a.post("/profiles",Object(o.a)({},this.state));case 6:a({title:"Sucesso!.",content:"O Item foi salvo com sucesso.",time:new Date,duration:1e4,color:"success"}),this.setState({loading:!1}),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(3),console.log(e.t0),a({title:"Ocorreu um erro ao tentar salvar o item!.",content:"Consulte o log do navegador, ou contate o administrador.",time:new Date,duration:2e4,color:"error"}),this.setState({loading:!1});case 15:case"end":return e.stop()}}),e,this,[[3,10]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.state,a=t.name,n=t.loading;return m.a.createElement(f.Fragment,null,m.a.createElement("h2",{id:"formsBase"},"Dados da Perfil"),m.a.createElement("form",{className:"rui-snippet-preview demo form-border-effect-kie",onSubmit:this.save},m.a.createElement(b.a,null,m.a.createElement(h.a,{for:"name"},"Nome"),m.a.createElement(g.a,{type:"text",name:"name",required:!0,id:"name",placeholder:"Nome",value:a,onChange:function(t){return e.setState({name:t.target.value})}})),m.a.createElement(b.a,{className:"text-right"},m.a.createElement(v.a,{type:"submit",color:"brand",className:"btn-long",disabled:n},m.a.createElement("span",{className:"text"},n?"Gravando...":"Gravar"),n?m.a.createElement(m.a.Fragment,null):m.a.createElement("span",{className:"icon"},m.a.createElement(j.a,{name:"check"}))))))}}]),a}(f.Component);t.default=Object(p.b)((function(e){return{settings:e.settings,toasts:e.toasts}}),{addToast:y.e,removeToast:y.f})(k)}}]);
//# sourceMappingURL=41.2a750052.chunk.js.map