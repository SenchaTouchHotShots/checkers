Ext.define('Checkers.model.Square', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'squareID', type: 'string'},
            {name: 'occupied', type: 'string'},
            {name: 'background', type: 'string'}
        ],
        idProperty: 'squareID'
    }
});