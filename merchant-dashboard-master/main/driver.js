var driver = {
  loadDrivers: function () {
    views.impose("driverUIView", function () {
      driver.fetchDrivers();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },
  fetchDrivers: function () {
    project.showBusy();
    axios
      .get(app.API + "api/drivers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {

        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);

        events.drivers = response.data.data;

        var list = "";
        response.data.data.forEach((event, index) => {
          list += `<tr>
            <td>${index + 1}</td>
            <td>${event.referenceNumber}</td>
            <td>${event.firstname}</td>
            <td>${event.lastname}</td>
            <td>${event.phoneNumber}</td>
           <!-- <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button  onClick=driver.driverDetails(this) type="button" class="btn btn-outline-info" data-toggle="modal"
                         data-id=${event._id}>
                        <span class="fa fa-pencil" aria-hidden="true"></span>
                    </button>
                    <button onclick="driver.showdriverdeleteModal(this)" type="button" class="btn btn-outline-danger" data-toggle="modal"
                          data-id=${event._id}>
                        <span class="fa fa-trash" aria-hidden="true"></span>
                    </button>
                </div>
            </td> -->
        </tr>`;
        });
        views.element("driverTable").innerHTML = list;
      })
      .catch(function (error) {

      });
  },
  driverDetails: function (target) {
    $("#editdrivermodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
    for (var event of events.drivers) {
      if (event._id === id) {
        events.selected = event;
        break;
      }
    }
    let firstName = `
        <label for="editdriverfirstName">First Name</label>
        <input type="name" class="form-control" id="editdriverfirstName" value='${
      events.selected.firstname
      }'>
    `;
    let lastName = `
    <label for="editdriverlastName">Last Name</label>
    <input type="name" class="form-control" id="editdriverlastName" value='${
      events.selected.lastname
      }'>
`;
    let phone = `
<label for="editdriverphone">Phone Number</label>
<input type="tel" class="form-control" id="editdriverphone" value='${
      events.selected.phoneNumber
      }'>
`;

    views.element("driverEditfirstName").innerHTML = firstName;
    views.element("driverEditlastName").innerHTML = lastName;
    views.element("driverEditphoneNumber").innerHTML = phone;
  },
  editDriver: function () {
    project.removeError();
    project.showSmallBusy();
    var editData = {
      firstname: views.element("editdriverfirstName").value,
      lastname: views.element("editdriverlastName").value,
      phoneNumber: views.element("editdriverphone").value,
      referenceNumber: events.selected.referenceNumber
    };

    axios
      .put(app.API + `api/drivers/${events.selectedid}`, editData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();

        $("#editdrivermodal").modal("hide");
        driver.fetchDrivers();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);

      });
  },
  createDriver: function () {
    $("#drivermodal").modal("show");
    var fname = views.element("driverfirstName").value;
    var lname = views.element("driverlastName").value;
    var phone = views.element("driverphoneNumber").value;
    var ref = views.element("driverefNumber").value;
    if (!fname || !lname || !phone || !ref) {
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
      referenceNumber: ref
    };
    axios
      .post(app.API + `api/drivers`, createData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();

        $("#drivermodal").modal("hide");
        driver.fetchDrivers();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);

      });
  },
  showdriverdeleteModal: function (target) {
    $("#deletedrivermodal").modal("show");
    var id = target.getAttribute("data-id");

    events.selectedid = id;
  },
  deleteDriver: function () {
    project.showSmallBusy();
    axios
      .delete(app.API + `api/drivers/${events.selectedid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();

        $("#deletedrivermodal").modal("hide");
        driver.fetchDrivers();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);

      });
  }
};
