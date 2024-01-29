var shopper = {
  loadShoppers: function () {
    views.impose("shopperUIView", function () {
      shopper.fetchShoppers();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },
  fetchShoppers: function () {
    project.showBusy();
    axios
      .get(app.API + "api/shoppers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);

        events.shoppers = response.data.data;

        var list = "";
        response.data.data.forEach((event, index) => {
          list += `<tr>
            <td>${index + 1}</td>
            <td>${event.referenceNumber}</td>
            <td>${event.firstname}</td>
            <td>${event.lastname}</td>
            <td>${event.phoneNumber}</td>
            <td>${event.company}</td>
           <!-- <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button  onClick=shopper.shopperDetails(this) type="button" class="btn btn-outline-info" data-toggle="modal"
                         data-id=${event._id}>
                        <span class="fa fa-pencil" aria-hidden="true"></span>
                    </button>
                    <button onclick="shopper.showshopperdeleteModal(this)" type="button" class="btn btn-outline-danger" data-toggle="modal"
                          data-id=${event._id}>
                        <span class="fa fa-trash" aria-hidden="true"></span>
                    </button>
                </div>
            </td> -->
        </tr>`;
        });
        views.element("shopperTable").innerHTML = list;
      })
      .catch(function (error) {
      });
  },
  shopperDetails: function (target) {
    $("#editshoppermodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
    for (var event of events.shoppers) {
      if (event._id === id) {
        events.selected = event;
        break;
      }
    }
    let firstName = `
        <label for="editshopperfirstName">First Name</label>
        <input type="name" class="form-control" id="editshopperfirstName" value='${
      events.selected.firstname
      }'>
    `;
    let lastName = `
    <label for="editshopperlastName">Last Name</label>
    <input type="name" class="form-control" id="editshopperlastName" value='${
      events.selected.lastname
      }'>
`;
    let phone = `
<label for="editshopperphone">Phone Number</label>
<input type="tel" class="form-control" id="editshopperphone" value='${
      events.selected.phoneNumber
      }'>
`;
    let company = `
<label for="editshoppercompany">Company Name</label>
<input type="tel" class="form-control" id="editshoppercompany" value='${
      events.selected.company
      }'>
`;

    views.element("shopperEditfirstName").innerHTML = firstName;
    views.element("shopperEditlastName").innerHTML = lastName;
    views.element("shopperEditphoneNumber").innerHTML = phone;
    views.element("shopperEditcompanyName").innerHTML = company;
  },
  editShopper: function () {
    project.removeError();
    project.showSmallBusy();
    var editData = {
      firstname: views.element("editshopperfirstName").value,
      lastname: views.element("editshopperlastName").value,
      phoneNumber: views.element("editshopperphone").value,
      company: views.element("editshoppercompany").value,
      referenceNumber: events.selected.referenceNumber
    };
    axios
      .put(app.API + `api/shoppers/${events.selectedid}`, editData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#editshoppermodal").modal("hide");
        shopper.fetchShoppers();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  },
  createShopper: function () {
    $("#shoppermodal").modal("show");
    var fname = views.element("shopperfirstName").value;
    var lname = views.element("shopperlastName").value;
    var phone = views.element("shopperphoneNumber").value;
    var company = views.element("shoppercompanyName").value;
    var ref = views.element("shopperefNumber").value;
    if (!fname || !lname || !phone || !ref || !company) {
      alert("Please fill all the fields");
      return;
    } else if (/^\d+$/.test(ref) !== true) {
      alert("Ref must contain only Numeric digits");
      return false;
    }
    project.removeError();
    project.showSmallBusy();
    var createData = {
      firstname: fname,
      lastname: lname,
      phoneNumber: phone,
      company: company,
      referenceNumber: ref
    };
    axios
      .post(app.API + `api/shoppers`, createData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#shoppermodal").modal("hide");
        shopper.fetchShoppers();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  },
  showshopperdeleteModal: function (target) {
    $("#deleteshoppermodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
  },
  deleteShopper: function () {
    project.showSmallBusy();
    axios
      .delete(app.API + `api/shoppers/${events.selectedid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#deleteshoppermodal").modal("hide");
        shopper.fetchShoppers();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  }
};
