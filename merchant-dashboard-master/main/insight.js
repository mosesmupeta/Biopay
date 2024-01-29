var insight = {
    fetchInsight: function () {
        project.showBusy();
        axios
            .get(app.API + "api/notfound", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("vendeeToken")
                }
            })
            .then(function (response) {
                console.log(response);
                project.hideBusy();
                if (response.status !== 200) return app.alert(response.status);

                events.categories = response.data.data;

                var list = "";
                response.data.data.forEach((event, index) => {
                    list += `<tr>
              <td>${index + 1}</td>
              <td>${insight.getIssueID(event._id)}</td>
              <td>${insight.formatTime(event.createdAt)}</td>
              <td>${event.email}</td>
              <td>${event.phoneNumber}</td>
              <td>${event.searchedItem}</td>
              <!-- <td>${event.status}</td> -->
          </tr>`;
                });
                views.element("lostRequestTable").innerHTML = list;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    formatTime: function (time) {

        var formattedTime = moment(time).calendar();
        return formattedTime
    },

    getIssueID: function (id) {
        // var id = response.data.data[index]._id;
        var issueID = "#" + id.slice(18);
        return issueID
    },


    loadInsight: function () {
        views.impose("insightUIView", function () {
            insight.fetchInsight();
        });
        //views.setURL("/insight.html");
        //goto,impose,overlay,flash
    },

};
