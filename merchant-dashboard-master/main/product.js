var product = {
  allMerchants: [],
  allCategories: [],
  fetchCategory: function () {
    project.showBusy();
    axios
      .get(app.API + "api/category", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        console.log("this is the response");
        console.log(response);

        project.hideBusy();

        product.allCategories = response.data.data;

        if (response.status !== 200) return app.alert(response.status);

        //  events.categories = response.data.data;

        //  var list = "";

        // views.element("categoryTable").innerHTML = list;
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  fetchMerchant: function () {

    project.showBusy();
    axios
      .get(app.API + "api/merchants", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideBusy();
        console.log("response.data");
        console.log(response.data);
        product.allMerchants = response.data.data;
        if (response.status !== 200) return app.alert(response.status);


      })
      .catch(function (error) {
        console.log(error);
      });
  },
  fetchProduct: function () {
    project.showBusy();
    // if (!events.categories) {
    //  // category.quickFetchCategory();
    //   console.log("fetching category");
    // }

    product.fetchCategory();
    product.fetchMerchant();

    axios
      .get(app.API + "api/products", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        console.log(response);
        if (events.categories !== null) {
          project.hideBusy();
        }
        if (response.status !== 200) return app.alert(response.status);

        events.products = response.data.data;

        var list = "";
        response.data.data.forEach((event, index) => {
          list += `  <tr>
            <td>${index + 1}</td>
            <td>${
            event.categoryID ? event.categoryID.categoryName : "null"
            }</td>
            <td>${event.productName}</td>
            <td>${event.price}</td>
            <td>${event.merchantID ? event.merchantID.name : "null"}</td>
            <td><span class="badge ${ event.isPickupAvailable ? "badge-info" : "badge-danger"}">${event.isPickupAvailable}</span></td>
            <td><span class="badge ${ event.isAvailable ? "badge-info" : "badge-danger"}">${event.isAvailable}</span></td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-info" data-toggle="modal" data-id=${
            event._id
            }
                        onclick="product.productDetails(this)">
                        <span class="fa fa-pencil" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-outline-danger" data-toggle="modal"
                        onclick="product.showDeleteProduct(this)" data-id=${
            event._id
            }>
                        <span class="fa fa-trash" aria-hidden="true"></span>
                    </button>
                </div>
            </td>
        </tr>`;
        });
        views.element("productTable").innerHTML = list;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  showDeleteProduct: function (target) {
    $("#deleteproductmodal").modal("show");
    var id = target.getAttribute("data-id");
    console.log(id);
    events.selectedid = id;
  },
  productDetails: function (target) {
    $("#editproductmodal").modal("show");
    //views.element("outputimage").src = " ";
    var id = target.getAttribute("data-id");
    events.selectedid = id;
    for (var event of events.products) {
      if (event._id === id) {
        events.selected = event;
        break;
      }
    }
    // var options = "";
    // events.list.forEach((event, index) => {
    //   options += ` <option value=${event._id} ${
    //     events.selected.merchantID._id === event._id ? "selected" : ""
    //     }>${event.name}</option>
    //       `;
    // });
    // var category = "";
    // events.categories.forEach((event, index) => {
    //   category += ` <option value=${event._id} ${
    //     events.selected.categoryID._id === event._id ? "selected" : ""
    //     }>${event.categoryName}</option>
    //       `;
    // });

    let productName = `
     <label for="producttitle">Title</label>
     <input type="name" class="form-control" id="editproductitle" placeholder="Product Title" value='${
      events.selected.productName
      }'>
  `;
    let productprice = `
      <label for="productprice">Price</label>
              <div class="input-group mb-2">
                  <div class="input-group-prepend">
                      <div class="input-group-text">₦</div>
                  </div>
                  <input type="text" class="form-control" id="editproductprice" placeholder="Product Price" value='${
      events.selected.price
      }'>
              </div>
      `;
    // let merchantName = `
    //       <label for="marchantname">Marchant Name</label>
    //           <select id="edmerchantname" class="form-control">
    //               ${options}
    //           </select>
    //   `;
    //   let categoryName = `
    //     <label for="marchantname">Category Name</label>
    //         <select id="edmcategoryname" class="form-control">
    //             ${category}
    //         </select>
    // `;
    let pickupavailable = `
      <label for="productPickupstatus"> Pickup Availability: </label>
              <div class="custom-control custom-radio custom-control-inline ">
              <input type="radio" name='raid' value='true' id='availableId' ${
      events.selected.isPickupAvailable ? "checked" : ""
      }>
                  <label class="label-cont" for="customRadioInline0">Available</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline custom-radio-danger">
              <input type="radio" name='raid' value='false' id='notavailableId' ${
      events.selected.isPickupAvailable ? "" : "checked"
      }>
                  <label class="label-cont" for="customRadioInline0-1">Not Available</label>
              </div>
      `;

    let available = `
      <label for="productAvailablestatus"> Product Availability: </label>
              <div class="custom-control custom-radio custom-control-inline ">
              <input type="radio" name='raidproductAvailable' value='true' id='productAvailableId' ${
      events.selected.isAvailable ? "checked" : ""
      }>
                  <label class="label-cont" for="customRadioInlineProductAvailable">Available</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline custom-radio-danger">
              <input type="radio" name='raidproductAvailable' value='false' id='productNotavailableId' ${
      events.selected.isAvailable ? "" : "checked"
      }>
                  <label class="label-cont" for="customRadioInlineProductUnavailable">Not Available</label>
              </div>
      `;

    let imageFile = `
      <div class="custom-file col-md-12">
              <input type="file" class="custom-file-input" id="file" onchange='product.preview_image(event)' required>
              <label class="custom-file-label" for="file">Upload Product
                  Image...</label>
          </div>
      `;
    let imageview = `
    <label class="label-cont">Preview</label>
      <img id='outputimage' style='width:250px;height:200px;margin-bottom:15px' accept="image/*" src=${"https://api.yourvendee.com/upload" +
      events.selected.thumbnail} />
  
      `;

    views.element("productName").innerHTML = productName;
    views.element("productPrice").innerHTML = productprice;
    // views.element("productmerchName").innerHTML = merchantName;
    // views.element("productcateditName").innerHTML = categoryName;
    views.element("productPickup").innerHTML = pickupavailable;
    views.element("productAvailable").innerHTML = available;
    views.element("productEditImage").innerHTML = imageFile;
    views.element("productEditImageView").innerHTML = imageview;

  },
  showProductModal: function (target) {
    $("#productmodal").modal("show");
    var categories = "<option>--Choose Category--</option>";
    var options = "<option>--Choose Merchant--</option>";
    product.allCategories.forEach((event, index) => {
      categories += ` <option value=${event._id}>${event.categoryName}</option>
          `;
    });
    product.allMerchants.forEach((event, index) => {
      options += ` <option value=${event._id}>${event.name}</option>
          `;
    });

    console.log("product.allMerchants");
    console.log(product.allMerchants);

    let productCategory = `
      <label for="createproductcat">Choose Category</label>
      <select id="createproductctcat" class="form-control">
          ${categories}
      </select>
      `;
    //
    let merchantName = `
      <label for="createproductmerchname">Merchant Name</label>
      <select id="createproductmerchname" class="form-control">
          ${options}
      </select>
      `;
    let imageview = `
      <img id='croutputimage' style='width:250px;height:200px;margin-bottom:15px' accept="image/*" src=' ' />
  
      `;
    views.element("crProductMerchantName").innerHTML = merchantName;
    views.element("crProductCategory").innerHTML = productCategory;
    views.element("productCreateImageView").innerHTML = imageview;
  },
  editProduct: function () {
    project.showSmallBusy();
    var e = views.element("edmerchantname");
    var f = views.element("edmcategoryname");
    var imagefile = document.querySelector("#file");

    var name = views.element("editproductitle").value;
    var price = views.element("editproductprice").value;
    var pickupavailable = document.querySelector('input[name="raid"]:checked').value;
    var productavailable = document.querySelector('input[name="raidproductAvailable"]:checked').value;

    var formData = new FormData();
    if (imagefile.files.length !== 0) {
      formData.append("thumbnail", imagefile.files[0]);
    }
    formData.append("productName", name);
    formData.append("price", price);
    formData.append("isPickupAvailable", pickupavailable);
    formData.append("isAvailable", productavailable);
    for (var value of formData.values()) {
      console.log(value);
    }
    axios
      .put(app.API + `api/products/${events.selectedid}`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken"),
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        console.log(response);
        $("#editproductmodal").modal("hide");
        product.fetchProduct();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  createProduct: function () {
    project.showSmallBusy();
    var e = views.element("createproductmerchname");
    var f = views.element("createproductctcat");
    var imagefile = document.querySelector("#crproductfile");

    var name = views.element("crproducttitle").value;
    var price = views.element("crproductprice").value;
    var merchantid = e.options[e.selectedIndex].value;
    var categoryid = f.options[f.selectedIndex].value;
    var pickupavailable = document.querySelector(
      'input[name="crproductRadio"]:checked'
    ).value;
    if (
      !name ||
      !price ||
      merchantid == "--Choose Merchant--" ||
      !pickupavailable ||
      categoryid == "--Choose Category--" ||
      imagefile.files.length === 0
    ) {
      alert("please select all fields");
      project.hideSmallBusy();
      return;
    }
    var formData = new FormData();
    console.log(pickupavailable);

    formData.append("thumbnail", imagefile.files[0]);

    formData.append("productName", name);
    formData.append("price", price);
    formData.append("merchantID", merchantid);
    formData.append("categoryID", categoryid);
    formData.append("isPickupAvailable", pickupavailable);
    formData.append("isAvailable", true);
    for (var value of formData.values()) {
      console.log(value);
    }
    axios
      .post(app.API + `api/products`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken"),
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        console.log(response);
        $("#productmodal").modal("hide");
        product.fetchProduct();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  preview_image: function (event) {
    console.log(event);
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById("outputimage");
      output.src = reader.result;
    };
    reader.readAsDataURL(event.srcElement.files[0]);
  },
  preview_image_cr: function (event) {
    console.log(event);
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById("croutputimage");
      output.src = reader.result;
    };
    reader.readAsDataURL(event.srcElement.files[0]);
  },
  deleteProduct: function () {
    project.showSmallBusy();
    axios
      .delete(app.API + `api/products/${events.selectedid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        console.log(response);
        $("#deleteproductmodal").modal("hide");
        product.fetchProduct();
      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  loadProduct: function () {
    views.impose("productUIView", function () {
      product.fetchProduct();
    });
  }
};
