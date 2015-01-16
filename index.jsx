'use strict';

require('./index.styl')

var sorty = require('sorty')
var React = require('react')
var DataGrid = require('./src')

var columns = [
    {
        name: 'id',
        defaultWidth: 200,
        defaultVisible: true,
        filterable: false,
        render: function(value){

            return <span><input type="checkbox" />{value}</span>
        }
    },
    {
        name: 'text',
        filterable: false,
        defaultVisible: true,
        defaultWidth: 300
    }
]

var data = require('./data')

var App = React.createClass({

    handleSortChange: function(sortInfo){
        // console.log(sortInfo)
        // SORT_INFO = sortInfo
        // this.setState({})
    },

    onColumnOrderChange: function(index, dropIndex){
        var first = columns[index]
        columns[index] = columns[dropIndex]
        columns[dropIndex] = first

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

        function row(props){
            props.onClick = function(){
                console.log('row click', props.index, props.data)
            }

            props.onContextMenu = function(event){
            }
        }

        return <div >
            <DataGrid
                indexParents={false}
                onColumnOrderChange={this.onColumnOrderChange}
                rowStyle={rowStyle}
                onSortChange={this.handleSortChange}
                idProperty='id'
                style={{border: '1px solid gray', height: 700}}
                data={data}
                columns={columns}
                onCollapseChange={onCollapseChange}
                rowFactory={row}
            />
        </div>

    }
})

React.render((
    <App />
), document.getElementById('content'))