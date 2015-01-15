'use strict';

require('./index.styl')
require('react-datagrid/style/index.styl')

var sorty = require('sorty')
var React = require('react')
var DataGrid = require('./src')

var columns = [
    {
        name: 'id',
        width: 200,
        render: function(value){

            return <span><input type="checkbox" />{value}</span>
        }
    },
    {
        name: 'text'
    }
]

var data = require('./data')

var App = React.createClass({

    handleChange: function(event){
        ROW_HEIGHT = event.target.value
        this.setState({})
    },

    handleDataLenChange: function(event){
        LEN = event.target.value
        this.setState({})
    },

    handleSortChange: function(sortInfo){
        // console.log(sortInfo)
        // SORT_INFO = sortInfo
        // this.setState({})
    },

    onColumnChange: function(column, visible){
        column.hidden = !visible

        this.setState({})
    },

    onColumnOrderChange: function(index, dropIndex){
        var first = columns[index]
        columns[index] = columns[dropIndex]
        columns[dropIndex] = first

        this.setState({})
    },

    onColumnResize: function(firstCol, firstSize, secondCol, secondSize){
        firstCol.width = firstSize

        if (secondCol){
            secondCol.width = secondSize
        }

        this.setState({})
    },

    render: function(){

        var groupBy = ['grade']

        function rowStyle(data, props){
            var style = {}
            if (props.index % 4 == 0){
                style.color = 'red'
            }
            return style
        }

        var onCollapseChange = function(collapsed, data){
            data.collapsed = collapsed

            this.setState({})
        }.bind(this)

        return <div >
            <DataGrid
                indexParents={false}
                onColumnVisibilityChange={this.onColumnChange}
                onColumnOrderChange={this.onColumnOrderChange}
                onColumnResize={this.onColumnResize}
                rowStyle={rowStyle}
                onSortChange={this.handleSortChange}
                idProperty='id'
                style={{border: '1px solid gray', height: 700}}
                data={data}
                columns={columns}
                onCollapseChange={onCollapseChange}
            />
        </div>

    }
})

React.render((
    <App />
), document.getElementById('content'))