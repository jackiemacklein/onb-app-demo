(this.webpackJsonpOnb=this.webpackJsonpOnb||[]).push([[53],{236:function(t,e,a){"use strict";var n=a(241),i=a.n(n),s=a(18),c=a.n(s),o=i.a.create({baseURL:"http://onb-api-demo.agenciaonside.com.br"});o.interceptors.request.use((function(t){return t.headers.Authorization="bearer "+c.a.get("rui-auth-token"),t}),(function(t){Promise.reject(t)})),e.a=o},639:function(t,e,a){"use strict";a.r(e);var n=a(21),i=a(239),s=a.n(i),c=a(240),o=a(2),l=a(3),r=a(14),d=a(5),u=a(4),m=a(0),h=a.n(m),p=a(26),_=a(19),g=a(90),A=a(227),E=a(228),C=a(274),v=a(361),f=a(638),k=a(362),S=a(363),y=a(364),I=a(275),b=a(276),B=a(268),Q=a(266),O=a(267),w=(a(18),a(365)),N=a(11),J=a(236),x=a(22),D=function(t){Object(d.a)(a,t);var e=Object(u.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).state={modalNewClientOpen:!1,modalEditOpen:!1,modalPaymentOpen:!1,inputValue:"",data:[],payment_methods:[],updateValues:!1,cancelPassword:"",canceling:!1,paying:!1,payment_method_text:"",payment_method_id:"",coupon:"",item_edit_id:"",item_edit_name:"",item_edit_count:"",item_edit_stock:"",item_edit_value:"",item_edit_discount_amount:"",item_edit_discount_percentage:"",item_edit_maximum_discount:0,item_edit_amount:"",item_edit_type:"",client_id:{},client_name:"",client_phone:"",client_cpf:"",client_email:"",loading:!1},n.loadData=n.loadData.bind(Object(r.a)(n)),n.loadPaymentMethods=n.loadPaymentMethods.bind(Object(r.a)(n)),n.getState=n.getState.bind(Object(r.a)(n)),n.getColor=n.getColor.bind(Object(r.a)(n)),n.handleAddProduct=n.handleAddProduct.bind(Object(r.a)(n)),n.handleAddService=n.handleAddService.bind(Object(r.a)(n)),n.handleCancelSaleCart=n.handleCancelSaleCart.bind(Object(r.a)(n)),n.toggleModalCancelOpen=n.toggleModalCancelOpen.bind(Object(r.a)(n)),n.toggleModalPaymentOpen=n.toggleModalPaymentOpen.bind(Object(r.a)(n)),n.toggleModalEditOpen=n.toggleModalEditOpen.bind(Object(r.a)(n)),n.handlePay=n.handlePay.bind(Object(r.a)(n)),n.handleCloseSaleCart=n.handleCloseSaleCart.bind(Object(r.a)(n)),n.handleChangeCountItem=n.handleChangeCountItem.bind(Object(r.a)(n)),n.handleEditProductInSale=n.handleEditProductInSale.bind(Object(r.a)(n)),n.handleRecalcValuesItem=n.handleRecalcValuesItem.bind(Object(r.a)(n)),n.handleCalcDiscountByAmount=n.handleCalcDiscountByAmount.bind(Object(r.a)(n)),n.handleCalcDiscountByPercent=n.handleCalcDiscountByPercent.bind(Object(r.a)(n)),n.handleEditSaleCart=n.handleEditSaleCart.bind(Object(r.a)(n)),n.handleEditServiceInSale=n.handleEditServiceInSale.bind(Object(r.a)(n)),n.handleDeleteItemCart=n.handleDeleteItemCart.bind(Object(r.a)(n)),n.filterClient=n.filterClient.bind(Object(r.a)(n)),n.loadClients=n.loadClients.bind(Object(r.a)(n)),n.handleInputChange=n.handleInputChange.bind(Object(r.a)(n)),n.toggleModalNewClientOpen=n.toggleModalNewClientOpen.bind(Object(r.a)(n)),n.handleSaveNewClient=n.handleSaveNewClient.bind(Object(r.a)(n)),n}return Object(l.a)(a,[{key:"toggleModalNewClientOpen",value:function(){this.setState((function(t){return{modalNewClientOpen:!t.modalNewClientOpen,client_name:"",client_cpf:"",client_phone:""}}))}},{key:"loadData",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,J.a.get("/new/sales/");case 3:e=t.sent,a=e.data,this.setState({data:a}),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),console.log(t.t0);case 11:case"end":return t.stop()}}),t,this,[[0,8]])})));return function(){return t.apply(this,arguments)}}()},{key:"filterClient",value:function(){var t=Object(c.a)(s.a.mark((function t(e,a){var n,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=this.props,i=n.addToast,n.history,""==e){t.next=11;break}if(!(e.length>=2)){t.next=10;break}return t.t0=a,t.next=6,this.loadClients(e);case 6:t.t1=t.sent,(0,t.t0)(t.t1),t.next=11;break;case 10:i({title:"Aten\xe7\xe3o!",content:"Digite ao menos 2 letras para pesquisar",time:new Date,duration:5e3,color:"warning"});case 11:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"loadClients",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a,n,i,c;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=this.props,n=a.addToast,a.history,t.prev=1,t.next=4,J.a.get("/crm/clients/?term=".concat(e));case 4:return i=t.sent,c=i.data,t.abrupt("return",c.map((function(t){return{value:t.id,label:"".concat(t.cpf?"[".concat(t.cpf,"] - "):t.phone?"[".concat(t.phone,"] - "):"").concat(t.name)}})));case 9:t.prev=9,t.t0=t.catch(1),n({title:"Erro!",content:"Ocorreu um erro ao buscar cliente",time:new Date,duration:12e3,color:"danger"}),console.log(t.t0);case 13:case"end":return t.stop()}}),t,this,[[1,9]])})));return function(e){return t.apply(this,arguments)}}()},{key:"handleInputChange",value:function(t){var e=t;return this.setState({inputValue:e}),e}},{key:"loadPaymentMethods",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,J.a.get("/payment_methods/");case 3:e=t.sent,a=e.data,this.setState({payment_methods:a}),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),console.log(t.t0);case 11:case"end":return t.stop()}}),t,this,[[0,8]])})));return function(){return t.apply(this,arguments)}}()},{key:"handleAddProduct",value:function(t){var e=this.state.data.additionals.products.find((function(e){return e.id===t}));if(e)if(e.stock<=0)alert("Estoque indispon\xedvel");else{var a=1;this.state.data.products.find((function(e){return e.product_id===t}))?this.state.data.products.map((function(e){e.product_id===t&&(e.count=e.count+1,e.discount_amount?e.amount=(e.unit_value-e.discount_amount)*e.count:e.amount=e.unit_value*e.count,a=e.count)})):this.state.data.products.push({amount:e.sale_price,count:1,discount_amount:null,discount_percentage:null,product_id:e.id,sale_id:this.state.data.id,unit_value:e.sale_price,product:e}),this.state.data.additionals.products.map((function(e){e.virtual_stock||(e.virtual_stock=e.stock),e.id===t&&(e.stock=e.virtual_stock-a)})),this.setState({data:this.state.data}),this.setState({updateValues:!this.state.updateValues})}else alert("Erro desconhecido")}},{key:"handleAddService",value:function(t){var e=this.state.data.additionals.services.find((function(e){return e.id===t}));if(e){this.state.data.services.find((function(e){return e.service_id===t}))?this.state.data.services.map((function(e){e.service_id===t&&(e.count=e.count+1,e.discount_amount?e.amount=(e.unit_value-e.discount_amount)*e.count:e.amount=e.unit_value*e.count,e.count)})):this.state.data.services.push({amount:e.value.price,count:1,discount_amount:null,discount_percentage:null,service_id:e.id,sale_id:this.state.data.id,unit_value:e.value.price,service:e}),this.setState({data:this.state.data}),this.setState({updateValues:!this.state.updateValues})}else alert("Erro desconhecido")}},{key:"handleCancelSaleCart",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a,n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e=this.props,a=e.addToast,n=e.history,this.state.cancelPassword){t.next=5;break}return this.toggleModalCancelOpen(),a({title:"Digite a Senha",content:"Por favor, informe sua senha de acesso.",time:new Date,duration:12e3,color:"warning"}),t.abrupt("return",!1);case 5:return this.setState({canceling:!0}),t.prev=6,t.next=9,J.a.post("/sale/cancel/".concat(this.state.data.id),{password:this.state.cancelPassword});case 9:a({title:"Sucesso!",content:"Venda/Servi\xe7o Cancelada(o) com sucesso.",time:new Date,duration:12e3,color:"success"}),n.push("/pdv/app"),t.next=18;break;case 13:t.prev=13,t.t0=t.catch(6),t.t0.response?t.t0.response.status&&401==t.t0.response.status&&a({title:"Acesso Negado!",content:"Desculpe, n\xe3o foi possivel cancelar a(o) venda/servico!",time:new Date,duration:12e3,color:"warning"}):a({title:"Erro desconhecido!",content:"Desculpe, Tente novamente",time:new Date,duration:12e3,color:"error"}),this.setState({cancelPassword:"",canceling:!1}),this.toggleModalCancelOpen();case 18:case"end":return t.stop()}}),t,this,[[6,13]])})));return function(){return t.apply(this,arguments)}}()},{key:"handleCloseSaleCart",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a,n,i,c;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=this.props,n=a.addToast,i=a.history,!((c={client_id:null!==(e=this.state.client_id.value)&&void 0!==e?e:"",value:this.state.data.amount,amount:this.state.data.amount,discount_amount:this.state.data.discount_amount,discount_percentage:this.state.data.discount_percentage,origin:this.state.data.origin,payment_method_id:this.state.payment_method_id,state:"closed",coupon:this.state.coupon,services:this.state.data.services.filter((function(t){return t.count>0})),products:this.state.data.products.filter((function(t){return t.count>0}))}).services.length>0||c.products.length>0)){t.next=19;break}return this.setState({paying:!0}),t.prev=4,t.next=7,J.a.post("/new/sales/",c);case 7:n({title:"Pagamento Realizado",content:"O Pagamento foi realizado com sucesso",time:new Date,duration:12e3,color:"success"}),i.push("/pdv/app"),t.next=16;break;case 11:t.prev=11,t.t0=t.catch(4),console.log(t.t0),n({title:"Erro!",content:"Tente novamente, erro ao efetuar pagamento",time:new Date,duration:15e3,color:"error"}),this.toggleModalPaymentOpen();case 16:this.setState({paying:!1,coupon:""}),t.next=22;break;case 19:return this.toggleModalPaymentOpen(),n({title:"Carrinho Vazio",content:"Por favor, adicione ao menos um servi\xe7o ou produto para eftuar o Pagamento.",time:new Date,duration:12e3,color:"warning"}),t.abrupt("return",!1);case 22:case"end":return t.stop()}}),t,this,[[4,11]])})));return function(){return t.apply(this,arguments)}}()},{key:"handlePay",value:function(){var t=Object(c.a)(s.a.mark((function t(e,a){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.setState({payment_method_text:a,payment_method_id:e}),this.toggleModalPaymentOpen();case 2:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"handleChangeCountItem",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a,n,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(e=parseInt(e))>0?e>this.state.item_edit_stock?(this.setState({item_edit_count:this.state.item_edit_stock}),alert("".concat(this.state.item_edit_stock," \xe9 quantidade m\xe1xima em estoque")),a=(this.state.item_edit_value-this.state.item_edit_discount_amount)*this.state.item_edit_stock,this.setState({item_edit_amount:a})):(n=(this.state.item_edit_value-this.state.item_edit_discount_amount)*e,this.setState({item_edit_amount:n,item_edit_count:e})):(this.setState({item_edit_count:1}),i=1*(this.state.item_edit_value-this.state.item_edit_discount_amount),this.setState({item_edit_amount:i}));case 2:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"handleRecalcValuesItem",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a,n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.state.item_edit_count>0?this.state.item_edit_count>this.state.item_edit_stock?(this.setState({item_edit_count:this.state.item_edit_stock}),alert("".concat(this.state.item_edit_stock," \xe9 quantidade m\xe1xima em estoque")),e=(this.state.item_edit_value-this.state.item_edit_discount_amount)*this.state.item_edit_stock,this.setState({item_edit_amount:e})):(a=(this.state.item_edit_value-this.state.item_edit_discount_amount)*this.state.item_edit_count,this.setState({item_edit_amount:a,item_edit_count:this.state.item_edit_count})):(this.setState({item_edit_count:1}),n=1*(this.state.item_edit_value-this.state.item_edit_discount_amount),this.setState({item_edit_amount:n}));case 1:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"handleEditProductInSale",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a=this;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.setState({item_edit_type:"products"}),this.state.data.products.map((function(t){if(t.product_id===e){var n,i,s,c,o=a.state.data.additionals.products.find((function(e){return e.id===t.product_id}));o.virtual_stock?o.virtual_stock=o.virtual_stock:o.virtual_stock=o.stock-t.count,a.setState({item_edit_id:t.product_id}),a.setState({item_edit_name:"".concat(t.product.name," (R$ ").concat(null===(n=t.unit_value)||void 0===n?void 0:n.toLocaleString(),")")}),a.setState({item_edit_count:t.count}),a.setState({item_edit_stock:o.virtual_stock}),a.setState({item_edit_value:t.unit_value}),a.setState({item_edit_discount_amount:null!==(i=t.discount_amount)&&void 0!==i?i:0}),a.setState({item_edit_discount_percentage:null!==(s=t.discount_percentage)&&void 0!==s?s:0}),a.setState({item_edit_maximum_discount:null!==(c=t.product.maximum_discount)&&void 0!==c?c:0}),a.setState({item_edit_amount:t.amount})}})),this.toggleModalEditOpen();case 3:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"handleEditServiceInSale",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a=this;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.setState({item_edit_type:"services"}),this.state.data.services.map((function(t){var n,i,s;t.service_id===e&&(a.setState({item_edit_id:t.service_id}),a.setState({item_edit_name:"".concat(t.service.name," (R$ ").concat(null===(n=t.unit_value)||void 0===n?void 0:n.toLocaleString(),")")}),a.setState({item_edit_count:t.count}),a.setState({item_edit_stock:1e7}),a.setState({item_edit_value:t.unit_value}),a.setState({item_edit_discount_amount:null!==(i=t.discount_amount)&&void 0!==i?i:0}),a.setState({item_edit_discount_percentage:null!==(s=t.discount_percentage)&&void 0!==s?s:0}),a.setState({item_edit_maximum_discount:100}),a.setState({item_edit_amount:t.amount}))})),this.toggleModalEditOpen();case 3:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"handleCalcDiscountByAmount",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=100*parseFloat(e)/this.state.item_edit_value,this.setState({item_edit_discount_percentage:a,item_edit_discount_amount:e}),this.handleRecalcValuesItem();case 3:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"handleCalcDiscountByPercent",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e/100*this.state.item_edit_value,t.next=3,this.setState({item_edit_discount_amount:a,item_edit_discount_percentage:e});case 3:this.handleRecalcValuesItem();case 4:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"handleEditSaleCart",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a=this;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:0===this.state.item_edit_maximum_discount&&this.state.item_edit_discount_percentage>0?(alert("N\xe3o \xe9 permitido aplicar descontos nesse produto"),this.handleCalcDiscountByPercent(0)):this.state.item_edit_discount_percentage>this.state.item_edit_maximum_discount?(alert("A porcentagem m\xe1xima de desconto \xe9 de: ".concat(null===(e=this.state.item_edit_maximum_discount)||void 0===e?void 0:e.toLocaleString(),"%")),this.setState({item_edit_discount_percentage:this.state.item_edit_maximum_discount}),this.handleCalcDiscountByPercent(this.state.item_edit_maximum_discount)):("products"===this.state.item_edit_type?(this.state.data.products.map((function(t,e){if(t.product_id===a.state.item_edit_id){var i=a.state.data.additionals.products.find((function(e){return e.id===t.product_id}));i=i.virtual_stock?i.virtual_stock:i.stock,a.state.data.products[e]=Object(n.a)(Object(n.a)({},t),{},{count:a.state.item_edit_count,amount:a.state.item_edit_amount,discount_amount:a.state.item_edit_discount_amount,discount_percentage:a.state.item_edit_discount_percentage,stock:i-a.state.item_edit_count})}})),this.state.data.additionals.products.map((function(t){t.virtual_stock||(t.virtual_stock=t.stock),t.id===a.state.item_edit_id&&(t.stock=t.virtual_stock-a.state.item_edit_count)})),this.setState({data:this.state.data})):"services"===this.state.item_edit_type&&this.state.data.services.map((function(t,e){t.service_id===a.state.item_edit_id&&(a.state.data.services[e]=Object(n.a)(Object(n.a)({},t),{},{count:a.state.item_edit_count,amount:a.state.item_edit_amount,discount_amount:a.state.item_edit_discount_amount,discount_percentage:a.state.item_edit_discount_percentage})),a.setState({data:a.state.data})})),this.setState({updateValues:!this.state.updateValues}),this.toggleModalEditOpen());case 1:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"handleDeleteItemCart",value:function(){var t=Object(c.a)(s.a.mark((function t(){var e,a,n,i=this;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.props.addToast,"products"===this.state.item_edit_type?(this.state.data.additionals.products.map((function(t){t.virtual_stock||(t.virtual_stock=t.stock),t.id===i.state.item_edit_id&&(t.stock=t.virtual_stock)})),a=this.state.data.products.filter((function(t){return t.product_id!==i.state.item_edit_id})),this.state.data.products=a,this.setState({data:this.state.data})):"services"===this.state.item_edit_type&&(n=this.state.data.services.filter((function(t){return t.service_id!==i.state.item_edit_id})),this.state.data.services=n,this.setState({data:this.state.data})),e({title:"Sucesso",content:"O item foi removido com sucesso",time:new Date,duration:12e3,color:"success"}),this.toggleModalEditOpen(),this.setState({updateValues:!this.state.updateValues});case 5:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"handleSaveNewClient",value:function(){var t=Object(c.a)(s.a.mark((function t(e){var a,n,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.preventDefault(),this.props.addToast,this.state.client_name){t.next=5;break}return alert("Informe o nome do Cliente"),t.abrupt("return",!1);case 5:return this.setState({loading:!0}),t.prev=6,t.next=9,J.a.post("/crm/clients",{profile_id:5,cpf:this.state.client_cpf,name:null!==(a=this.state.client_name)&&void 0!==a?a:"-",phone:this.state.client_phone,email:this.state.client_email,is_active:!0});case 9:n=t.sent,(i=n.data)&&this.setState({client_id:{value:i.id,label:"".concat(i.cpf?"[".concat(i.cpf,"] - "):i.phone?"[".concat(i.phone,"] - "):"").concat(i.name)}}),this.toggleModalNewClientOpen(),t.next=19;break;case 15:t.prev=15,t.t0=t.catch(6),t.t0.response?(t.t0.response.data&&!0===t.t0.response.data.error&&alert(t.t0.response.data.more),t.t0.response.data.data?this.setState({client_id:{value:t.t0.response.data.data.id,label:"".concat(t.t0.response.data.data.cpf?"[".concat(t.t0.response.data.data.cpf,"] - "):t.t0.response.data.data.phone?"[".concat(t.t0.response.data.data.phone,"] - "):"").concat(t.t0.response.data.data.name)}}):alert("Desculpe, n\xe3o foi possivel salvar o cliente")):alert("Desculpe, n\xe3o foi possivel salvar o cliente"),console.log(t.t0);case 19:this.setState({loading:!1});case 20:case"end":return t.stop()}}),t,this,[[6,15]])})));return function(e){return t.apply(this,arguments)}}()},{key:"getState",value:function(t){switch(t){case"open":return"Aberta";case"closed":return"Fechada";case"canceled":return"Cancelada"}}},{key:"getColor",value:function(t){switch(t){case"open":return"warning";case"closed":return"success";case"canceled":return"danger"}}},{key:"toggleModalCancelOpen",value:function(){this.setState((function(t){return{modalCancelOpen:!t.modalCancelOpen}}))}},{key:"toggleModalPaymentOpen",value:function(){this.setState((function(t){return{modalPaymentOpen:!t.modalPaymentOpen}}))}},{key:"toggleModalEditOpen",value:function(){this.setState((function(t){return{modalEditOpen:!t.modalEditOpen}}))}},{key:"componentDidMount",value:function(){this.loadData(),this.loadPaymentMethods()}},{key:"componentDidUpdate",value:function(t,e){var a=0;e.updateValues!==this.state.updateValues&&(this.state.data.products.map((function(t){t.count>0&&(a+=t.amount)})),this.state.data.services.map((function(t){t.count>0&&(a+=t.amount)})),this.setState({data:Object(n.a)(Object(n.a)({},this.state.data),{},{amount:a})}))}},{key:"render",value:function(){var t,e,a,i,s,c,o,l,r,d,u,p,_=this,J={control:function(t,e){return Object(n.a)(Object(n.a)({},t),{},{borderColor:e.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0","&:hover":{borderColor:e.isFocused?"rgba(114, 94, 195, 0.6)":"#eaecf0"},boxShadow:e.isFocused?"0 0 0 0.2rem rgba(114, 94, 195, 0.2)":""})},option:function(t,e){var a="";return e.isSelected?a="#725ec3":e.isFocused&&(a="rgba(114, 94, 195, 0.2)"),Object(n.a)(Object(n.a)({},t),{},{backgroundColor:a})},multiValueLabel:function(t){return Object(n.a)(Object(n.a)({},t),{},{color:"#545b61",backgroundColor:"#eeeeef"})}};return h.a.createElement(m.Fragment,null,h.a.createElement("div",{className:"row vertical-gap"},h.a.createElement("div",{className:"col-lg-4 order-lg-12 rui-task-sidebar order-1"},h.a.createElement("div",{className:"card card-border-effect-kie"},h.a.createElement("div",{className:"card-body py-30"},h.a.createElement("ul",{className:"list-group list-group-flush rui-task-sidebar-list"},h.a.createElement("li",{className:"list-group-item"},h.a.createElement("ul",{className:"list-unstyled rui-task-info-list"},null===(t=this.state.data)||void 0===t||null===(e=t.services)||void 0===e?void 0:e.map((function(t){return h.a.createElement("li",{key:t.id},h.a.createElement("div",{className:"rui-task-info-item"},h.a.createElement(N.a,{name:"edit",className:"mr-5",onClick:function(){return _.handleEditServiceInSale(t.service.id)}}),h.a.createElement("span",null,h.a.createElement("strong",null,"x",t.count)," -"),h.a.createElement("span",{className:"list-items-sale"},t.service.name),h.a.createElement("h6",{className:"h6 rui-task-sidebar-title text-right mb-0 mt-0"},h.a.createElement("strong",null,"R$ ",t.amount.toLocaleString()))))})),null===(a=this.state.data)||void 0===a||null===(i=a.products)||void 0===i?void 0:i.map((function(t){return h.a.createElement("li",{key:t.product.id},h.a.createElement("div",{className:"rui-task-info-item"},h.a.createElement(N.a,{name:"edit",className:"mr-5",onClick:function(){return _.handleEditProductInSale(t.product.id)}}),h.a.createElement("span",null,h.a.createElement("strong",null,"x",t.count)," -"),h.a.createElement("span",{className:"list-items-sale"},t.product.name),h.a.createElement("h6",{className:"h6 rui-task-sidebar-title text-right mb-0 mt-0"},h.a.createElement("strong",null,"R$ ",t.amount.toLocaleString()))))})))),h.a.createElement("li",{className:"list-group-item"},h.a.createElement("h5",{className:"h4 rui-task-sidebar-title text-right mb-0 mt-0"},h.a.createElement("strong",null,"R$ ",null===(s=this.state.data)||void 0===s||null===(c=s.amount)||void 0===c?void 0:c.toLocaleString()))),h.a.createElement("li",{className:"list-group-item"},h.a.createElement("h5",{className:"h4 rui-task-sidebar-title"},"Forma de Pagamento"),h.a.createElement("ul",{className:"list-unstyled rui-task-project-list payment-types"},this.state.payment_methods.map((function(t){return h.a.createElement("li",{key:t.id,className:"payment-type"},h.a.createElement(g.a,{block:!0,className:"btn-hover-outline text-center",color:t.color,onClick:function(){return _.handlePay(t.id,t.name)}},t.name))})))))))),h.a.createElement("div",{className:"col-lg-8 order-lg-0 order-0"},h.a.createElement("div",{className:"bill-filters"},h.a.createElement(A.a,null,h.a.createElement(E.a,{xs:12,sm:8,md:8,className:"mb-5"},h.a.createElement(C.a,{for:"filter_type"},"DIGITE P/ PESQUISAR O CLIENTE"),h.a.createElement(w.a,{cacheOptions:!0,loadOptions:this.filterClient,defaultOptions:!0,onInputChange:this.handleInputChange,id:"filter_type",name:"filter_type",styles:J,defaultValue:this.state.client_id,value:this.state.client_id,onChange:function(t){return _.setState({client_id:t})}})),h.a.createElement(E.a,{className:"mb-5"},h.a.createElement(C.a,{for:"filter_type"},"N\xc3O LOCALIZOU?"),h.a.createElement(g.a,{xs:12,sm:2,md:2,block:!0,className:"btn-hover-outline text-center",color:"brand",onClick:function(){return _.toggleModalNewClientOpen()}},"NOVO CLIENTE")))),h.a.createElement("div",{className:"rui-task-comment p-0"},h.a.createElement("div",{className:"rui-task-comment-text mt-0"},h.a.createElement(A.a,{className:"xs-gap p-0 flex-wrap"},null===(o=this.state.data)||void 0===o||null===(l=o.additionals)||void 0===l?void 0:l.products.map((function(t){return h.a.createElement(E.a,{xs:12,sm:12,md:6,lg:4,className:"mb-10",key:t.id},h.a.createElement(v.a,null,h.a.createElement(f.a,{alt:"",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADICAYAAACZBDirAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKNSURBVHgB7dQBEQAQAAAx9O/nnDAE+S3E5j73DYCgNQCiBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBrA+NWgUa6x769AAAAABJRU5ErkJggg==",top:!0}),h.a.createElement(k.a,{className:"card-body pt-10 pb-10 pl-15 pr-15"},h.a.createElement(S.a,{className:"h2"},t.name),h.a.createElement(y.a,null,"R$ ",t.sale_price.toLocaleString()," ",h.a.createElement("mark",null,t.stock)),h.a.createElement(g.a,{color:"brand",onClick:function(){return _.handleAddProduct(t.id)}},"Adicionar"))))})),null===(r=this.state.data)||void 0===r||null===(d=r.additionals)||void 0===d?void 0:d.services.map((function(t){return h.a.createElement(E.a,{xs:12,sm:12,md:6,lg:4,className:"mb-10",key:t.id},h.a.createElement(v.a,null,h.a.createElement(f.a,{alt:"",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADICAYAAACZBDirAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKNSURBVHgB7dQBEQAQAAAx9O/nnDAE+S3E5j73DYCgNQCiBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBLAECWQIEsgQIZAkQyBIgkCVAIEuAQJYAgSwBAlkCBLIECGQJEMgSIJAlQCBLgECWAIEsAQJZAgSyBAhkCRDIEiCQJUAgS4BAlgCBrA+NWgUa6x769AAAAABJRU5ErkJggg==",top:!0}),h.a.createElement(k.a,{className:"card-body pt-10 pb-10 pl-15 pr-15"},h.a.createElement(S.a,{className:"h2"},t.name),h.a.createElement(y.a,null,"R$ ",t.value.price.toLocaleString()),h.a.createElement(g.a,{color:"brand",onClick:function(){return _.handleAddService(t.id)}},"Adicionar"))))}))))))),h.a.createElement(B.a,{isOpen:this.state.modalPaymentOpen,toggle:this.toggleModalPaymentOpen,className:this.props.className,fade:!0},h.a.createElement("div",{className:"modal-header"},h.a.createElement("h5",{className:"modal-title h2"},"Confirma\xe7\xe3o de Pagamento"),h.a.createElement(g.a,{className:"close",color:"",onClick:this.toggleModalPaymentOpen},h.a.createElement(N.a,{name:"x"}))),h.a.createElement(Q.a,null,"Confirma o pagamento no ",h.a.createElement("mark",{className:"display-4"},this.state.payment_method_text)," no valor de R$"," ",h.a.createElement("mark",{className:"display-4"},null===(u=this.state.data)||void 0===u||null===(p=u.amount)||void 0===p?void 0:p.toLocaleString())," ?",h.a.createElement("br",null),h.a.createElement("br",null),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"coupon"},"Cupom Fiscal"),h.a.createElement(b.a,{id:"coupon",name:"coupon",placeholder:"45654566",type:"text",value:this.state.coupon,onChange:function(t){return _.setState({coupon:t.target.value})}}))),h.a.createElement(O.a,null,h.a.createElement(g.a,{color:"secondary",onClick:this.toggleModalPaymentOpen},"Fechar")," ",h.a.createElement(g.a,{color:"success",onClick:this.handleCloseSaleCart,disabled:this.state.paying},this.state.paying?"Efetuando Pagamento...":"Confirmar"))),h.a.createElement(B.a,{isOpen:this.state.modalEditOpen,toggle:this.toggleModalEditOpen,className:this.props.className,fade:!0},h.a.createElement("div",{className:"modal-header"},h.a.createElement("h5",{className:"modal-title h2"},"Editar Item"),h.a.createElement(g.a,{className:"close",color:"",onClick:this.toggleModalEditOpen},h.a.createElement(N.a,{name:"x"}))),h.a.createElement(Q.a,null,"Editar item ",h.a.createElement("mark",{className:"display-4"},this.state.item_edit_name),h.a.createElement("br",null),h.a.createElement("br",null),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"count"},"Quantidade"),h.a.createElement(b.a,{id:"count",name:"count",placeholder:"count",type:"number",min:1,max:this.state.item_edit_stock,value:this.state.item_edit_count,onChange:function(t){return _.handleChangeCountItem(t.target.value)},onKeyUp:function(t){return _.handleChangeCountItem(t.target.value)}})),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"discount_amount"},"R$ de Desconto"),h.a.createElement(b.a,{id:"discount_amount",name:"discount_amount",placeholder:"0,00",type:"text",value:this.state.item_edit_discount_amount,onChange:function(t){return _.handleCalcDiscountByAmount(t.target.value)},onKeyUp:function(t){return _.handleCalcDiscountByAmount(t.target.value)}})),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"item_edit_discount_percentage"},"% de Desconto"),h.a.createElement(b.a,{id:"item_edit_discount_percentage",name:"item_edit_discount_percentage",placeholder:"0,00",type:"text",value:this.state.item_edit_discount_percentage,onChange:function(t){return _.handleCalcDiscountByPercent(t.target.value)},onKeyUp:function(t){return _.handleCalcDiscountByPercent(t.target.value)}})),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"item_edit_amount"},"R$ Total"),h.a.createElement(b.a,{id:"item_edit_amount",name:"item_edit_amount",placeholder:"0,00",type:"text",value:this.state.item_edit_amount}))),h.a.createElement(O.a,null,h.a.createElement(g.a,{color:"secondary",onClick:this.toggleModalEditOpen},"Fechar")," ",h.a.createElement(g.a,{color:"danger",onClick:this.handleDeleteItemCart},"Excluir da Venda")," ",h.a.createElement(g.a,{color:"success",onClick:this.handleEditSaleCart},"Alterar"))),h.a.createElement(B.a,{isOpen:this.state.modalNewClientOpen,toggle:this.toggleModalNewClientOpen,className:this.props.className,fade:!0},h.a.createElement("form",{onSubmit:this.handleSaveNewClient},h.a.createElement("div",{className:"modal-header"},h.a.createElement("h5",{className:"modal-title h2"},"Novo Cliente"),h.a.createElement(g.a,{className:"close",color:"",onClick:this.toggleModalNewClientOpen},h.a.createElement(N.a,{name:"x"}))),h.a.createElement(Q.a,null,h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"client_name"},"Nome *"),h.a.createElement(b.a,{required:!0,id:"client_name",name:"client_name",placeholder:"Nome Completo",type:"text",value:this.state.client_name,onChange:function(t){return _.setState({client_name:t.target.value})}})),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"client_cpf"},"CPF"),h.a.createElement(b.a,{id:"client_cpf",name:"client_cpf",placeholder:"",type:"text",value:this.state.client_cpf,onChange:function(t){return _.setState({client_cpf:t.target.value})}})),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"client_phone"},"Telefone"),h.a.createElement(b.a,{id:"client_phone",name:"client_phone",placeholder:"(99) 9 9999-9999",type:"text",value:this.state.client_phone,onChange:function(t){return _.setState({client_phone:t.target.value})}})),h.a.createElement(I.a,null,h.a.createElement(C.a,{for:"client_email"},"E-mail"),h.a.createElement(b.a,{id:"client_email",name:"client_email",placeholder:"",type:"email",value:this.state.client_email,onChange:function(t){return _.setState({client_email:t.target.value})}}))),h.a.createElement(O.a,null,h.a.createElement(g.a,{color:"secondary",type:"button",onClick:this.toggleModalNewClientOpen},"Cancelar")," ",h.a.createElement(g.a,{color:"success",disabled:this.state.loading},this.state.loading?"Salvando...":"Salvar")))))}}]),a}(m.Component);e.default=Object(p.b)((function(t){return{settings:t.settings,toasts:t.toasts}}),{addToast:x.e})(Object(_.f)(D))}}]);
//# sourceMappingURL=53.6e0eb56e.chunk.js.map