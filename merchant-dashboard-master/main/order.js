var order = {
  allOrders: [],
  selectedID: 0,
  loadOrders: function () {
    views.impose("orderUIView", function () {
      order.fetchOrders();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },
  fetchOrders: function () {
    project.showBusy();
    axios
      .get(app.API + "api/orders/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        console.log("All Orders");
        console.log(response.data.data);
        order.allOrders = response.data.data;
        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);

        var list = "";
        ///// NEW APPROACH

        for (let index = 0; index < response.data.data.length; index++) {

          var id = response.data.data[index]._id;
          var parcelID = id.slice(18);
          var driverRefNumberTable = "";
          var shippingMethodTable = "";
          var shopperRefNumberTable = "";

          if (response.data.data[index].driverReferenceNumber === 0) {
            driverRefNumberTable = "NOT ASSIGNED"
          } else {
            driverRefNumberTable = response.data.data[index].driverReferenceNumber;
          }

          if (response.data.data[index].deliveryMethod === undefined) {
            shippingMethodTable = "NO SHIPPING METHOD"
          } else {
            shippingMethodTable = response.data.data[index].deliveryMethod;
          }

          if (response.data.data[index].shopperReferenceNumber === 0) {
            shopperRefNumberTable = "NOT ASSIGNED"
          } else {
            shopperRefNumberTable = response.data.data[index].shopperReferenceNumber;
          }

          list += `<tr>
          <td>${index + 1}</td>
          <td onClick=order.showOrderDetailsModal(this) class="table-link" data-index=${index}>${"#"}${parcelID}</td>
         <!-- <td>${response.data.data[index].customerID.firstname + " " + response.data.data[index].customerID.lastname}</td> -->
         <td>${response.data.data[index].customerID.email}</td> 
          <td>${response.data.data[index].customerID.phoneNumber}</td>
          <td>${response.data.data[index].customerID.address}</td>
          <td>${shippingMethodTable}</td>
          <td>${response.data.data[index].deliveryTime}</td>
          <td>${driverRefNumberTable}</td>
        <!--  <td>${shopperRefNumberTable}</td> -->
         <!-- <td>${response.data.data[index].total}</td> -->
            <td>${response.data.data[index].status}</td>
          <td>
              <div class="btn-group btn-group-sm" role="group">
                  <button  onClick=order.editOrderModal(this) type="button" class="btn btn-outline-info" data-toggle="modal"
                  data-index=${index}>
                      <span class="fa fa-pencil" aria-hidden="true"></span>
                  </button>
              </div>
          </td>
      </tr>`;

        }

        views.element("orderTable").innerHTML = list;
      })
      .catch(function (error) {
        //  console.log(error);
      });
  },


  convertArrayOfObjectsToCSV: function (args) {

    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;

  },

  orderFilterDataDelivery: function (data) {

    return data.deliveryMethod === "DELIVERY";

  },



  exportOrderDataDelivery: function (args) {

    var data, filename, link;

    var dataOrderDeliveryArray = order.allOrders.filter(order.orderFilterDataDelivery)
    var dataArray = [];
    var dataObject = {};


    for (let index = 0; index < dataOrderDeliveryArray.length; index++) {

      var id = dataOrderDeliveryArray[index]._id;
      var parcelID = id.slice(18);
      var shippingMethodTable = "";

      if (dataOrderDeliveryArray[index].deliveryMethod === undefined) {
        shippingMethodTable = "NO SHIPPING METHOD"
      } else {
        shippingMethodTable = dataOrderDeliveryArray[index].deliveryMethod;
      }

      dataObject = {
        Parcel_ID: parcelID,
        Time_Slot: dataOrderDeliveryArray[index].deliveryTime,
        Email: dataOrderDeliveryArray[index].customerID.email,
        Phonenumber: dataOrderDeliveryArray[index].customerID.phoneNumber,
        Address: dataOrderDeliveryArray[index].customerID.address,
        Shipping_Method: shippingMethodTable,
        // Order_Status: ""
      }

      dataArray.push(dataObject);
    }


    var csv = order.convertArrayOfObjectsToCSV({
      data: dataArray
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();

  },

  showOrderDetailsModal: function (target) {
    $("#orderDetailsModal").modal("show");

    var index = target.getAttribute("data-index");
    var productsArray = order.allOrders[index].productID;
    var total = order.allOrders[index].total;
    var orderProductList = "";
    var orderDetailTemplate = "";

    for (let index = 0; index < productsArray.length; index++) {

      // orderTotal = `<p><b>Total :</b> ${total}</p>`;

      orderProductList += `<tr>
     <td>${index + 1}</td>
     <td>${productsArray[index].productName}</td>
     <td>${productsArray[index].quantity}</td>
     <td>NGN ${productsArray[index].price}.00</td>
      </tr>`;

    }

    // orderDetailTemplate = orderTotal + orderProductList;

    views.element("orderProductsTable").innerHTML = orderProductList;

  },



  editOrderModal: function (target) {
    $("#editordermodal").modal("show");

    var index = target.getAttribute("data-index");
    var ordersArray = order.allOrders[index];
    order.selectedID = order.allOrders[index]._id


    let status = `
        <label>current status : ${ ordersArray.status} </label>
        <br>
        <label >Update Status </label>

        <div class="form-group col-md-12">
        <select id="editorderStatus" class="form-control">
        <option value="PENDING">PENDING</option>
        <option value="PROCESSING">PROCESSING</option>
        <option value="READY">READY</option>
        <option value="IN_TRANSIT">IN TRANSIT</option>
        <!-- <option value="OUT_OF_STOCK">OUT OF STOCK</option> -->
        <option value="DELIVERED">DELIVERED</option>
        <option value="DELIVERY_FAILED">DELIVERY FAILED</option>
        </select>
        </div>

        `;


    let driverRef = `
    <label for="editorderRef">Driver Ref</label>
    <input type="name" class="form-control" id="editorderRef" value='${ ordersArray.driverReferenceNumber}'>`;

    views.element("orderEditStatus").innerHTML = status;
    views.element("orderEditDriverRef").innerHTML = driverRef;
  },


  editOrder: function () {
    project.removeError();
    project.showSmallBusy();

    var selectedItem = document.getElementById("editorderStatus");
    var selectedStatus = selectedItem.options[selectedItem.selectedIndex].value;

    var editData = {
      status: selectedStatus,
      driverReferenceNumber: views.element("editorderRef").value
    };
    axios
      .put(app.API + `api/orders/${order.selectedID}`, editData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#editordermodal").modal("hide");
        order.fetchOrders();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  }
};
