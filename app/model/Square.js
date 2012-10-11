Ext.define('Checkers.model.Square', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'squareID', type: 'string'},
            {name: 'occupiedBy', type: 'string'},
            {name: 'pieceType', type: 'string'},
            {name: 'background', type: 'string'},
            {name: 'decoration', type: 'string'}
        ],
        idProperty: 'squareID'
    }
});
