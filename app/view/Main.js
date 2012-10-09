Ext.define('Checkers.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video',
        'Ext.dataview.DataView'
    ],
    config: {
        items: [
            {
                xtype: 'dataview',
                itemTpl: '<div class="gameSquare {background}">{squareID}</div>',
                store: 'BoardStore',
                height: 619,
                width: 619,
                cls: 'board',
                margin: 5,
                padding: 5
            }
        ]
    }
});
