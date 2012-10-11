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
                itemTpl: ['<div class="gameSquare {background} {decoration}">{squareID}',
                          "<tpl if='occupiedBy != \"none\"'><img src=\"/resources/images/{occupiedBy}{pieceType}.png\" height=\"72\" width=\"72\" /></tpl>",
                          '</div>'],
                store: 'BoardStore',
                height: 619,
                width: 619,
                cls: 'board',
                margin: 5,
                padding: 5,
                mode: 'MULTI'
            },
            {
                xtype : 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        xtype: 'spacer'
                    },
                    { text: 'Start Turn', action: 'mainButton' },
                    { text: 'Show Previous', action: 'altButton' },
                    {
                    xtype: 'spacer'
                    }
                ]
            }
        ]
    }
});
