'use strict';

var prefixer = require('react-prefixr')
var assign   = require('object-assign')

/**
 * This function renders the expand tool for the given data object
 *
 * If props.expandTool is false, returns null, so no expand tool will be rendered
 *
 * Otherwise, if expandTool is !== false either call it,
 * if it is a function, or simply render the default tool.
 *
 * In case expand tool is a function, we allow that function to return nothing. In this case
 * we assume it just modifies the expandToolProps, so we will render the default expand tool.
 * Of course in case the function returns something (even false), we simply return that
 *
 * @param  {Object} data
 * @param  {Object} [props]
 * @param  {Object} [props.defaultExpandToolStyle]
 * @param  {Object} [props.expandToolStyle]
 * @return {ReactElement}
 */
module.exports = function(data, props) {

    props = props || this.props

    var items = data[props.childrenName]

    if (!Array.isArray(items)){
        return null
    }

    var expandTool = props.expandTool

    if (expandTool === false){
        return
    }

    var collapsed = this.isCollapsed(data)
    var collapsedStyle

    if (collapsed){
        collapsedStyle = prefixer({
            transform: 'rotate(-90deg)',
            display  : 'inline-block'
        })
    }

    var onClick = this.handleExpandToolClick.bind(this, collapsed, data)
    var style   = assign({}, props.defaultExpandToolStyle, props.expandToolStyle, collapsedStyle)

    var expandToolProps = {
        key      : 'expandTool',
        style    : style,
        onClick  : onClick,
        collapsed: collapsed,
        children : '▾'
    }

    var result

    if (expandTool){
        result = expandTool
        if (typeof expandTool == 'function'){
            result = expandTool(expandToolProps)
        }
    }

    return result === undefined?
            React.DOM.span(expandToolProps):
            result
}