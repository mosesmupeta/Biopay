var courier = {
  fetchCouriers: function() {
    project.showBusy();
    axios
      .get(app.API + "api/couriers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        console.log(response);
        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);

        events.couriers = response.data.data;

        var list = "";
        response.data.data.forEach((event, index) => {
          list += `<tr>
            <td>${index + 1}</td>
            <td>${event.companyName}</td>
            <td>${event.companyAddress}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button  onClick=courier.courierDetails(this) type="button" class="btn btn-outline-info" data-toggle="modal"
                         data-id=${event._id}>
                        <span class="fa fa-pencil" aria-hidden="true"></span>
                    </button>
                    <button onclick="courier.showcourierdeleteModal(this)" type="button" class="btn btn-outline-danger" data-toggle="modal"
                          data-id=${event._id}>
                        <span class="fa fa-trash" aria-hidden="true"></span>
                    </button>
                </div>
            </td>
        </tr>`;
        });
        views.element("courierTable").innerHTML = list;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  courierDetails: function(target) {
    $("#editcouriermodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
    for (var event of events.couriers) {
      if (event._id === id) {
        events.selected = event;
        break;
      }
    }
    let courierName = `
        <label for="editcourierName">Company Name</label>
        <input type="name" class="form-control" id="editcourierName" value='${
          events.selected.companyName
        }'>
    `;
    let courierAddress = `
    <label for="editcourierAddress">Company Address</label>
    <input type="name" class="form-control" id="editcourierAddress" value='${
      events.selected.companyAddress
    }'>
    `;

    views.element("courierEditName").innerHTML = courierName;
    views.element("courierAddressName").innerHTML = courierAddress;
  },
  editCourier: function() {
    project.removeError();
    project.showSmallBusy();
    var editData = {
      companyName: views.element("editcourierName").value,
      companyAddress: views.element("editcourierAddress").value
    };
    console.log(events.selectedid);
    axios
      .put(app.API + `api/couriers/${events.selectedid}`, editData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        console.log(response);
        $("#editcouriermodal").modal("hide");
        courier.fetchCouriers();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  createCourier: function() {
    $("#couriermodal").modal("show");
    var name = views.element("couriercreateformName").value;
    var address = views.element("couriercreateformAddress").value;
    if (!name || !address) {
      alert("Please fill all the fields");
      return;
    }
    project.removeError();
    project.showSmallBusy();
    var createData = {
      companyName: name,
      companyAddress: address
    };
    axios
      .post(app.API + `api/couriers`, createData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        console.log(response);
        $("#couriermodal").modal("hide");
        courier.fetchCouriers();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  showcourierdeleteModal: function(target) {
    $("#deletecouriermodal").modal("show");
    var id = target.getAttribute("data-id");
    console.log(id);
    events.selectedid = id;
  },
  deleteCourier: function() {
    project.showSmallBusy();
    axios
      .delete(app.API + `api/couriers/${events.selectedid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        console.log(response);
        $("#deletecouriermodal").modal("hide");
        courier.fetchCouriers();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  loadCouriers: function() {
    views.impose("courierUIView", function() {
      courier.fetchCouriers();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  }
};
