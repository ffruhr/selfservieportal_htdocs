function changeMonthDropdown(mit) {
        var month = $('#time_dd_month').val();
        var year = $('#time_dd_year').val();

        $.ajax( {
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({do: 'time_detail_month', month:month, year:year, mit:mit}),
                success: function(data)
                {
                        $('#time_detail_month_'+mit).html(data);
                }
        });
}

function changeVacationDropdown(mit) {
        var year = $('#vac_dd_year').val();

        $.ajax( {
                type: "POST",
                url: '/admin/',
                cache: false,
                dataType: "TEXT",
                data: ({do: 'vac_show_mit', year:year, mit:mit}),
                success: function(data)
                {
                        $('#vacation_show_'+mit).html(data);
                }
        });
}
