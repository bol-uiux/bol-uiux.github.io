var ViewPayoutReview = {};

(function (ctx) {

  function btn_select() {

    $(".btn-select").click(function () {

      if ($(this).hasClass("selected") == true) {
        $(this).removeClass("selected");
        $("." + $(this).data("select")).removeClass("selected");



      } else {
        $(this).addClass("selected");
        $("." + $(this).data("select")).addClass("selected");


      }

      CheckButton();

    });

  }

  function CheckButton() {
    var exist = false;
    var SelectNumber = 0;
    var TotalNumber = 0;
    $('.pending-payout').each(function (i, obj) {

      if ($("#" + obj.id).hasClass("selected")) {
        exist = true;
        // return;
        SelectNumber++;
      }
      TotalNumber++;
    });

    if (exist) {
      $(".btn-cancel-request").removeClass("disabled");
    } else {
      $(".btn-cancel-request").addClass("disabled");
    }


    if (SelectNumber == 0) {
      $("#selected_remove_all").prop("checked", false);
      $(".btn-group-click").removeClass("selected");
    } else if (SelectNumber == (TotalNumber / 2)) {
      $("#selected_remove_all").prop("checked", true);
      $(".btn-group-click").addClass("selected");
    } else {
      $("#selected_remove_all").prop("checked", false);
      $(".btn-group-click").removeClass("selected");
    }


  }

  function btn_group_click() {
    $(".btn-group-click").click(function () {
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");



        $(".pending-payout").removeClass("selected");
        $(".pending-payout").prop("checked", false);



      } else {
        $(this).addClass("selected");

        $(".pending-payout").prop("checked", true);
        $(".pending-payout").addClass("selected");


      }
      CheckButton();

    });
  }
    function loader_toggle() {
        $(".loader-toggle").click(function () {
            loader();
            $(".fadein-elem").toggleClass("hide");
        });
    }
    function loader() {
        $(".loader").removeClass("hide");
        setTimeout(function () {
            $(".loader").addClass("transitionOut");
        }, 500);
        setTimeout(function () {
            $(".loader").removeClass("transitionOut");
            $(".loader").addClass("hide");
        }, 1000);
    }
  function btn_toggle() {
    $(".btn-toggle").click(function() {
      var get_elem_hide = $(this).data("hide");
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(this).addClass("active");
      }
      if (
        typeof $(this).data("show") !== "undefined" &&
        $(this).data("show") !== ""
      ) {
        var get_elem_show = $(this).data("show");
        if ($("." + get_elem_show).hasClass("show") == false) {
          $("." + get_elem_show).removeClass("hide");
          $("." + get_elem_show).addClass("transitionIn");
        } else {
          $("." + get_elem_show).addClass("transitionOut");
          $("." + get_elem_show).removeClass("show");
        }
      }

      if (
        typeof $(this).data("hide") !== "undefined" &&
        $(this).data("hide") !== ""
      ) {
        $("." + get_elem_hide).addClass("transitionOut");
        if ($("." + get_elem_hide).hasClass("show") == true) {
          $("." + get_elem_hide).removeClass("show");
        }
      }

      setTimeout(function() {
        if (typeof get_elem_show !== "undefined" && get_elem_show !== "") {
          if ($("." + get_elem_show).hasClass("show") == false) {
            $("." + get_elem_show).removeClass("transitionIn");
            $("." + get_elem_show).addClass("show");
          }
          if ($("." + get_elem_show).hasClass("transitionOut") == true) {
            $("." + get_elem_show).removeClass("transitionOut");
            $("." + get_elem_show).removeClass("show");
          }
        }
        if (typeof get_elem_hide !== "undefined" && get_elem_hide !== "") {
          $("." + get_elem_hide).addClass("hide");
          $("." + get_elem_hide).removeClass("transitionOut");
        }
      }, 1000);
    });
  }

  function select_inp() {
    $(".btn-sel").click(function () {
      $("." + $(this).data("text")).text($(this).text());

      var get_class = $("." + $(this).data("box")).removeClass("hide");
      $("." + $(this).data("box")).addClass("transtionIn");
      setTimeout(function () {
        $("." + $(this).data("box")).removeClass("transtionIn");
      }, 1000);
      loader();
    });
  }

  function content_toggle() {
    $(".btn-content-toggle").click(function () {

      var get_target_elem = $(this).data("toggle");
      $(".btn-content-toggle").removeClass("active");
      $(".btn-content-toggle").each(function () {
        $("." + $(this).data("toggle")).addClass("hide");
      });
      setTimeout(function () {
        $("." + get_target_elem).removeClass("hide");
        $("." + get_target_elem).addClass("transtionIn");
      }, 200);
      setTimeout(function () {
        $("." + get_target_elem).removeClass("transtionIn");
      }, 1000);
      loader();
      setTimeout(function () {
        $(this).addClass("active");
      }, 1000);
    });
  }

  function collapse_box() {
    $(".btn-collapse").click(function () {
      var check_class = $("." + $(this).data("target")).hasClass("collapsed");
      if (check_class == false) {
        $("." + $(this).data("target")).addClass("collapsed");
      } else {
        $("." + $(this).data("target")).removeClass("collapsed");
      }
    });
  }

 


    function ClickOption() {
        $("#Process").click(function () {

            SetActualOption($(this).data("show"));
            SetOptionList($(this).data("target"));
            ResetSelect();
        });


        $("#Cancelled").click(function () {

            
            SetActualOption($(this).data("show"));
            SetOptionList($(this).data("target"));
            ResetSelect();
        });

        $("#Pending").click(function () {


            SetActualOption($(this).data("show"));
            SetOptionList($(this).data("target"))
            ResetSelect();
        });
    }
    function ResetSelect() {
        $(".btn-group-click").removeClass("selected");



        $(".pending-payout").removeClass("selected");
        $(".pending-payout").prop("checked", false);
        CheckButton();
    }
    function createDivOption(id, datatarget, datashow, html) {

        var div = document.createElement("div");
        div.id = id;
        div.innerHTML = html;
        div.setAttribute('data-target', datatarget);
        div.setAttribute('data-show', datashow);
        div.setAttribute("class","option");
        return div;
    }
    function SetOptionList(actualoption) {
        var html = "";
        var bodyWrapper = document.getElementById("PendingOptions");
        while (bodyWrapper.firstChild) {
            bodyWrapper.removeChild(bodyWrapper.firstChild);
        }
        $("#CheckAll").css("opacity", "0");
        
        switch (actualoption) {
            case "Processed": bodyWrapper.appendChild(createDivOption("Pending", "Pending", $("#hiddenpendingtext").val(), $("#hiddenpendingtext").val())); bodyWrapper.appendChild(createDivOption("Cancelled", "Cancelled", $("#hiddenrejecttext").val(), $("#hiddenrejecttext").val())); break;
            case "Cancelled": bodyWrapper.appendChild(createDivOption("Pending", "Pending", $("#hiddenpendingtext").val(), $("#hiddenpendingtext").val())); bodyWrapper.appendChild(createDivOption("Process", "Processed", $("#hiddenprocesstext").val(), $("#hiddenprocesstext").val())); break;
            case "Pending": bodyWrapper.appendChild(createDivOption("Cancelled", "Cancelled", $("#hiddenrejecttext").val(), $("#hiddenrejecttext").val())); bodyWrapper.appendChild(createDivOption("Process", "Processed", $("#hiddenprocesstext").val(), $("#hiddenprocesstext").val())); ValidExistPending();break;
             
        }
         
        //$("#PendingOptions").html(html);
        ClickOption();
        showopcion(actualoption);
    }

    function SetActualOption(actualoption) {

        $("#ActualSelectOption").html(actualoption);
    }
    function showopcion(opcion) {
        $(".Pending").hide();
        $(".Cancelled" ).hide();
        $(".Processed" ).hide();

        $("." + opcion).show();
    }

    function ValidExistPending() {

        if ($("#ExistPending").val() == "True") {
            $("#CheckAll").css("opacity", "1");
            $("#CheckAll").css("border", "2px solid #90918D-color");
        } else {
            $("#CheckAll").css("opacity", "0");
        }
    }

  function init() {
    //var statusDropdown = document.getElementById('status-dropdown');
       
      ValidExistPending();

    //statusDropdown.addeventlistener('change', OnchangeApproveStatus, false);
    //TODO: loop x cada div addeventlistener('click', OncickApproveStatus, false);
      ClickOption();
      collapse_box();
    content_toggle();
      select_inp();
      loader_toggle()
      btn_toggle();
     
    btn_group_click();
      btn_select();
      showopcion("Pending")
  }

  ctx.init = init;

})(ViewPayoutReview);

ViewPayoutReview.init();