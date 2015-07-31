function get_email_template(ele) {
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({do: 'get_email_template', cmt: $(ele).val() }),
                success: function(data)
                {
			$('#email_content').val(data.content);
			$('#email_betreff').val(data.betreff);
                }
        });
}

function save_email_template() {
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({do: 'save_email_template', cmt: $('#select_email_template').val(), cmt_text: $('#email_content').val(), cmt_betreff: $('#email_betreff').val() }),
                success: function(data)
                {
                        $('#email_content').val(data.content);
			$('#email_betreff').val(data.betreff);
                }
        });
}

function add_mail_template() {
	var template_name = get_template_name_dialog(); 
	$('#select_email_template').append('<option value="new_'+template_name+'">'+template_name+'</option>');
	$('#select_email_template').val('new_'+template_name);
	$('#email_betreff').val('Betreff eintragen');
	$('#email_content').val('Text eintragen');
}

function get_template_name_dialog() {
	$('#email_template_new_dialog').dialog({
		title: 'Namen festlegen',
		buttons: [
			{
				text: 'OK',
				click: function() {
					return $('#email_template_new_dialog').val();
				}
			}
		]
	});
}

function set_cso_status(cso,status) {
        var doer = '';
        if(status == 'O') {
                doer = 'supplier_order_ordered';
        }
        else if(status == 'S') {
                doer = 'supplier_order_sold';
                $('#supplier-order-dialog').dialog({
                        title: "Bemerkung",
                        modal: true,
                        closeText: '',
                        buttons: [
                                {
                                        text: "OK",
                                        click: function() {
                                                if($('#problem-desc').val() == '') {
                                                        alert('Beschreibung darf nicht leer sein!');
                                                } else {
                                                        $.ajax({
                                                                type: "POST",
                                                                url: '/admin/',
                                                                cache: false,
                                                                dataType: "JSON",
                                                                data: ({do: doer, cso: cso, problem: $('#problem-desc').val() }),
                                                                success: function(data) {
                                                                        $('#status_msg').html(data.status).fadeIn().delay(1000).fadeOut();
                                                                        $('#problem-desc').val('');
                                                                        $('#supplier-order-dialog').dialog("destroy");
                                                                        $('#'+active_tab_id+' select').change();
                                                                }
                                                        });
                                                }

                                        }
                                },
                                {
                                        text: "Abbrechen",
                                        click: function() {
                                                $('#supplier-order-dialog').dialog("destroy");
                                        }
                                }
                        ]
                });
                $('#supplier-order-dialog').parent().css('z-index',3000);
                return;
        }
	else if(status == 'D') {
		doer = 'supplier_order_done';
	}
	else if(status = 'P') {
		open_supplier_order_sold_dialog(cso);
	}
	
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({do: doer, cso: cso }),
                success: function(data)
                {
                        $('#'+active_tab_id+' select').change();
                        $('#status_msg').html(data.status).fadeIn().delay(1000).fadeOut();
                }
        });
}

function changeSupplierDropdown(status) {
        var supplier = $('#'+active_tab_id+' select').val();
        var doer = "";
        if(status == 'open') {
                doer = "supplier_show_open";
        }
        else if(status == 'ordered') {
                doer = "supplier_show_ordered";
        }
        else if(status == 'problem') {
                doer = 'supplier_show_problem';
        }
	else if(status == 'sold') {
		doer = 'supplier_show_sold';
	}
	else if(status == 'done') {
		doer = 'supplier_show_done';
	}

        $.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({ do: doer, supplier:supplier }),
                success: function(data)
                {
                        $('#'+active_tab_id+' .table_content').html(data);
                        $(".btn_supplier_order").on("click", function(){
                                set_cso_status($(this).attr("data-cso"),$(this).attr("data-status"));
                        });
                        $(".btn_supplier-order-problem-dialog").on("click", function() { open_supplier_order_problem_dialog(this) });
                }
        });

}

function open_supplier_order_problem_dialog(ele) {
        var cso = $(ele).attr('data-cso');
        $.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({ do: 'supplier_get_order_comments', cso:cso }),
                success: function(data)
                {
                        $('#supplier-order-problem-dialog').dialog({
                                height: 400,
                                title: "Bemerkungen",
                                width: 1000,
				modal: true,
				closeText: '',
                                close: function(event, ui) {
                                        $('#btn_add_order_comment').off('click');
                                }
                        }).parent().css('z-index',3000);
                        $('#supplier-order-problem-dialog .table_content').html(data.html);
                        $('#btn_add_order_comment').attr('data-cso',data.cso);
			$('#btn_add_order_comment').on('click',function() {
                                add_supplier_order_problem_comment(this);
                        });
                }
        });
}

function open_supplier_order_sold_dialog(cso) {
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({ do: 'supplier_get_order_comments', cso:cso, mail_template: 1 }),
                success: function(data)
                {
			$('#supplier-order-sold-dialog').dialog({
                        	title: "Kundenkontakt",
				height: 400,
				width: 1000,
	                        modal: true,
        	                closeText: '',
				close: function(event, ui) {
					$('#btn_add_order_sold_comment').off('click');
				}
                	}).parent().css('z-index',3000);
			$('#supplier-order-sold-dialog .table_content').html(data.html);
			$('#select_email_template').append(data.select);
			$('#btn_add_order_sold_comment').attr('data-cso',data.cso);
                        $('#btn_add_order_sold_comment').on('click',function() {
                                add_supplier_order_sold_comment(cso);
                        });
		}
	});
}

function add_supplier_order_problem_comment(ele) {

        $.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({ do: 'supplier_add_order_comment', cso:$(ele).attr('data-cso'), comment: $('#add_order_comment').val() }),
                success: function(data)
                {
                        $('#supplier-order-problem-dialog .table_content').html(data.html);
                        $('#add_order_comment').val('');
                        $('#status_msg').html(data.status).fadeIn().delay(1000).fadeOut();
                }
        });
}

function add_supplier_order_sold_comment(cso) {

        $.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "JSON",
                data: ({ do: 'supplier_add_order_comment', cso:cso, comment: $('#add_order_sold_comment').val() }),
                success: function(data)
                {
                        $('#supplier-order-sold-dialog .table_content').html(data.html);
                        $('#add_order_sold_comment').val('');
                        $('#status_msg').html(data.status).fadeIn().delay(1000).fadeOut();
                }
        });
}
