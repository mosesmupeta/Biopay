var merchant = {
  fetchMerchant: function() {
    //views.setURL("/marchants.html");
    //$("#indexpage").addClass("active");
    project.showBusy();
    axios
      .get(app.API + "api/merchants", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        console.log(response);
        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);

        events.list = response.data.data;

        var list = "";
        response.data.data.forEach((event, index) => {
          list += ` <tr>
                <td>${index + 1}</td>
                <td>${event.name}</td>
                <td>${event.state}</td>
                <td>${event.city}</td>
                <td>${event.location.address}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-info" data-toggle="modal" data-id=${
                          event._id
                        }
                            onClick=merchant.details(this)>
                            <span class="fa fa-pencil" aria-hidden="true"></span>
                        </button>
                        <button type="button" class="btn btn-outline-danger" data-toggle="modal"
                        data-id=${
                          event._id
                        } onClick=merchant.showDeleteModal(this) >
                            <span class="fa fa-trash" aria-hidden="true"></span>
                        </button>
                    </div>
                </td>
                                </tr>`;
        });
        views.element("merchantTable").innerHTML = list;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  details: function(target) {
    $("#editmodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
    for (var event of events.list) {
      if (event._id === id) {
        events.selected = event;
        break;
      }
    }
    let merchantName = `
        <label for="merchantname">Merchant Name</label><input type="name" class="form-control" id="merchantname" value='${
          events.selected.name
        }'>
    `;
    let merchantState = `<label for="merchantstate">State</label>
    <input type="name" class="form-control" id="merchantstate" value='${
      events.selected.state
    }'>`;
    let merchantCity = `<label for="merchantcity">City</label>
    <input type="name" class="form-control" id="merchantcity" value='${
      events.selected.city
    }'>`;
    let merchantAddress = `<label for="merchantaddress">Address</label>
    <input type="name" class="form-control" id="merchantaddress" value='${
      events.selected.location.address
    }'>`;
    views.element("merchantFormName").innerHTML = merchantName;
    views.element("merchantFormState").innerHTML = merchantState;
    views.element("merchantFormCity").innerHTML = merchantCity;
    views.element("merchantFormAddress").innerHTML = merchantAddress;
  },
  editMerchantInfo: function(latitude, longitude) {
    var editData = {
      name: views.element("merchantname").value,
      location: {
        address: views.element("merchantaddress").value,
        coordinates: [longitude, latitude],
        type: "Point"
      },
      city: views.element("merchantcity").value,
      state: views.element("merchantstate").value
    };
    console.log(editData);
    console.log(events.selectedid);
    axios
      .put(app.API + `api/merchants/${events.selectedid}`, editData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        console.log(response);
        $("#editmodal").modal("hide");
        merchant.fetchMerchant();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  submitMerchantInfo: function(latitude, longitude) {
    // $("#merchantmodal").modal("show");
    var name = views.element("merchantcreateformName").value;
    var address = views.element("merchantcreateformAddress").value;
    var city = views.element("merchantcreateformCity").value;
    var state = views.element("merchantcreateformState").value;

    var createData = {
      name: name,
      "location.address": address,
      "location.coordinates.0": longitude,
      "location.coordinates.1": latitude,
      //location: {
      //address: views.element("merchantcreateformAddress").value
      //coordinates: [-90, 10],
      //type: "Point"
      //
      //},
      city: city,
      state: state
    };
    console.log(createData);
    axios
      .post(app.API + `api/merchants`, createData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        $("#merchantmodal").modal("hide");
        merchant.fetchMerchant();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },

  showDeleteModal: function(target) {
    $("#deletemodal").modal("show");
    var id = target.getAttribute("data-id");
    console.log(id);
    events.selectedid = id;
  },
  deleteMerchant: function() {
    project.showSmallBusy();
    axios
      .delete(app.API + `api/merchants/${events.selectedid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        console.log(response);
        $("#deletemodal").modal("hide");
        merchant.fetchMerchant();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  loadMerchant: function() {
    views.impose("merchantUIView", function() {
      merchant.fetchMerchant();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },
  createMerchant: function() {
    var name = views.element("merchantcreateformName").value;
    var address = views.element("merchantcreateformAddress").value;
    var city = views.element("merchantcreateformCity").value;
    var state = views.element("merchantcreateformState").value;
    if (!name || !address || !city || !state) {
      alert("Please Fill All Fields");
      return;
    }
    project.removeError();
    project.showSmallBusy();

    var arr = [];
    arr.push(address, city, state);
    var geoaddress = arr.join(".");
    console.log(geoaddress);

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: geoaddress }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        console.log(latitude, longitude);
        merchant.submitMerchantInfo(latitude, longitude);
      } else {
        project.hideSmallBusy();
        alert(
          "An error occured. Ensure you entered your correct Adrress Details"
        );
      }
    });
  },
  editMerchant: function() {
    project.removeError();
    project.showSmallBusy();

    var address = views.element("merchantaddress").value;
    var city = views.element("merchantcity").value;
    var state = views.element("merchantstate").value;

    var arr = [];
    arr.push(address, city, state);
    var geoaddress = arr.join(".");
    console.log(geoaddress);

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: geoaddress }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        console.log(latitude, longitude);
        merchant.editMerchantInfo(latitude, longitude);
      } else {
        project.hideSmallBusy();
        alert(
          "An error occured. Ensure you entered your correct Adrress Details"
        );
      }
    });
  }
};
