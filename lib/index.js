'use strict';

var React    = require('react')
var DataGrid = require('react-datagrid/src')
var assign   = require('object-assign')
var prefixer = require('react-prefixr')

var buildData = require('./buildData')
var renderExpandTool = require('./renderExpandTool')

var hasOwnProperty = Object.prototype.hasOwnProperty
var hasOwn = function(obj, prop){
    return hasOwnProperty.call(obj, prop)
}

function emptyFn(){}

var PropTypes = React.PropTypes

module.exports = React.createClass({

    displayName: 'ReactTreeGrid',

    propTypes: {
        idProperty: PropTypes.string.isRequired,
        nestingWidth: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),

        collapsedName: PropTypes.string,
        defaultCollapsedName: PropTypes.string,

        expandTool: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.bool,
                PropTypes.string
            ]),

        rowStyle: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.object
            ]),

        data   : PropTypes.array,
        columns: PropTypes.array
    },

    getDefaultProps: function() {
        return {
            indexParents        : true,
            nestingWidth        : 20,
            collapsedName       : 'collapsed',
            defaultCollapsedName: 'defaultCollapsed',

            childrenName: 'children',
            treeColumn: null,
            defaultExpandToolStyle: prefixer({
                marginRight: 6,
                cursor: 'pointer',
                transition: 'all 0.1s',
                userSelect: 'none',
                WebkitUserSelect: 'none'
            })
        }
    },

    getInitialState: function() {
        return {
            collapsedState: {}
        }
    },

    render: function(){
        var props = this.prepareProps(this.props, this.state)

        if (typeof props.beforeRender == 'function'){
            props = props.beforeRender(props) || props
        }

        return React.createElement(DataGrid, React.__spread({},  props))
    },

    prepareProps: function(thisProps) {

        var props = {}

        assign(props, thisProps)

        props.data = this.prepareData(props)

        props.treeColumn  = this.prepareTreeColumn(props)
        props.cellFactory = this.cellFactory.bind(this, props)

        return props
    },

    cellFactory: function(props, cellProps) {
        if (cellProps.name === props.treeColumn){
            var data  = cellProps.data
            var id    = data[props.idProperty]
            var depth = props.depths[id]

            cellProps.innerStyle = {
                paddingLeft: depth * props.nestingWidth
            }

            cellProps.renderCell = this.renderTreeCell.bind(this, props)
        }
    },

    renderTreeCell: function(props, textCellProps, text, cellProps) {
        var expandTool = this.renderExpandTool(cellProps.data)

        return React.createElement("div", React.__spread({},  textCellProps), expandTool, text)
    },

    prepareTreeColumn: function(props) {

        var treeColumn = props.treeColumn || props.columns[0].name
        var column

        props.columns.some(function(col){
            if (col.name === treeColumn){
                column = col
                return true
            }
        })

        return treeColumn
    },

    isCollapsed: function(data, props, state) {
        props = props || this.props
        state = state || this.state

        var collapsed = data[props.collapsedName]
        var collapsedState
        var id

        if (collapsed === undefined){

            id = data[props.idProperty]
            collapsedState = this.state.collapsedState

            collapsed = hasOwn(collapsedState, id)?
                        collapsedState[id]:
                        data[props.defaultCollapsedName]
        }

        return !!collapsed
    },

    renderExpandTool: renderExpandTool,

    handleExpandToolClick: function(oldCollapsed, data, event) {
        var props = this.props
        var newCollapsed = !oldCollapsed

        if (data[props.collapsedName] === undefined){
            var id = data[props.idProperty]
            var collapsedState = this.state.collapsedState
            collapsedState[id] = newCollapsed

            this.setState({
                collapsed: collapsedState
            })
        }

        ;(props.onCollapseChange || emptyFn)(newCollapsed, data, event, props)

        var fn = newCollapsed? props.onCollapse: props.onExpand
        ;(fn || emptyFn)(newCollapsed, data, event, props)
    },

    prepareData: function(props) {

        var data = props.data

        if (!Array.isArray(data)){
            data = []
        }

        data = this.buildData(data, props)

        return data
    },

    buildData: function(data, props) {

        var depths = props.depths = {}
        var parents = props.indexParents?
                        props.parents = {}:
                        null

        var config = {

            idProperty          : props.idProperty,
            childrenName        : props.childrenName,
            collapsedName       : props.collapsedName,
            defaultCollapsedName: props.defaultCollapsedName,

            depths : depths,
            parents: parents,

            isCollapsed  : function(data){
                return this.isCollapsed(data)
            }.bind(this)
        }

        return buildData(data, config)
    }
})