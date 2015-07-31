// AJAX - Loader
$(document).ajaxStart(function()
{
        $('#ajax-loader').show();
});

$(document).ajaxStop(function()
{
        $('#ajax-loader').hide();
});

// Tooltip
$(function() {
	$( document ).tooltip();
	$('#css_switch select').on('change',function() {
        	$('#css_source').attr('href',$(this).val());
	});
});



// Fenster - System
$.window.prepare({
                dock: 'bottom',       // change the dock direction: 'left', 'right', 'top', 'bottom'
                animationSpeed: 200,  // set animation speed
                minWinLong: 180       // set minimized window long dimension width in pixel
});

function createWindow(URL,title,id)
{
        if(createWndInProgress)
        {
                return;
        }
        else
        {
                var createWndInProgress = true;
        }

        var maxWindowWidth = $('body').width() - 50;
//      alert(maxWindowWidth);

        if($('#'+id).attr('id') == id)
        {
                var wnds = $.window.getAll();
                if(wnds.length < 2)
                {
                        return;
                }

                for(var i = 0, len=wnds.length; i < len; i++)
                {
                        var win = wnds[i];
                        if(win.getContainer().attr('id') == id)
                        {
                                if(win.isMinimized())
                                {
                                        win.restore();
                                        $.Window.getSelectedWindow().unselect();
                                        win.select();
                                }
                                else
                                {
                                        $.Window.getSelectedWindow().unselect();
                                        win.select();
                                }
                        }
                }
                return;
        }

	$.ajax({
                type: "GET",
                url: URL,
                cache: false,
                dataType: "TEXT",
                success: function(data)
                {
                        var wnd = $("#main_panel").window(
                        {
                                icon : '',
                                title: title,
                                content  : data,
                                checkBoundary: true,
                                bookmarkable : false,
                                createRandomOffset   : {x: 50, y: 50},
                                width: 1000,
                                height   : 600,
                                minWidth: 400,
                                minHeigth: 300,
                                maxWidth: maxWindowWidth, //-1 = no checking
                                maxHeight: -1, //-1 = no checking
                                showFooter   : false,
                                x: -1,
                                y: -1,
                                maximizable: true
                        });

                        $('#'+wnd.getWindowId()).attr('id', id);
                        createWndInProgress = false;
                },
                error: function(xhr, status, error)
                {
                        alert(xhr.responseText);
                        createWndInProgress = false;
                }
        });
}

