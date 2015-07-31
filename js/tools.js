function search_dhl(ele) {
	$.ajax({
                beforeSend: function() {
                },
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({do: 'search_dhl_detail', ods: $(ele).val() }),
                success: function(data)
                {
                        $('#search_dhl_detail').html(data);
                }
        });
}

function ebay_status_by_kat(ele) {
	$.ajax({
                beforeSend: function() {
                },
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({do: 'ebay_status', kat: $(ele).val() }),
                success: function(data)
                {
			$('#ebay_status_table_content').html(data);
                }
        });
}

function label_create_send() {
	$.ajax({
		beforeSend: function() {
			$('#label_create_res').html('Sende Label...');
		},
                type: "POST",
	        url: '/admin/',
	        cache: false,
	        dataType: "TEXT",
		data: ({do: 'label_create_ex', ean: $('#label_create_code').val(), ean_anzahl: $('#label_create_count').val() }), 
		success: function(data)
		{
			$('#label_create_res').html(data);
		}
	});
}

function list_pdt_bta(pdt) {
	var bta = $('#table_row_'+pdt+' select').val();
	if(bta == 'leer' ) {
		alert('Bitte Agenten wählen');
		return;
	}
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({do: 'add_pdt_to_bta', pdt: pdt, bta: bta }),
                success: function(data)
                {
                        alert(data);
			$('.hmu_'+pdt).hide();
			$('#table_row_'+pdt).hide();
                },
		error: function(xhr, status, error)
                {
                        alert(xhr.responseText);
		}
        });
}

function activate_pdt_ebay(pdt) {
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({do: 'activate_pdt_ebay', pdt: pdt }),
                success: function(data)
                {
                        alert(data);
                        $('.hmu_'+pdt).hide();
                        $('#table_row_'+pdt).hide();
                },
                error: function(xhr, status, error)
                {
                        alert(xhr.responseText);
                }
        });
}

function ebay_add_add_pdt() {
	var bta = $('#ebay_add_bta_select').val();
	var pdt = $('#ebay_add_pdt_input').val().split(',');

	if(bta == 'leer') {
		alert('Bitte Agenten wählen');
		return;
	}
	if( pdt < 1 ) {
		alert('Bitte PDT eingeben');
		return;
	}

	$('#ebay_add_pdt_input').val('');
	$('#ebay_add_res').html('');

	for(var i=0; i<pdt.length;i++) {

		$.ajax({
			type: "POST",
			url: '/admin/',
			cache: false,
			dataType: "TEXT",
			data: ({do: 'add_pdt_to_bta', pdt: pdt[i], bta: bta }),
			success: function(data)
			{
				$('#ebay_add_res').append(data);
			},
			error: function(xhr, status, error)
			{
				alert(xhr.responseText);
			}
	        });
	}
}

function zaehler_frei_1(input)  {
	var zeichen = 80 - input.length;
	$('#zaehler_frei_1').html(zeichen);
}

function create_bundle() {
	var pdt_1 = $('#bundle_quelle_1').val();
	var pdt_2 = $('#bundle_quelle_2').val();
	var pdt_3 = $('#bundle_quelle_3').val();
	var pdt_4 = $('#bundle_quelle_4').val();
	var pdt_5 = $('#bundle_quelle_5').val();
	var pdt_6 = $('#bundle_quelle_6').val();
	var pdt_7 = $('#bundle_quelle_7').val();
	var pdt_8 = $('#bundle_quelle_8').val();
	var pdt_9 = $('#bundle_quelle_9').val();
	var pdt_10 = $('#bundle_quelle_10').val();
	var bundle_name = $('#bundle_name').val();
	var bundle_hersteller = $('#bundle_hersteller').val();
	var bundle_marke = $('#bundle_marke').val();
	var bundle_artikel_id = $('#bundle_artikel_id').val();
	var bundle_shopkat = $('#shopkategorie').val();
	var bundle_ebaykat = $('#ebaykategorie').val();
	var bundle_shoppreis = $('#shoppreis').val();
	var bundle_ebaypreis = $('#ebaypreis').val();
	var bundle_bildurl = $('#bildurl').val();
	var bundle_frei1 = $('#frei1').val();


	$.ajax({
		type: "POST",
		url: "/admin/",
		beforeSend: function() {
			$('#ausgabe').html('Bundle wird erstellt...');
		}, 
		data: ({
			do: 'create_bundle_ex',
			pdt_1: pdt_1,
			pdt_2: pdt_2,
			pdt_3: pdt_3,
			pdt_4: pdt_4,
			pdt_5: pdt_5,
			pdt_6: pdt_6,
			pdt_7: pdt_7,
			pdt_8: pdt_8,
			pdt_9: pdt_9,
			pdt_10: pdt_10,
			bundle_name: bundle_name,
			bundle_hersteller: bundle_hersteller,
			bundle_marke: bundle_marke,
			bundle_artikel_id: bundle_artikel_id,
			bundle_shopkat: bundle_shopkat,
			bundle_ebaykat: bundle_ebaykat,
			bundle_shoppreis: bundle_shoppreis,
			bundle_ebaypreis: bundle_ebaypreis,
			bundle_bildurl: bundle_bildurl,
			bundle_frei1: bundle_frei1
		}),
		cache: false,
		dataType: "TEXT",
		success: function(data) {
			$('#ausgabe').html(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alert(xhr.responseText);
		}
	});
}

function create_bundle_live_shopprice() {
	var obj = {};
	$.each($('.bundle_source'), function(index, value) {
		var name = $(this).attr('name');
		var value = $(this).val();
		if($(this).val() == '') {

		} else {
			obj[name] = value;
		}
	});
	obj.do = 'create_bundle_live_shopprice';
	$.ajax({
		type: "POST",
		url: '/admin/',
		cache: false,
		dataType: "TEXT",
		data: ( obj ),
		success: function(data)
		{
			$('#shoppreis').val(data);
		},
		error: function(xhr, status, error)
		{
			alert(xhr.responseText);
		}
	});
	
}

function create_bundle_live_ebayprice() {
	var obj = {};
        $.each($('.bundle_source'), function(index, value) {
                var name = $(this).attr('name');
                var value = $(this).val();
                if($(this).val() == '') {

                } else {
                        obj[name] = value;              
                }
        });
        obj.do = 'create_bundle_live_ebayprice';
        $.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ( obj ),
                success: function(data)
                {
                        $('#ebaypreis').val(data);
                },
                error: function(xhr, status, error)
                {
                        alert(xhr.responseText);
                }
        });
}

function mws_auswertung() {
	var sst = $('#amazon_status_sst').val();

	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({ do: 'amazon_status_auswertung', sst: sst }),
                success: function(data)
                {
                        $('#amazon_status_content').html(data);
                },
                error: function(xhr, status, error)
                {
                        alert(xhr.responseText);
                }
        });
}

function asin_vorschlagen(ean,locale) {
	if(ean == 0) {
		return;
	}
	$.ajax({
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({ do: 'get_asin', ItemId: ean, locale: locale, SearchIndex: 'All', mode: 'EAN2ASIN' }),
                success: function(data)
                {
                        alert(data);
                },
                error: function(xhr, status, error)
                {
                        alert(xhr.responseText);
                }
        });
}
