         $(function() {
          
		  
		  $('.btn-copy').tooltip({
			  show: null,
			  position: {
				my: "right+20 bottom",
				at: "right+20 center-15"
			  },
			  open: function( event, ui ) {
				ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast" );
			  }
			});
		   
		   
		   
		   
           $("#BankName").autocomplete({
              minLength:2,   
               delay:500,             
				source: function( request, response ) {										
					$.ajax({
					  type: "POST",
					  url: window.location.href,					 
					  data: {
						BankInf: request.term
					  },
					  success: function( data ) {						
						response( data.split(",") );
					  },
					  error: function( data ) {						
						if(data.responseText.indexOf('error')>0)
						console.log($($.parseHTML(data.responseText)[2]).text()  +  $($.parseHTML(data.responseText)[3]).text() +$($.parseHTML(data.responseText)[4]).text());
						response(['An error has occurred'])
					  }
					});
				},
            });
			
			$('.btn-copy').click(function(){
								
				 var $temp,input,isIOSDev
				 $temp = $('<input/>',{					
					type:	'text',
					value:	this.dataset.tj,
					style: 'color:white; border: none; position:absolute; top: -9999px'
			     }); 
								
				$("body").append($temp); 				
				input =$temp.get(0);
				isIOSDev = navigator.userAgent.match(/ipad|iphone/i);
				
				input.focus();
				input.select();
				
						  
				if (isIOSDev) {
					
					input.contentEditable = true;
					input.readOnly = false;

					var range = document.createRange();
					range.selectNodeContents(input);

					var selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					input.setSelectionRange(0, 999999);
					
				}
				
				if (document.execCommand('copy')){										
					$('.ui-tooltip-content').text('Copied to Clipboard!');
				}
				else{				
					$('.ui-tooltip-content').text('An error has occurred');
				}					
										
				document.body.removeChild(input);
			});
			
			
			
         });


	$(document).ready(function() {
		var Step =  document.getElementById("StepIndex").value;
		$("#amount-form button[type='submit']").click(function(e) {
			e.preventDefault();
			$("#step-1").hide();
			$("#loading-wrapper").show();
			document.getElementById('amount-form').submit();
			// console.log();
		});
			switch(Step) {
			case "1":
				$("#step-1").show();
				break;
			case "2":
				$("#step-1").hide();
				$("#step-2").show();
				break;
			default:
		// code block
		}
	});

