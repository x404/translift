Collections.renderer.imageplus = function(value, metaData, record, rowIndex, colIndex, store) {
    if (value != '' && value != null) {
        var data = Ext.decode(value);
        var url = MODx.config.connectors_url + 'system/phpthumb.php?imageplus=1';
        
        var params = {};
        params.src = MODx.config['collections.renderer_image_path'] + data.sourceImg.src;
        params.w = 100;
        if (data.sourceImg.src.indexOf('.png') !== -1) {
            params.f = 'png';
        }
        
        for (var i in params) {
            url += '&' + i + '=' + params[i];
        }
        
        return '<img alt="" src="' + url + '" width="' + (params.w || 80) + '">';
    }
}