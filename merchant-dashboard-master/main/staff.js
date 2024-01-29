var staff = {
  allStaffs: [],
  loadStaffs: function () {
    views.impose("staffUIView", function () {
      staff.fetchStaffs();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },
  fetchStaffs: function () {
    project.showBusy();
    axios
      .get(app.API + "api/staff/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {

        order.allStaffs = response.data.data;

        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);

        events.staffs = response.data.data;

        var list = "";
        response.data.data.forEach((event, index) => {

          var currentRole = "";

          if (event.isAdmin === true) {
            currentRole = "Admin"
          }
      
          if (event.isAdmin === false) {
            currentRole = "Member"
          }



          list += `<tr>
            <td>${index + 1}</td>
            <td>${event.name}</td>
            <td>${currentRole}</td>
            <td>${event.email}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button  onClick=staff.staffDetails(this) type="button" class="btn btn-outline-info" data-toggle="modal"
                         data-id=${event._id} data-index=${index}>
                        <span class="fa fa-pencil" aria-hidden="true"></span>
                    </button>
                    <button onclick="staff.showstaffdeleteModal(this)" type="button" class="btn btn-outline-danger" data-toggle="modal"
                          data-id=${event._id}>
                        <span class="fa fa-trash" aria-hidden="true"></span>
                    </button>
                </div>
            </td>
        </tr>`;
        });
        views.element("staffTable").innerHTML = list;
      })
      .catch(function (error) {
        // console.log(error);
      });
  },
  staffDetails: function (target) {
    $("#editstaffmodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
    var currentRole = "";

    for (var event of events.staffs) {
      if (event._id === id) {
        events.selected = event;
        break;
      }
    }

    if (events.selected.isAdmin === true) {
      currentRole = "Admin"
    }

    if (events.selected.isAdmin === false) {
      currentRole = "Member"
    }


    let name = `
        <label for="editstaffName">Name</label>
        <input type="name" class="form-control" id="editstaffName" value='${
      events.selected.name
      }'>
    `;
    let email = `
    <label for="editstaffEmail">Email</label>
    <input type="name" class="form-control" id="editstaffEmail" value='${
      events.selected.email
      }'>
`;
    let isadmin = `

    <label>CURRENT ROLE : ${ currentRole} </label>
    <br>
    <label >Update role </label>

    <div class="form-group col-md-12">
    <select id="editstaffIsAdmin" class="form-control">
    <option value="true">Admin</option>
    <option value="false">Member</option>
    </select>
    </div>
    
`;
    let password = `
<label for="editstaffPassword">Password</label>
<input type="name" class="form-control" id="editstaffPassword" placeholder='Enter New Password'>
    
`;

    views.element("staffEditName").innerHTML = name;
    views.element("staffEditEmail").innerHTML = email;
    views.element("staffEditIsAdmin").innerHTML = isadmin;
    views.element("staffEditPassword").innerHTML = password;
  },
  editStaff: function () {
    project.removeError();
    project.showSmallBusy();
    var password = views.element("editstaffPassword").value;
    var selectedItem = document.getElementById("editstaffIsAdmin");
    var selectedRole = selectedItem.options[selectedItem.selectedIndex].value;


    if (password) {
      var editData = {
        name: views.element("editstaffName").value,
        email: views.element("editstaffEmail").value,
        isAdmin: selectedRole,
        oauth: password
      };
    } else {
      var editData = {
        name: views.element("editstaffName").value,
        email: views.element("editstaffEmail").value,
        isAdmin: selectedRole
      };
    }
    axios
      .put(app.API + `api/staff/${events.selectedid}`, editData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#editstaffmodal").modal("hide");
        staff.fetchStaffs();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  },
  createStaff: function () {
    var sname = views.element("staffname").value;
    var email = views.element("staffemail").value;
    var password = views.element("staffpassword").value;
    if (!sname || !email || !password) {
      alert("Please fill all the fields");
      return;
    }
    project.removeError();
    project.showSmallBusy();
    var createData = {
      name: sname,
      email: email,
      oauth: password
    };
    axios
      .post(app.API + `api/staff`, createData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#staffmodal").modal("hide");
        staff.fetchStaffs();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  },
  showstaffdeleteModal: function (target) {
    $("#deletestaffmodal").modal("show");
    var id = target.getAttribute("data-id");
    events.selectedid = id;
  },
  deleteStaff: function () {
    project.showSmallBusy();
    axios
      .delete(app.API + `api/staff/${events.selectedid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        $("#deletestaffmodal").modal("hide");
        staff.fetchStaffs();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
      });
  }
};
