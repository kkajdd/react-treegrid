(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["ReactTreeGrid"] = factory(require("React"));
	else
		root["ReactTreeGrid"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React    = __webpack_require__(1)
	var DataGrid = __webpack_require__(6)
	var assign   = __webpack_require__(4)
	var prefixer = __webpack_require__(5)

	var buildData = __webpack_require__(2)
	var renderExpandTool = __webpack_require__(3)

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

	        props.className = this.prepareClassName(props)
	        props.data = this.prepareData(props)

	        props.treeColumn  = this.prepareTreeColumn(props)
	        props.cellFactory = this.cellFactory.bind(this, props)

	        return props
	    },

	    prepareClassName: function(props) {

	        var className = props.className || ''

	        className += ' react-treegrid'

	        return className
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function checkCollapsed(item){
	    var collapsed = item[config.collapsedName]

	    if (collapsed === undefined){
	        collapsed = item[config.defaultCollapsedName]
	    }

	    return collapsed
	}

	function buildData(data, config, info){

	    info = info || {}

	    var depth    = info.depth || 0
	    var parentId = info.parentId

	    var result = []
	    var depths  = config.depths
	    var parents = config.parents

	    var i   = 0
	    var len = data.length
	    var item
	    var id
	    var collapsed
	    var items

	    var isCollapsed = config.isCollapsed || checkCollapsed

	    for (; i < len; i++){
	        item = data[i]
	        id = item[config.idProperty]

	        if (depths){
	            depths[id] = depth
	        }
	        if (parents && parentId !== undefined){
	            parents[id] = parentId
	        }

	        result.push(item)

	        collapsed = isCollapsed(item)

	        if (!collapsed){

	            items = item[config.childrenName]

	            if (Array.isArray(items)){
	                result.push.apply(result, buildData(items, config, {
	                    depth: depth + 1,
	                    parentId: id
	                }))
	            }
	        }
	    }

	    return result
	}

	module.exports = buildData

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var prefixer = __webpack_require__(5)
	var assign   = __webpack_require__(4)

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var el;

	if(!!global.document){
	  el = global.document.createElement('div');
	}

	var prefixes = ["ms", "Moz", "Webkit", "O"];
	var properties = [
	  'transform',
	  'transition',
	  'transformOrigin',
	  'transformStyle',
	  'transitionProperty',
	  'transitionDuration',
	  'transitionTimingFunction',
	  'transitionDelay',
	  'borderImage',
	  'borderImageSlice',
	  'boxShadow',
	  'backgroundClip',
	  'backfaceVisibility',
	  'perspective',
	  'perspectiveOrigin',
	  'animation',
	  'animationDuration',
	  'animationName',
	  'animationDelay',
	  'animationDirection',
	  'animationIterationCount',
	  'animationTimingFunction',
	  'animationPlayState',
	  'animationFillMode',
	  'appearance'
	];

	function GetVendorPrefix(property) {
	  if(properties.indexOf(property) == -1 || !global.document || typeof el.style[property] !== 'undefined'){
	    return property;
	  }

	  property = property[0].toUpperCase() + property.slice(1);
	  var temp;

	  for(var i = 0; i < prefixes.length; i++){
	    temp = prefixes[i] + property;
	    if(typeof el.style[temp] !== 'undefined'){
	      prefixes = [prefixes[i]]; // we only need to check this one prefix from now on.
	      return temp;
	    }
	  }
	  return property[0].toLowerCase() + property.slice(1);
	}


	module.exports = (function(){
	  var cache = {};
	  return function(obj){
	    if(!global.document){
	      return obj;
	    }

	    var result = {};

	    for(var key in obj){
	      if(cache[key] === undefined){
	        cache[key] = GetVendorPrefix(key);  
	      }
	      result[cache[key]] = obj[key];
	    }

	    return result;
	  };
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React    = __webpack_require__(1)
	var assign   = __webpack_require__(17)
	var LoadMask = __webpack_require__(19)
	var Region   = __webpack_require__(18)

	var Column = __webpack_require__(9)

	var PropTypes      = __webpack_require__(7)
	var Wrapper        = __webpack_require__(10)
	var Header         = __webpack_require__(11)
	var WrapperFactory = React.createFactory(Wrapper)
	var HeaderFactory  = React.createFactory(Header)

	var findIndexByName = __webpack_require__(12)
	var group           = __webpack_require__(13)

	var slice          = __webpack_require__(14)
	var renderTable    = __webpack_require__(15)
	var getGroupedRows = __webpack_require__(16)


	function emptyFn(){}

	function getVisibleCount(columns){
	    return columns.filter(function(c)  {return c.visible;}).length
	}

	function findColumn(columns, column){

	    var name = typeof column === 'string'? column: column.name
	    var index = findIndexByName(columns, name)

	    if (~index){
	        return columns[index]
	    }
	}

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid',

	    propTypes: {
	        loading          : React.PropTypes.bool,
	        virtualRendering : React.PropTypes.bool,

	        //specify false if you don't want any column to be resizable
	        resizableColumns : React.PropTypes.bool,
	        filterableColumns: React.PropTypes.bool,

	        //specify false if you don't want column menus to be displayed
	        withColumnMenu   : React.PropTypes.bool,
	        cellEllipsis     : React.PropTypes.bool,
	        sortable         : React.PropTypes.bool,
	        idProperty       : React.PropTypes.string.isRequired,

	        //you can customize the column menu by specifying a factory
	        columnMenuFactory: React.PropTypes.func,

	        /**
	         * @cfg {Number/String} columnMinWidth=50
	         */
	        columnMinWidth   : PropTypes.numeric,
	        scrollBy         : PropTypes.numeric,
	        rowHeight        : PropTypes.numeric,
	        sortInfo         : PropTypes.sortInfo,
	        columns          : PropTypes.column
	    },

	    getDefaultProps: __webpack_require__(8),

	    componentDidMount: function(){
	        window.addEventListener('click', this.windowClickListener = this.onWindowClick)
	    },

	    componentWillUnmount: function(){
	        window.removeEventListener('click', this.windowClickListener)
	    },

	    onWindowClick: function(){
	        if (this.state.menuColumn){
	            this.setState({
	                menuColumn: null,
	                menu      : null
	            })
	        }
	    },

	    getInitialState: function(){
	        return {
	            scrollLeft: 0,
	            scrollTop : 0,
	            renderStartIndex: 0,
	            menuColumn: null
	        }
	    },

	    handleScrollLeft: function(scrollLeft){
	        this.setState({
	            scrollLeft: scrollLeft,
	            menuColumn: null
	        })
	    },

	    handleScrollTop: function(scrollTop){
	        var state = {
	            menuColumn: null
	        }

	        if (this.props.virtualRendering){
	            state.renderStartIndex = Math.ceil(scrollTop / this.props.rowHeight)
	        } else {
	            state.scrollTop = scrollTop
	        }

	        this.setState(state)
	    },

	    getRenderEndIndex: function(props, state){
	        var startIndex = state.renderStartIndex
	        var rowCount   = props.rowCountBuffer
	        var length     = props.data.length

	        if (state.groupData){
	            length += state.groupData.groupsCount
	        }

	        if (!rowCount){
	            var maxHeight
	            if (props.style && typeof props.style.height === 'number'){
	                maxHeight = props.style.height
	            } else {
	                maxHeight = window.screen.height
	            }
	            rowCount = Math.floor(maxHeight / props.rowHeight)
	        }

	        var endIndex = startIndex + rowCount

	        if (endIndex > length - 1){
	            endIndex = length
	        }

	        return endIndex
	    },

	    onDropColumn: function(index, dropIndex){
	        ;(this.props.onColumnOrderChange || emptyFn)(index, dropIndex)
	    },

	    toggleColumn: function(props, column){

	        var visible = column.visible

	        column = findColumn(this.props.columns, column)

	        if (visible && getVisibleCount(props.columns) === 1){
	            return
	        }

	        var onHide  = this.props.onColumnHide || emptyFn
	        var onShow  = this.props.onColumnShow || emptyFn

	        visible?
	            onHide(column):
	            onShow(column)

	        var onChange = this.props.onColumnVisibilityChange || emptyFn

	        onChange(column, !visible)

	        if (column.defaultVisible != null){
	            //stateful behaviour
	            column.defaultVisible = !visible
	            this.setState({})
	        }
	    },

	    showColumnMenu: function(menu, column, menuOffset, event){

	        this.setState({
	            menu: menu,
	            menuColumn: column,
	            menuOffset: menuOffset
	        })
	    },

	    prepareHeader: function(props, state){

	        var allColumns = props.columns
	        var columns    = props.columns.filter(function(c)  {return c.visible;})

	        return (props.headerFactory || HeaderFactory)({
	            scrollLeft       : state.scrollLeft,
	            resizing         : state.resizing,
	            columns          : columns,
	            allColumns       : allColumns,
	            cellPadding      : props.cellPadding,
	            scrollbarSize    : props.scrollbarSize,
	            sortInfo         : props.sortInfo,
	            resizableColumns : props.resizableColumns,
	            filterableColumns: props.filterableColumns,
	            withColumnMenu   : props.withColumnMenu,
	            sortable         : props.sortable,

	            onDropColumn     : this.onDropColumn,
	            onSortChange     : props.onSortChange,
	            onColumnResizeDragStart: this.onColumnResizeDragStart,
	            onColumnResizeDrag: this.onColumnResizeDrag,
	            onColumnResizeDrop: this.onColumnResizeDrop,

	            toggleColumn     : this.toggleColumn.bind(this, props),
	            showColumnMenu   : this.showColumnMenu,
	            menuColumn       : state.menuColumn,
	            columnMenuFactory: props.columnMenuFactory

	        })
	    },

	    prepareFooter: function(props, state){
	        return (props.footerFactory || React.DOM.div)({
	            className: 'z-footer-wrapper'
	        })
	    },

	    render: function(){
	        var props = this.prepareProps(this.props)

	        var header      = this.prepareHeader(props, this.state)
	        var wrapper     = this.prepareWrapper(props, this.state)
	        var footer      = this.prepareFooter(props, this.state)
	        var resizeProxy = this.prepareResizeProxy(props, this.state)

	        return (
	            React.createElement("div", {className: props.className, style: props.style}, 
	                React.createElement("div", {className: "z-inner"}, 
	                    header, 
	                    wrapper, 
	                    footer
	                ), 

	                React.createElement(LoadMask, {visible: props.loading}), 
	                resizeProxy
	            )
	        )
	    },

	    renderTable: function(props, state){
	        var table
	        var rows

	        if (props.groupBy){
	            rows = this.groupedRows = this.groupedRows || getGroupedRows(props, state.groupData)
	            rows = slice(rows, props)
	        }

	        table = renderTable(props, rows)

	        return table
	    },

	    prepareWrapper: function(props, state){
	        var virtualRendering = props.virtualRendering

	        var data       = props.data
	        var scrollTop  = state.scrollTop
	        var startIndex = state.renderStartIndex
	        var endIndex   = virtualRendering?
	                            this.getRenderEndIndex(props, state):
	                            0

	        var renderCount = virtualRendering?
	                            endIndex + 1 - startIndex:
	                            data.length

	        if (props.virtualRendering){
	            scrollTop = startIndex * props.rowHeight
	        }

	        var wrapperProps = assign({
	            scrollLeft      : state.scrollLeft,
	            scrollTop       : scrollTop,
	            startIndex      : startIndex,
	            totalLength     : data.length,
	            renderCount     : renderCount,
	            endIndex        : endIndex,

	            allColumns      : props.columns,

	            onScrollLeft    : this.handleScrollLeft,
	            onScrollTop     : this.handleScrollTop,

	            menu            : state.menu,
	            menuColumn      : state.menuColumn,
	            menuOffset      : state.menuOffset,

	            cellFactory     : props.cellFactory,
	            rowStyle        : props.rowStyle,
	            rowClassName    : props.rowClassName
	        }, props)

	        wrapperProps.columns = props.columns.filter(function(c)  {return c.visible;})
	        wrapperProps.table   = this.renderTable(wrapperProps, state)

	        return (props.WrapperFactory || WrapperFactory)(wrapperProps)

	    },

	    prepareProps: function(thisProps){
	        var props = assign({}, thisProps)

	        this.prepareClassName(props)
	        props.style = this.prepareStyle(props)

	        this.prepareColumns(props)
	        // this.groupData(props)

	        return props
	    },

	    groupData: function(props){
	        if (props.groupBy){

	            this.setState({
	                groupData: group(props.data, props.groupBy)
	            })
	        }

	        delete this.groupedRows
	    },

	    componentWillMount: function(){
	        this.groupData(this.props)
	    },

	    componentWillReceiveProps: function(nextProps){
	        this.groupData(nextProps)
	    },

	    prepareStyle: function(props){
	        var style = {}

	        assign(style, props.defaultStyle, props.style)

	        return style
	    },

	    prepareClassName: function(props){
	        props.className = props.className || ''
	        props.className += props.defaultClassName

	        if (props.cellEllipsis){
	            props.className += ' ' + props.cellEllipsisCls
	        }

	        if (props.styleAlternateRows){
	            props.className += ' ' + props.styleAlternateRowsCls
	        }

	        if (props.showCellBorders){
	            var cellBordersCls = props.showCellBorders === true?
	                                    props.showCellBordersCls + '-horizontal ' + props.showCellBordersCls + '-vertical':
	                                    props.showCellBordersCls + '-' + props.showCellBorders

	            props.className += ' ' + cellBordersCls

	        }

	        if (props.withColumnMenu){
	            props.className += ' ' + props.withColumnMenuCls
	        }
	    },

	    ///////////////////////////////////////
	    ///
	    /// Code dealing with preparing columns
	    ///
	    ///////////////////////////////////////
	    prepareColumns: function(props){
	        props.columns = props.columns.map(function(c)  {return Column(c, props);})

	        this.prepareColumnSizes(props)

	        props.columns.forEach(this.prepareColumnStyle.bind(this, props))
	    },

	    prepareColumnStyle: function(props, column){
	        var style    = column.style = {}
	        var minWidth = column.minWidth || props.columnMinWidth

	        style.minWidth = minWidth

	        if (column.flexible){
	            style.flex = column.flex || 1
	        } else {
	            style.width    = column.width
	            style.minWidth = column.width
	        }
	    },

	    prepareColumnSizes: function(props){

	        var visibleColumns = props.columns.filter(function(c)  {return c.visible;})
	        var totalWidth     = 0
	        var flexCount      = 0

	        visibleColumns.forEach(function(column){
	            column.minWidth = column.minWidth || props.columnMinWidth

	            if (!column.flexible){
	                totalWidth += column.width
	                return 0
	            } else if (column.minWidth){
	                totalWidth += column.minWidth
	            }

	            flexCount++
	        }, this)

	        props.columnFlexCount  = flexCount
	        props.totalColumnWidth = totalWidth
	    },

	    prepareResizeProxy: function(props, state){

	        var style = {}

	        if (state.resizing){
	            style.display = 'block'
	            style.left = state.resizeProxyLeft
	        }

	        return React.createElement("div", {className: "z-resize-proxy", style: style})
	    },

	    onColumnResizeDragStart: function(config){

	        var domNode = this.getDOMNode()
	        var region  = Region.from(domNode)
	        var state = config

	        state.resizeProxyOffset = state.resizeProxyLeft - region.left
	        state.resizeProxyLeft = state.resizeProxyOffset

	        this.setState(state)
	    },

	    onColumnResizeDrag: function(config){
	        var resizeProxyOffset = this.state.resizeProxyOffset

	        config.resizeProxyLeft = resizeProxyOffset + config.resizeProxyDiff

	        this.setState(config)
	    },

	    onColumnResizeDrop: function(config, resizeInfo){

	        var props   = this.props
	        var columns = props.columns

	        var onColumnResize = props.onColumnResize || emptyFn
	        var first = resizeInfo[0]

	        var firstCol  = findColumn(columns, first.name)
	        var firstSize = first.size

	        var second = resizeInfo[1]
	        var secondCol = second? findColumn(columns, second.name): undefined
	        var secondSize = second? second.size: undefined

	        //if defaultWidth specified, update it
	        if (firstCol.width == null && firstCol.defaultWidth){
	            firstCol.defaultWidth = firstSize
	        }

	        if (secondCol && secondCol.width == null && secondCol.defaultWidth){
	            secondCol.defaultWidth = secondSize
	        }

	        this.setState(config)

	        onColumnResize(firstCol, firstSize, secondCol, secondSize)
	    }
	})

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function val(fn){

	    return function(props, propName){

	        return fn(props[propName], propName, props)
	    }
	}

	module.exports = {
	    numeric: val(function(value, propName){

	        if (value == null){
	            return
	        }
	        if (value * 1 != value){
	            return new Error('Invalid numeric value for ' + propName)
	        }
	    }),

	    sortInfo: val(function(value){
	        if (typeof value == 'string' || typeof value == 'number'){
	            return new Error('Invalid sortInfo specified')
	        }
	    }),

	    column: val(function(value, props, propName){

	        if (!value){
	            return new Error('No columns specified. Please specify at least one column!')
	        }

	        if (!Array.isArray(value)){
	            value = props[propName] = [value]
	        }

	        var err

	        value.some(function(col, index){
	            if (!col.name){
	                err = new Error('All grid columns must have a name! Column at index ' + index + ' has no name!')
	                return true
	            }
	        })

	        return err

	    })
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(){
	    return {
	        loading: false,
	        columnMinWidth: 50,
	        cellPadding: 5,
	        scrollbarSize: 16,

	        scrollBy: undefined,
	        virtualRendering: true,

	        styleAlternateRowsCls: 'z-style-alternate',
	        withColumnMenuCls: 'z-with-column-menu',
	        cellEllipsisCls: 'z-cell-ellipsis',
	        defaultClassName: 'react-datagrid',

	        withColumnMenu: true,
	        sortable: true,
	        filterableColumns: true,
	        resizableColumns: true,

	        showCellBordersCls: 'z-cell-borders',
	        showCellBorders: false,
	        styleAlternateRows: true,
	        cellEllipsis: true,
	        rowHeight: 31,

	        groupNestingWidth: 20,

	        defaultStyle: {
	            position: 'relative'
	        }

	    }
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var humanize = __webpack_require__(30).humanize
	var assign   = __webpack_require__(17)

	function getVisibleInfo(col){
	    var visible = true
	    var defaultVisible

	    if (col.hidden != null){
	        visible = !col.hidden
	    } else if (col.visible != null){
	        visible = !!col.visible
	    } else {
	        //no visible or hidden specified
	        //so we look for defaultVisible/defaultHidden

	        if (col.defaultHidden != null){
	            defaultVisible = !col.defaultHidden
	        } else if (col.defaultVisible != null){
	            defaultVisible = !!col.defaultVisible
	        }

	        if (defaultVisible != null){
	            visible = defaultVisible
	        }
	    }

	    return {
	        visible: visible,
	        defaultVisible: defaultVisible
	    }
	}

	var Column = function(col, props){

	    col = assign({}, Column.defaults, col)

	    //title
	    if (!col.title){
	        col.title = humanize(col.name)
	    }

	    //sortable
	    if (props && !props.sortable){
	        col.sortable = false
	    }
	    col.sortable = !!col.sortable

	    //resizable
	    if (props && props.resizableColumns === false){
	        col.resizable = false
	    }
	    col.resizable = !!col.resizable

	    //filterable
	    if (props && props.filterableColumns === false){
	        col.filterable = false
	    }
	    col.filterable = !!col.filterable

	    var visibleInfo = getVisibleInfo(col)
	    var visible = visibleInfo.visible

	    if (visibleInfo.defaultVisible != null){
	        col.defaultHidden  = !visibleInfo.defaultVisible
	        col.defaultVisible = visibleInfo.defaultVisible
	    }

	    //hidden
	    col.hidden = !visible
	    //visible
	    col.visible  = visible

	    if (col.width == null && col.defaultWidth){
	        col.width = col.defaultWidth
	    }

	    //flexible
	    col.flexible = !col.width

	    return col
	}

	Column.displayName = 'Column'

	Column.defaults = {
	    sortable  : true,
	    filterable: true,
	    resizable : true,
	    type      : 'string'
	}

	module.exports = Column

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(17)

	function signum(x){
	    return x < 0? -1: 1
	}

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.Wrapper',

	    propTypes: {
	        scrollLeft      : React.PropTypes.number,
	        scrollTop       : React.PropTypes.number,
	        scrollbarSize   : React.PropTypes.number,
	        totalColumnWidth: React.PropTypes.number,
	        cellPadding     : React.PropTypes.number,
	        rowHeight       : React.PropTypes.any,

	        data            : React.PropTypes.array,
	        columns         : React.PropTypes.array,
	        idProperty      : React.PropTypes.string.isRequired,

	        rowFactory      : React.PropTypes.func
	    },

	    getDefaultProps: function(){

	        return {
	            scrollLeft: 0,
	            scrollTop : 0
	        }
	    },

	    syncVerticalScroller: function(){

	        var scrollTop = this.props.scrollTop

	        this.refs.verticalScrollbar.getDOMNode().scrollTop = scrollTop
	    },

	    render: function() {

	        var props     = this.prepareProps(this.props)
	        var rowsCount = props.renderCount

	        var groupsCount = 0
	        var table = props.table

	        if (props.groupData){
	            groupsCount = props.groupData.groupsCount
	        }

	        if (props.virtualRendering){
	            rowsCount += groupsCount
	        }

	        this.groupsCount = groupsCount

	        // console.log(props.renderCount)

	        var horizontalScrollerSize = props.totalColumnWidth + props.scrollbarSize
	        var verticalScrollerSize   = (props.totalLength + groupsCount) * props.rowHeight

	        return (
	            React.createElement("div", {className: "z-wrapper", style: {height: rowsCount * props.rowHeight}}, 
	                React.createElement("div", {ref: "tableWrapper", className: "z-table-wrapper", style: {paddingRight: props.scrollbarSize}, onWheel: this.handleWheel}, 
	                    table, 
	                    React.createElement("div", {ref: "verticalScrollbar", className: "z-vertical-scrollbar", style: {width: props.scrollbarSize}, onScroll: this.handleVerticalScroll}, 
	                        React.createElement("div", {className: "z-vertical-scroller", style: {height: verticalScrollerSize}})
	                    ), 
	                    React.createElement("div", {className: "z-horizontal-scroller", style: {width: horizontalScrollerSize}})
	                ), 
	                React.createElement("div", {ref: "horizontalScrollbar", className: "z-horizontal-scrollbar", onScroll: this.handleHorizontalScroll}, 
	                    React.createElement("div", {className: "z-horizontal-scroller", style: {width: horizontalScrollerSize}})
	                )
	            )
	        )
	    },

	    handleWheel: function(event){
	        event.stopPropagation()
	        event.preventDefault()

	        var delta = event.deltaY

	        if (delta && Math.abs(delta) < 40){
	            delta = signum(delta) * 40
	        }

	        if (event.shiftKey){

	            if (!delta){
	                delta = event.deltaX
	            }

	            var horizontalScrollbar = this.refs.horizontalScrollbar
	            horizontalScrollbar.getDOMNode().scrollLeft += delta
	            return
	        }

	        this.addMouseWheelDelta(delta)
	    },

	    getTableScrollHeight: function(){
	        var props  = this.props
	        var result = props.virtualRendering?
	                        (props.totalLength + this.groupsCount || 0) * props.rowHeight:
	                        this.refs.table.getDOMNode().offsetHeight

	        return result
	    },

	    addMouseWheelDelta: function(deltaY){
	        var props   = this.props
	        var virtual = props.virtualRendering

	        var tableHeight         = this.getTableScrollHeight()
	        var tableWrapper        = this.refs.tableWrapper.getDOMNode()
	        var horizontalScrollbar = this.refs.horizontalScrollbar.getDOMNode()
	        var wrapperHeight       = tableWrapper.offsetHeight - horizontalScrollbar.offsetHeight

	        var scrollTop = virtual?
	                            props.startIndex * props.rowHeight:
	                            props.scrollTop

	        if (virtual && deltaY < 0 && -deltaY < props.rowHeight){
	            //when scrolling to go up, account for the case where abs(deltaY)
	            //is less than the rowHeight, as this results in no scrolling
	            //so make sure it's at least deltaY
	            deltaY = -props.rowHeight
	        }

	        if (virtual && props.scrollBy){
	            deltaY = signum(deltaY) * props.scrollBy * props.rowHeight
	        }

	        scrollTop += deltaY

	        if (scrollTop + wrapperHeight > tableHeight){
	            scrollTop = tableHeight - wrapperHeight
	        }
	        if (scrollTop < 0){
	            scrollTop = 0
	        }

	        this.onVerticalScroll(scrollTop)

	        setTimeout(function(){
	            this.syncVerticalScroller()
	        }.bind(this), 0)
	    },


	    handleHorizontalScroll: function(event){
	        this.props.onScrollLeft(event.target.scrollLeft)
	    },
	    handleVerticalScroll: function(event){
	        this.onVerticalScroll(event.target.scrollTop)
	    },

	    onVerticalScroll: function(pos){
	        this.props.onScrollTop(pos)
	    },

	    prepareProps: function(thisProps){
	        var props = {}

	        assign(props, thisProps)

	        return props
	    }
	})


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React   = __webpack_require__(1)
	var Region  = __webpack_require__(18)
	var ReactMenu = React.createFactory(__webpack_require__(33))
	var assign  = __webpack_require__(17)
	var clone   = __webpack_require__(32)
	var asArray = __webpack_require__(20)
	var findIndexBy = __webpack_require__(21)
	var findIndexByName = __webpack_require__(12)
	var Cell    = __webpack_require__(27)
	var setupColumnDrag   = __webpack_require__(22)
	var setupColumnResize = __webpack_require__(23)

	function emptyFn(){}

	function getColumnSortInfo(column, sortInfo){

	    sortInfo = asArray(sortInfo)

	    var index = findIndexBy(sortInfo, function(info){
	        return info.name === column.name
	    })

	    return sortInfo[index]
	}

	function removeColumnSort(column, sortInfo){
	    sortInfo = asArray(sortInfo)

	    var index = findIndexBy(sortInfo, function(info){
	        return info.name === column.name
	    })

	    if (~index){
	        sortInfo.splice(index, 1)
	    }

	    return sortInfo
	}

	function getDropState(){
	    return {
	        dragLeft  : null,
	        dragColumn: null,
	        dragColumnIndex: null,
	        dragging  : false,
	        dropIndex : null,

	        shiftIndexes: null,
	        shiftSize: null
	    }
	}

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.Header',

	    propTypes: {
	        columns: React.PropTypes.array
	    },

	    onDrop: function(event){
	        if (this.state.dragging){
	            event.stopPropagation()
	        }

	        var dragIndex = this.state.dragColumnIndex
	        var dropIndex = this.state.dropIndex

	        if (dropIndex != null){

	            //since we need the indexes in the array of all columns
	            //not only in the array of the visible columns
	            //we need to search them and make this transform
	            var dragColumn = this.props.columns[dragIndex]
	            var dropColumn = this.props.columns[dropIndex]

	            dragIndex = findIndexByName(this.props.allColumns, dragColumn.name)
	            dropIndex = findIndexByName(this.props.allColumns, dropColumn.name)

	            this.props.onDropColumn(dragIndex, dropIndex)
	        }

	        this.setState(getDropState())
	    },

	    getDefaultProps: function(){
	        return {
	            defaultClassName : 'z-header-wrapper',
	            draggingClassName: 'z-dragging',
	            cellClassName    : 'z-column-header',
	            defaultStyle    : {},
	            sortInfo        : null,
	            scrollLeft      : 0,
	            scrollTop       : 0
	        }
	    },

	    getInitialState: function(){

	        return {
	            mouseOver : true,
	            dragging  : false,

	            shiftSize : null,
	            dragColumn: null,
	            shiftIndexes: null
	        }
	    },

	    render: function() {

	        var props = this.prepareProps(this.props)

	        var cells = props.columns
	                        .map(this.renderCell.bind(this, props, this.state))

	        var headerStyle = {
	            paddingRight: props.scrollbarSize,
	            transform   : 'translate3d(' + -props.scrollLeft + 'px, ' + -props.scrollTop + 'px, 0px)'
	        }

	        return (
	            React.createElement("div", {style: props.style, className: props.className}, 
	                React.createElement("div", {className: "z-header", style: headerStyle}, 
	                    cells
	                )
	            )
	        )
	    },

	    renderCell: function(props, state, column, index){

	        var resizing  = props.resizing
	        var text      = column.title
	        var className = props.cellClassName || ''
	        var style     = {
	            left: 0
	        }

	        var menu = this.renderColumnMenu(props, state, column, index)

	        if (state.dragColumn && state.shiftIndexes && state.shiftIndexes[index]){
	            style.left = state.shiftSize
	        }

	        if (state.dragColumn === column){
	            className += ' z-drag z-over'
	            style.zIndex = 1
	            style.left = state.dragLeft || 0
	        }

	        var filter  = column.filterable?
	                        React.createElement("div", {className: "z-show-filter", onClick: this.handleFilterClick.bind(this, column)}):
	                        null

	        var resizer = column.resizable?
	                        React.createElement("span", {className: "z-column-resize", onMouseDown: this.handleResizeMouseDown.bind(this, column)}):
	                        null

	        if (column.sortable){
	            text = React.createElement("span", null, text, React.createElement("span", {className: "z-icon-sort-info"}))

	            var sortInfo = getColumnSortInfo(column, props.sortInfo)

	            if (sortInfo && sortInfo.dir){
	                className += (sortInfo.dir === -1 || sortInfo.dir === 'desc'?
	                                ' z-desc':
	                                ' z-asc')
	            }

	            className += ' z-sortable'
	        }

	        if (filter){
	            className += ' z-filterable'
	        }

	        if (state.mouseOver === column.name && !resizing){
	            className += ' z-over'
	        }

	        if (props.menuColumn === column.name){
	            className += ' z-active'
	        }

	        className += ' z-unselectable'

	        return (
	            React.createElement(Cell, {
	                key: column.name, 
	                textPadding: props.cellPadding, 
	                columns: props.columns, 
	                index: index, 
	                className: className, 
	                style: style, 
	                text: text, 
	                onMouseOver: this.handleMouseOver.bind(this, column), 
	                onMouseOut: this.handleMouseOut.bind(this, column), 
	                onMouseDown: this.handleMouseDown.bind(this, column), 

	                onMouseUp: this.handleMouseUp.bind(this, column)
	            }, 
	                filter, 
	                menu, 
	                resizer
	            )
	        )
	    },

	    toggleSort: function(column){
	        var sortInfo       = asArray(clone(this.props.sortInfo))
	        var columnSortInfo = getColumnSortInfo(column, sortInfo)

	        if (!columnSortInfo){
	            columnSortInfo = {
	                name: column.name,
	                type: column.type,
	                fn  : column.sortFn
	            }

	            sortInfo.push(columnSortInfo)
	        }

	        if (typeof column.toggleSort === 'function'){
	            column.toggleSort(columnSortInfo, sortInfo)
	        } else {

	            var dir     = columnSortInfo.dir
	            var dirSign = dir === 'asc'? 1 : dir === 'desc'? -1: dir
	            var newDir  = dirSign === 1? -1: dirSign === -1?  0: 1

	            columnSortInfo.dir = newDir

	            if (!newDir){
	                sortInfo = removeColumnSort(column, sortInfo)
	            }
	        }

	        ;(this.props.onSortChange || emptyFn)(sortInfo)
	    },

	    renderColumnMenu: function(props, state, column, index){
	        if (!props.withColumnMenu){
	            return
	        }

	        return React.createElement("div", {className: "z-show-menu", onClick: this.handleShowMenuClick.bind(this, props, column, index)})
	    },

	    handleShowMenuClick: function(props, column, index, event){
	        event.stopPropagation()

	        var dom = this.getDOMNode()
	        var domRegion    = Region.from(dom)
	        var targetRegion = Region.from(event.target)
	        var offset = event.pageX - targetRegion.left

	        var menuOffset = {
	            left: event.pageX - domRegion.left - offset
	        }

	        if (index === props.columns.length - 1){
	            offset = targetRegion.right - event.pageX
	            menuOffset = {
	                right: domRegion.right - event.pageX - offset
	            }
	        }

	        this.showMenu(column, menuOffset, event)
	    },

	    showMenu: function(column, offset, event){

	        var menuItem = function(column){
	            return {
	                cls     : column.visible?'z-selected': '',
	                selected: column.visible? '✓': '',
	                label   : column.title,
	                fn      : this.toggleColumn.bind(this, column)
	            }
	        }.bind(this)

	        function menu(eventTarget, props){

	            var columns = props.gridColumns

	            props.columns = [ 'selected', 'label']
	            props.items = columns.map(menuItem)
	            props.alignTo = eventTarget
	            props.alignPositions = [
	                'tl-bl',
	                'tr-br',
	                'bl-tl',
	                'br-tr'
	            ]
	            props.style = {
	                position: 'absolute'
	            }

	            var factory = this.props.columnMenuFactory || ReactMenu

	            var result = factory(props)

	            return result === undefined?
	                    ReactMenu(props):
	                    result
	        }

	        this.props.showColumnMenu(menu.bind(this, event.target), column.name, offset, event)
	    },

	    toggleColumn: function(column){
	        this.props.toggleColumn(column)
	    },

	    hideMenu: function(){
	        this.props.showColumnMenu(null, null)
	    },

	    handleResizeMouseDown: function(column, event){
	        setupColumnResize(this, this.props, column, event)

	        //in order to prevent setupColumnDrag in handleMouseDown
	        // event.stopPropagation()

	        //we are doing setupColumnDrag protection using the resizing flag on native event
	        if (event.nativeEvent){
	            event.nativeEvent.resizing = true
	        }
	    },

	    handleFilterClick: function(column, event){
	        event.stopPropagation()
	    },

	    handleMouseUp: function(column, event){
	        if (this.state.dragging){
	            return
	        }

	        if (column.sortable){
	            this.toggleSort(column)
	        }
	    },

	    handleMouseOut: function(column){
	        this.setState({
	            mouseOver: false
	        })
	    },

	    handleMouseOver: function(column){
	        this.setState({
	            mouseOver: column.name
	        })
	    },

	    handleMouseDown: function(column, event){
	        if (event && event.nativeEvent && event.nativeEvent.resizing){
	            return
	        }

	        setupColumnDrag(this, this.props, column, event)
	    },

	    onResizeDragStart: function(config){
	        this.props.onColumnResizeDragStart(config)
	    },

	    onResizeDrag: function(config){
	        this.props.onColumnResizeDrag(config)
	    },

	    onResizeDrop: function(config, resizeInfo){
	        this.props.onColumnResizeDrop(config, resizeInfo)
	    },

	    prepareProps: function(thisProps){
	        var props = {}

	        assign(props, thisProps)

	        this.prepareClassName(props)
	        this.prepareStyle(props)

	        return props
	    },

	    prepareClassName: function(props){
	        props.className = props.className || ''
	        props.className += ' ' + props.defaultClassName

	        if (this.state.dragging){
	            props.className += ' ' + props.draggingClassName
	        }
	    },

	    prepareStyle: function(props){
	        var style = props.style = {}

	        assign(style, props.defaultStyle)
	    }
	})


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var findIndexBy =__webpack_require__(21)

	function findIndexByName(arr, name){
	    return findIndexBy(arr, function(info){
	        return info.name === name
	    })
	}

	module.exports = findIndexByName

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasown = __webpack_require__(31)

	function copyIf(source, target){
	    var hasOwn = hasown(target)

	    Object.keys(source).forEach(function(key){
	        if (!hasOwn(key)){
	            target[key] = source[key]
	        }
	    })
	}

	function groupByFields(data, fields, path, names, fieldIndex){
	    data       = data       || []
	    fieldIndex = fieldIndex || 0

	    var field = fields[fieldIndex]

	    if (!field){
	        return data
	    }

	    var group     = groupArrayByField(data, field)
	    var fieldName = typeof field == 'string'?
	                            field:
	                            field.name

	    if (!fieldIndex){
	        group.namePath  = []
	        group.valuePath = []
	        group.depth     = 0
	        delete group.name
	    }

	    var groupsCount = group.length

	    if (group.keys && group.keys.length){

	        group.leaf = false
	        group.keys.forEach(function(key){

	            var groupPath  = (path || []).concat(key)
	            var fieldNames = (names || []).concat(fieldName)
	            var data = groupByFields(group.data[key], fields, groupPath, fieldNames, fieldIndex + 1)

	            if (Array.isArray(data)){
	                data = {
	                    data: data,
	                    leaf: true
	                }
	            }

	            data.name      = fieldName
	            data.value     = key
	            data.valuePath = groupPath
	            data.namePath  = fieldNames
	            data.depth     = fieldIndex + 1

	            if (typeof field != 'string'){

	                copyIf(field, data)
	            }

	            group.data[key] = data

	            if (!data.leaf){
	                groupsCount += data.groupsCount
	            }

	        })
	    }

	    if (!group.leaf){
	        group.groupsCount = groupsCount
	    }

	    return group
	}

	function groupArrayByField(data, field){

	    var groupKeys      = {}
	    var groupKeysArray = []

	    var fieldName      = typeof field == 'string'?
	                            field:
	                            field.name

	    ;(data || []).forEach(function(item){
	        var itemKey = item[fieldName]

	        if (groupKeys[itemKey]){
	            groupKeys[itemKey].push(item)
	        } else {
	            groupKeys[itemKey] = [item]
	            groupKeysArray.push(itemKey)
	        }
	    })

	    var result = {
	        keys      : groupKeysArray,
	        data      : groupKeys,
	        childName : fieldName,
	        length    : groupKeysArray.length,
	        leaf      : true
	    }

	    return result
	}

	module.exports = groupByFields

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function slice(data, props){

	    if (!props.virtualRendering){
	        return data
	    }

	    return data.slice(
	            props.startIndex,
	            props.startIndex + props.renderCount
	        )
	}

	module.exports = slice

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1)
	var renderMenu = __webpack_require__(25)
	var renderRow  = __webpack_require__(24)
	var tableStyle  = __webpack_require__(26)
	var slice  = __webpack_require__(14)

	function getData(props){

	    if (!props.virtualRendering){
	        return props.data
	    }

	    return slice(props.data, props)
	}

	module.exports = function(props, rows){

	    rows = rows || getData(props).map(function(data, index){
	        return renderRow(props, data, index + props.startIndex)
	    })

	    return React.createElement("div", {ref: "table", className: "z-table", style: tableStyle(props)}, 
	        rows, 
	        renderMenu(props)
	    )
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1)

	var Row         = __webpack_require__(28)
	var Cell        = __webpack_require__(27)
	var CellFactory = React.createFactory(Cell)

	var renderRow = __webpack_require__(24)

	function renderData(props, data, depth){

	    return data.map(function(data, index){

	        return renderRow(props, data, index, function(config){
	            config.cellFactory = function(cellProps){
	                if (cellProps.index === 0){
	                    cellProps.innerStyle = {
	                        paddingLeft: depth * props.groupNestingWidth
	                    }
	                }

	                return CellFactory(cellProps)
	            }

	            config.className += ' z-grouped'

	            return config
	        })
	    })
	}

	function renderGroupRow(props, groupData){

	    var style = {
	        paddingLeft: (groupData.depth - 1)* props.groupNestingWidth
	    }

	    var cellStyle = {
	        minWidth: props.totalColumnWidth,
	        maxWidth: props.totalColumnWidth
	    }

	    return React.createElement(Row, {className: "z-group-row", key: 'group-'+groupData.valuePath, rowHeight: props.rowHeight}, 
	        React.createElement(Cell, {
	            className: "z-group-cell", 
	            textPadding: props.cellPadding, 
	            innerStyle: style, 
	            text: groupData.value, 
	            style: cellStyle}
	        )
	    )
	}

	function renderGroup(props, groupData){

	    var result = [renderGroupRow(props, groupData)]

	    if (groupData && groupData.leaf){
	        result.push.apply(result, renderData(props, groupData.data, groupData.depth))
	    } else {
	        groupData.keys.forEach(function(key){
	            var items = renderGroup(props, groupData.data[key])
	            result.push.apply(result, items)
	        })
	    }

	    return result
	}

	function renderGroups(props, groupsData){
	    var result = []

	    groupsData.keys.map(function(key){
	        result.push.apply(result, renderGroup(props, groupsData.data[key]))
	    })

	    return result
	}

	module.exports = function(props, groupData){
	    return renderGroups(props, groupData)
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(29)

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(35)
	var Loader = __webpack_require__(34)

	module.exports = React.createClass({

	    displayName: 'LoadMask',

	    getDefaultProps: function(){

	        return {
	            visibleDisplayValue: 'block',
	            defaultStyle: {
	                position: 'absolute',
	                width   : '100%',
	                height  : '100%',
	                display : 'none',
	                top: 0,
	                left: 0
	            }
	        }
	    },

	    render: function(){
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' loadmask'

	        return React.DOM.div(props, React.createElement(Loader, {size: props.size}))
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.display = props.visible?
	                        props.visibleDisplayValue:
	                        'none'

	        props.style = style
	    }
	})

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function asArray(x){
	    if (!x){
	        x = []
	    }

	    if (!Array.isArray(x)){
	        x = [x]
	    }

	    return x
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function findIndexBy(arr, fn){

	    var i   = 0
	    var len = arr.length

	    for (; i < len; i++){
	        if (fn(arr[i]) === true){
	            return i
	        }
	    }

	    return -1
	}

	module.exports = findIndexBy

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region     = __webpack_require__(18)
	var DragHelper = __webpack_require__(36)

	function range(start, end){
	    var res = []

	    for ( ; start <= end; start++){
	        res.push(start)
	    }

	    return res
	}

	function buildIndexes(direction, index, dragIndex){
	    var indexes = direction < 0 ?
	                    range(index, dragIndex):
	                    range(dragIndex, index)

	    var result = {}

	    indexes.forEach(function(value){
	        result[value] = true
	    })

	    return result
	}

	module.exports = function(header, props, column, event){

	    event.preventDefault()

	    var headerNode   = header.getDOMNode()
	    var headerRegion = Region.from(headerNode)
	    var dragColumn = column
	    var dragColumnIndex
	    var columnData
	    var shiftRegion

	    DragHelper(event, {

	        constrainTo: headerRegion.expand({ top: true, bottom: true}),

	        onDragStart: function(event, config){

	            var columnHeaders = headerNode.querySelectorAll('.' + props.cellClassName)

	            columnData = props.columns.map(function(column, i){
	                var region = Region.from(columnHeaders[i])

	                if (column === dragColumn){
	                    dragColumnIndex = i
	                    shiftRegion = region.clone()
	                }

	                return {
	                    column: column,
	                    index: i,
	                    region: region
	                }
	            })

	            header.setState({
	                dragColumn: column,
	                dragging  : true
	            })

	            config.columnData = columnData

	        },
	        onDrag: function(event, config){
	            var diff = config.diff.left
	            var directionSign = diff < 0? -1: 1
	            var state = {
	                dragColumnIndex  : dragColumnIndex,
	                dragColumn  : dragColumn,
	                dragLeft    : diff,
	                dropIndex   : null,
	                shiftIndexes: null,
	                shiftSize   : null
	            }

	            var shift
	            var shiftSize
	            var newLeft   = shiftRegion.left + diff
	            var newRight  = newLeft + shiftRegion.width
	            var shiftZone = { left: newLeft, right: newRight}

	            config.columnData.forEach(function(columnData, index, arr){

	                var itColumn = columnData.column
	                var itRegion = columnData.region

	                if (shift || itColumn === dragColumn){
	                    return
	                }

	                var itLeft  = itRegion.left
	                var itRight = itRegion.right
	                var itZone  = directionSign == -1?
	                            { left: itLeft, right: itLeft + itRegion.width }:
	                            { left: itRight - itRegion.width, right: itRight }

	                if (shiftRegion.width < itRegion.width){
	                    //shift region is smaller than itRegion
	                    shift = Region.getIntersectionWidth(
	                            itZone,
	                            shiftZone
	                        ) >= Math.min(
	                            itRegion.width,
	                            shiftRegion.width
	                        ) / 2

	                } else {
	                    //shift region is bigger than itRegion
	                    shift = Region.getIntersectionWidth(itRegion, shiftZone) >= itRegion.width / 2
	                }

	                if (shift) {
	                    shiftSize = -directionSign * shiftRegion.width
	                    state.dropIndex = index
	                    state.shiftIndexes = buildIndexes(directionSign, index, dragColumnIndex)
	                    state.shiftSize = shiftSize
	                }
	            })

	            header.setState(state)
	        },

	        onDrop: function(event){
	            header.onDrop(event)
	        }
	    })
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region     = __webpack_require__(18)
	var DragHelper = __webpack_require__(36)

	var findIndexByName = __webpack_require__(12)

	module.exports = function(header, props, column, event){

	    // event.stopPropagation()
	    event.preventDefault()

	    var columns = props.columns
	    var index = findIndexByName(columns, column.name)
	    var proxyLeft = Region.from(event.target).right

	    var headerNode = header.getDOMNode()

	    var constrainTo = Region.from(headerNode)

	    DragHelper(event, {
	        constrainTo: constrainTo,

	        onDragStart: function(event, config){

	            header.onResizeDragStart({
	                resizing       : true,
	                resizeColumn   : column,
	                resizeProxyLeft: proxyLeft
	            })
	        },

	        onDrag: function(event, config){
	            var diff = config.diff.left

	            header.onResizeDrag({
	                resizeProxyDiff: diff
	            })
	        },

	        onDrop: function(event, config){

	            var diff = config.diff.left
	            var columnHeaders = headerNode.querySelectorAll('.' + props.cellClassName)
	            var nextColumn    = diff > 0?
	                                    null:
	                                    columns[index + 1]

	            var columnSize = Region.from(columnHeaders[index]).width
	            var nextColumnSize
	            var firstSize  = columnSize + diff
	            var secondSize = 0

	            if (firstSize < column.minWidth){
	                firstSize = column.minWidth
	                diff = firstSize - columnSize
	            }

	            if (nextColumn){
	                nextColumnSize = nextColumn?
	                                        Region.from(columnHeaders[ index + 1]).width
	                                        : 0

	                secondSize = nextColumnSize - diff

	            }

	            if (nextColumn && secondSize < nextColumn.minWidth){
	                secondSize = nextColumn.minWidth
	                diff = nextColumnSize - secondSize
	                firstSize = columnSize + diff
	            }

	            var resizeInfo = [{
	                name: column.name,
	                size: firstSize,
	                diff: diff
	            }]

	            if (nextColumn){
	                resizeInfo.push({
	                    name: nextColumn.name,
	                    size: secondSize,
	                    diff: -diff
	                })
	            }

	            header.onResizeDrop({
	                resizing: false,
	                resizeColumn: null,
	                resizeProxyLeft: null
	            }, resizeInfo)
	        }
	    })
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var assign = __webpack_require__(17)

	var Row        = __webpack_require__(28)
	var RowFactory = React.createFactory(Row)

	/**
	 * Render a datagrid row
	 *
	 * @param  {Object}   props The props from which to build row props
	 * @param  {Object}   data The data object that backs this row
	 * @param  {Number}   index The index in the grid of the row to be rendered
	 * @param  {Function} [fn] A function that can be used to modify built row props
	 *
	 * If props.rowFactory is specified, it will be used to build the ReactElement
	 * corresponding to this row. In case it returns undefined, the default RowFactory will be used
	 * (this case occurs when the rowFactory was specified just to modify the row props)
	 *
	 * @return {ReactElement}
	 */
	module.exports = function renderRow(props, data, index, fn){
	    var factory  = props.rowFactory || RowFactory
	    var key      = data[props.idProperty]

	    var config = {
	        className: index % 2 === 0? 'z-even': 'z-odd',

	        key      : key,
	        data     : data,
	        index    : index,

	        cellFactory: props.cellFactory,
	        renderCell : props.renderCell,
	        renderText : props.renderText,
	        cellPadding: props.cellPadding,
	        rowHeight  : props.rowHeight,
	        columns    : props.columns
	    }

	    var style
	    var rowStyle = props.rowStyle

	    if (rowStyle){
	        style = {}

	        if (typeof rowStyle == 'function'){
	            style = rowStyle(data, config)
	        } else {
	            assign(style, rowStyle)
	        }

	        config.style = style
	    }

	    var className = props.rowClassName

	    if (typeof className == 'function'){
	        className = className(data, config)
	    }

	    if (className){
	        config.className = className
	    }

	    if (typeof fn == 'function'){
	        config = fn(config)
	    }

	    var row = factory(config)

	    if (row === undefined){
	        row = RowFactory(config)
	    }

	    return row
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	module.exports = function renderMenu(props){
	    if (!props.menuColumn){
	        return
	    }

	    var style  = {top: 0}
	    var offset = props.menuOffset

	    if (offset.left){
	        style.left = offset.left + props.scrollLeft
	    } else {
	        style.right = offset.right - props.scrollLeft - props.scrollbarSize
	    }

	    return props.menu({
	        style     : style,
	        className : 'z-header-menu-column',
	        gridColumns: props.allColumns
	    })
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(props){
	    var scrollTop  = props.virtualRendering?
	                        0:
	                        props.scrollTop

	    return {
	        transform: 'translate3d(' + -props.scrollLeft + 'px, ' + -scrollTop + 'px, 0px)'
	    }
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(17)

	function copyProps(target, source, list){

	    list.forEach(function(name){
	        if (name in source){
	            target[name] = source[name]
	        }
	    })

	}

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.Cell',

	    propTypes: {
	        className  : React.PropTypes.string,
	        textPadding: React.PropTypes.number,
	        style      : React.PropTypes.object,
	        text       : React.PropTypes.any,
	        rowIndex   : React.PropTypes.number
	    },

	    getDefaultProps: function(){
	        return {
	            text: '',
	            defaultClassName: 'z-cell'
	        }
	    },

	    render: function(){
	        var props     = this.props

	        var columns   = props.columns
	        var index     = props.index
	        var column    = columns? columns[index]: null
	        var className = props.className || ''
	        var text      = props.renderText?
	                            props.renderText(props.text, column, props.rowIndex):
	                            props.text

	        var textCellProps = {
	            className: 'z-text',
	            style    : {padding: props.textPadding}
	        }

	        var textCell = props.renderCell?
	                            props.renderCell(textCellProps, text, props):
	                            React.DOM.div(textCellProps, text)

	        if (!index){
	            className += ' z-first'
	        }
	        if (columns && index == columns.length - 1){
	            className += ' z-last'
	        }

	        className += ' ' + props.defaultClassName

	        var cellProps = {
	            className: className,
	            style    : assign({}, props.style, column? column.style: null)
	        }

	        copyProps(cellProps, props, [
	            'onMouseOver',
	            'onMouseOut',
	            'onClick',
	            'onMouseDown',
	            'onMouseUp'
	        ])

	        return (
	            React.createElement("div", React.__spread({},  cellProps), 
	                React.createElement("div", {className: "z-inner", style: props.innerStyle}, 
	                    textCell
	                ), 
	                props.children
	            )
	        )
	    }
	})

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React       = __webpack_require__(1)
	var assign      = __webpack_require__(17)
	var Cell        = __webpack_require__(27)
	var CellFactory = React.createFactory(Cell)

	module.exports = React.createClass({

	    displayName: 'ReactDataGrid.Row',

	    propTypes: {
	        data   : React.PropTypes.object,
	        columns: React.PropTypes.array,
	        index  : React.PropTypes.number
	    },

	    getDefaultProps: function(){

	        return {
	            defaultClassName: 'z-row',
	            mouseOverCls    : 'z-over',
	            defaultStyle    : {}
	        }
	    },

	    getInitialState: function(){
	        return {
	            mouseOver: false
	        }
	    },

	    render: function() {
	        var props = this.prepareProps(this.props)
	        var cells = props.children || props.columns
	                                        .map(this.renderCell.bind(this, this.props))

	        return React.createElement("div", React.__spread({},  props), cells)
	    },

	    prepareProps: function(thisProps){
	        var props = assign({}, thisProps)

	        props.className = this.prepareClassName(props, this.state)
	        props.style = this.prepareStyle(props)

	        props.onMouseEnter = this.handleMouseEnter
	        props.onMouseLeave = this.handleMouseLeave

	        delete props.data
	        delete props.cellPadding

	        return props
	    },

	    handleMouseLeave: function(event){
	        this.setState({
	            mouseOver: false
	        })

	        if (this.props.onMouseLeave){
	            this.props.onMouseLeave(event)
	        }
	    },

	    handleMouseEnter: function(event){
	        this.setState({
	            mouseOver: true
	        })

	        if (this.props.onMouseEnter){
	            this.props.onMouseEnter(event)
	        }
	    },

	    renderCell: function(props, column, index){

	        var text = props.data[column.name]

	        var cellProps = {
	            key        : column.name,
	            name       : column.name,
	            data       : props.data,
	            columns    : props.columns,
	            index      : index,
	            rowIndex   : props.index,
	            textPadding: props.cellPadding,
	            renderCell : props.renderCell,
	            renderText : props.renderText
	        }

	        if (typeof column.render == 'function'){
	            text = column.render(text, props.data, cellProps)
	        }

	        cellProps.text = text

	        var result

	        if (props.cellFactory){
	            result = props.cellFactory(cellProps)
	        }

	        if (result === undefined){
	            result = CellFactory(cellProps)
	        }

	        return result
	    },

	    prepareClassName: function(props, state){
	        var className = props.className || ''

	        className += ' ' + props.defaultClassName

	        if (state.mouseOver){
	            className += ' ' + props.mouseOverCls
	        }

	        return className
	    },

	    prepareStyle: function(props){

	        var style = assign({}, props.defaultStyle, props.style)

	        style.height = props.rowHeight

	        return style
	    }
	})


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn    = __webpack_require__(31)
	var newify    = __webpack_require__(50)
	var copyUtils = __webpack_require__(51)
	var copyList  = copyUtils.copyList
	var copy      = copyUtils.copy
	var isObject  = __webpack_require__(52).object
	var EventEmitter = __webpack_require__(53).EventEmitter
	var inherits = __webpack_require__(37)
	var VALIDATE = __webpack_require__(38)

	/**
	 * @class Region
	 *
	 * The Region is an abstraction that allows the developer to refer to rectangles on the screen,
	 * and move them around, make diffs and unions, detect intersections, compute areas, etc.
	 *
	 * ## Creating a region
	 *      var region = require('region')({
	 *          top  : 10,
	 *          left : 10,
	 *          bottom: 100,
	 *          right : 100
	 *      })
	 *      //this region is a square, 90x90, starting from (10,10) to (100,100)
	 *
	 *      var second = require('region')({ top: 10, left: 100, right: 200, bottom: 60})
	 *      var union  = region.getUnion(second)
	 *
	 *      //the "union" region is a union between "region" and "second"
	 */

	var POINT_POSITIONS = {
	        cy: 'YCenter',
	        cx: 'XCenter',
	        t : 'Top',
	        tc: 'TopCenter',
	        tl: 'TopLeft',
	        tr: 'TopRight',
	        b : 'Bottom',
	        bc: 'BottomCenter',
	        bl: 'BottomLeft',
	        br: 'BottomRight',
	        l : 'Left',
	        lc: 'LeftCenter',
	        r : 'Right',
	        rc: 'RightCenter',
	        c : 'Center'
	    }

	/**
	 * @constructor
	 *
	 * Construct a new Region.
	 *
	 * Example:
	 *
	 *      var r = new Region({ top: 10, left: 20, bottom: 100, right: 200 })
	 *
	 *      //or, the same, but with numbers (can be used with new or without)
	 *
	 *      r = Region(10, 200, 100, 20)
	 *
	 *      //or, with width and height
	 *
	 *      r = Region({ top: 10, left: 20, width: 180, height: 90})
	 *
	 * @param {Number|Object} top The top pixel position, or an object with top, left, bottom, right properties. If an object is passed,
	 * instead of having bottom and right, it can have width and height.
	 *
	 * @param {Number} right The right pixel position
	 * @param {Number} bottom The bottom pixel position
	 * @param {Number} left The left pixel position
	 *
	 * @return {Region} this
	 */
	var REGION = function(top, right, bottom, left){

	    if (!(this instanceof REGION)){
	        return newify(REGION, arguments)
	    }

	    EventEmitter.call(this)

	    if (isObject(top)){
	        copyList(top, this, ['top','right','bottom','left'])

	        if (top.bottom == null && top.height != null){
	            this.bottom = this.top + top.height
	        }
	        if (top.right == null && top.width != null){
	            this.right = this.left + top.width
	        }

	        if (top.emitChangeEvents){
	            this.emitChangeEvents = top.emitChangeEvents
	        }
	    } else {
	        this.top    = top
	        this.right  = right
	        this.bottom = bottom
	        this.left   = left
	    }

	    this[0] = this.left
	    this[1] = this.top

	    VALIDATE(this)
	}

	inherits(REGION, EventEmitter)

	copy({

	    /**
	     * @cfg {Boolean} emitChangeEvents If this is set to true, the region
	     * will emit 'changesize' and 'changeposition' whenever the size or the position changs
	     */
	    emitChangeEvents: false,

	    /**
	     * Returns this region, or a clone of this region
	     * @param  {Boolean} [clone] If true, this method will return a clone of this region
	     * @return {Region}       This region, or a clone of this
	     */
	    getRegion: function(clone){
	        return clone?
	                    this.clone():
	                    this
	    },

	    /**
	     * Sets the properties of this region to those of the given region
	     * @param {Region/Object} reg The region or object to use for setting properties of this region
	     * @return {Region} this
	     */
	    setRegion: function(reg){

	        if (reg instanceof REGION){
	            this.set(reg.get())
	        } else {
	            this.set(reg)
	        }

	        return this
	    },

	    /**
	     * Returns true if this region is valid, false otherwise
	     *
	     * @param  {Region} region The region to check
	     * @return {Boolean}        True, if the region is valid, false otherwise.
	     * A region is valid if
	     *  * left <= right  &&
	     *  * top  <= bottom
	     */
	    validate: function(){
	        return REGION.validate(this)
	    },

	    _before: function(){
	        if (this.emitChangeEvents){
	            return copyList(this, {}, ['left','top','bottom','right'])
	        }
	    },

	    _after: function(before){
	        if (this.emitChangeEvents){

	            if(this.top != before.top || this.left != before.left) {
	                this.emitPositionChange()
	            }

	            if(this.right != before.right || this.bottom != before.bottom) {
	                this.emitSizeChange()
	            }
	        }
	    },

	    notifyPositionChange: function(){
	        this.emit('changeposition', this)
	    },

	    emitPositionChange: function(){
	        this.notifyPositionChange()
	    },

	    notifySizeChange: function(){
	        this.emit('changesize', this)
	    },

	    emitSizeChange: function(){
	        this.notifySizeChange()
	    },

	    /**
	     * Add the given amounts to each specified side. Example
	     *
	     *      region.add({
	     *          top: 50,    //add 50 px to the top side
	     *          bottom: -100    //substract 100 px from the bottom side
	     *      })
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    add: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            this[direction] += directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * The same as {@link #add}, but substracts the given values
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    substract: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if (hasOwn(directions, direction) ) {
	            this[direction] -= directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the size of the region.
	     * @return {Object} An object with {width, height}, corresponding to the width and height of the region
	     */
	    getSize: function(){
	        return {
	            width  : this.width,
	            height : this.height
	        }
	    },

	    /**
	     * Move the region to the given position and keeps the region width and height.
	     *
	     * @param {Object} position An object with {top, left} properties. The values in {top,left} are used to move the region by the given amounts.
	     * @param {Number} [position.left]
	     * @param {Number} [position.top]
	     *
	     * @return {Region} this
	     */
	    setPosition: function(position){
	        var width  = this.width
	        var height = this.height

	        if (position.left != undefined){
	            position.right  = position.left + width
	        }

	        if (position.top != undefined){
	            position.bottom = position.top  + height
	        }

	        return this.set(position)
	    },

	    /**
	     * Sets both the height and the width of this region to the given size.
	     *
	     * @param {Number} size The new size for the region
	     * @return {Region} this
	     */
	    setSize: function(size){
	        if (size.height != undefined && size.width != undefined){
	            return this.set({
	                right  : this.left + size.width,
	                bottom : this.top  + size.height
	            })
	        }

	        if (size.width != undefined){
	            this.setWidth(size.width)
	        }

	        if (size.height != undefined){
	            this.setHeight(size.height)
	        }

	        return this
	    },



	    /**
	     * @chainable
	     *
	     * Sets the width of this region
	     * @param {Number} width The new width for this region
	     * @return {Region} this
	     */
	    setWidth: function(width){
	        return this.set({
	            right: this.left + width
	        })
	    },

	    /**
	     * @chainable
	     *
	     * Sets the height of this region
	     * @param {Number} height The new height for this region
	     * @return {Region} this
	     */
	    setHeight: function(height){
	        return this.set({
	            bottom: this.top + height
	        })
	    },

	    /**
	     * Sets the given properties on this region
	     *
	     * @param {Object} directions an object containing top, left, and EITHER bottom, right OR width, height
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @param {Number} [directions.width]
	     * @param {Number} [directions.height]
	     *
	     *
	     * @return {Region} this
	     */
	    set: function(directions){
	        var before = this._before()

	        copyList(directions, this, ['left','top','bottom','right'])

	        if (directions.bottom == null && directions.height != null){
	            this.bottom = this.top + directions.height
	        }
	        if (directions.right == null && directions.width != null){
	            this.right = this.left + directions.width
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the given property from this region. If no property is given, return an object
	     * with {left, top, right, bottom}
	     *
	     * @param {String} [dir] the property to retrieve from this region
	     * @return {Number/Object}
	     */
	    get: function(dir){
	        return dir? this[dir]:
	                    copyList(this, {}, ['left','right','top','bottom'])
	    },

	    /**
	     * Shifts this region to either top, or left or both.
	     * Shift is similar to {@link #add} by the fact that it adds the given dimensions to top/left sides, but also adds the given dimensions
	     * to bottom and right
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    shift: function(directions){

	        var before = this._before()

	        if (directions.top){
	            this.top    += directions.top
	            this.bottom += directions.top
	        }

	        if (directions.left){
	            this.left  += directions.left
	            this.right += directions.left
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Same as {@link #shift}, but substracts the given values
	     * @chainable
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    unshift: function(directions){

	        if (directions.top){
	            directions.top *= -1
	        }

	        if (directions.left){
	            directions.left *= -1
	        }

	        return this.shift(directions)
	    },

	    /**
	     * Compare this region and the given region. Return true if they have all the same size and position
	     * @param  {Region} region The region to compare with
	     * @return {Boolean}       True if this and region have same size and position
	     */
	    equals: function(region){
	        return this.equalsPosition(region) && this.equalsSize(region)
	    },

	    /**
	     * Returns true if this region has the same bottom,right properties as the given region
	     * @param  {Region/Object} size The region to compare against
	     * @return {Boolean}       true if this region is the same size as the given size
	     */
	    equalsSize: function(size){
	        var isInstance = size instanceof REGION

	        var s = {
	            width: size.width == null && isInstance?
	                    size.getWidth():
	                    size.width,

	            height: size.height == null && isInstance?
	                    size.getHeight():
	                    size.height
	        }
	        return this.getWidth() == s.width && this.getHeight() == s.height
	    },

	    /**
	     * Returns true if this region has the same top,left properties as the given region
	     * @param  {Region} region The region to compare against
	     * @return {Boolean}       true if this.top == region.top and this.left == region.left
	     */
	    equalsPosition: function(region){
	        return this.top == region.top && this.left == region.left
	    },

	    /**
	     * Adds the given ammount to the left side of this region
	     * @param {Number} left The ammount to add
	     * @return {Region} this
	     */
	    addLeft: function(left){
	        var before = this._before()

	        this.left = this[0] = this.left + left

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the top side of this region
	     * @param {Number} top The ammount to add
	     * @return {Region} this
	     */
	    addTop: function(top){
	        var before = this._before()

	        this.top = this[1] = this.top + top

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the bottom side of this region
	     * @param {Number} bottom The ammount to add
	     * @return {Region} this
	     */
	    addBottom: function(bottom){
	        var before = this._before()

	        this.bottom += bottom

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the right side of this region
	     * @param {Number} right The ammount to add
	     * @return {Region} this
	     */
	    addRight: function(right){
	        var before = this._before()

	        this.right += right

	        this._after(before)

	        return this
	    },

	    /**
	     * Minimize the top side.
	     * @return {Region} this
	     */
	    minTop: function(){
	        return this.expand({top: 1})
	    },
	    /**
	     * Minimize the bottom side.
	     * @return {Region} this
	     */
	    maxBottom: function(){
	        return this.expand({bottom: 1})
	    },
	    /**
	     * Minimize the left side.
	     * @return {Region} this
	     */
	    minLeft: function(){
	        return this.expand({left: 1})
	    },
	    /**
	     * Maximize the right side.
	     * @return {Region} this
	     */
	    maxRight: function(){
	        return this.expand({right: 1})
	    },

	    /**
	     * Expands this region to the dimensions of the given region, or the document region, if no region is expanded.
	     * But only expand the given sides (any of the four can be expanded).
	     *
	     * @param {Object} directions
	     * @param {Boolean} [directions.top]
	     * @param {Boolean} [directions.bottom]
	     * @param {Boolean} [directions.left]
	     * @param {Boolean} [directions.right]
	     *
	     * @param {Region} [region] the region to expand to, defaults to the document region
	     * @return {Region} this region
	     */
	    expand: function(directions, region){
	        var docRegion = region || REGION.getDocRegion()
	        var list      = []
	        var direction
	        var before = this._before()

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            list.push(direction)
	        }

	        copyList(docRegion, this, list)

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Returns a clone of this region
	     * @return {Region} A new region, with the same position and dimension as this region
	     */
	    clone: function(){
	        return new REGION({
	                    top    : this.top,
	                    left   : this.left,
	                    right  : this.right,
	                    bottom : this.bottom
	                })
	    },

	    /**
	     * Returns true if this region contains the given point
	     * @param {Number/Object} x the x coordinate of the point
	     * @param {Number} [y] the y coordinate of the point
	     *
	     * @return {Boolean} true if this region constains the given point, false otherwise
	     */
	    containsPoint: function(x, y){
	        if (arguments.length == 1){
	            y = x.y
	            x = x.x
	        }

	        return this.left <= x  &&
	               x <= this.right &&
	               this.top <= y   &&
	               y <= this.bottom
	    },

	    /**
	     *
	     * @param region
	     *
	     * @return {Boolean} true if this region contains the given region, false otherwise
	     */
	    containsRegion: function(region){
	        return this.containsPoint(region.left, region.top)    &&
	               this.containsPoint(region.right, region.bottom)
	    },

	    /**
	     * Returns an object with the difference for {top, bottom} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {top,bottom}
	     */
	    diffHeight: function(region){
	        return this.diff(region, {top: true, bottom: true})
	    },

	    /**
	     * Returns an object with the difference for {left, right} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {left,right}
	     */
	    diffWidth: function(region){
	        return this.diff(region, {left: true, right: true})
	    },

	    /**
	     * Returns an object with the difference in sizes for the given directions, between this and region
	     *
	     * @param  {Region} region     The region to use for diff
	     * @param  {Object} directions An object with the directions to diff. Can have any of the following keys:
	     *  * left
	     *  * right
	     *  * top
	     *  * bottom
	     *
	     * @return {Object} and object with the same keys as the directions object, but the values being the
	     * differences between this region and the given region
	     */
	    diff: function(region, directions){
	        var result = {}
	        var dirName

	        for (dirName in directions) if ( hasOwn(directions, dirName) ) {
	            result[dirName] = this[dirName] - region[dirName]
	        }

	        return result
	    },

	    /**
	     * Returns the position, in {left,top} properties, of this region
	     *
	     * @return {Object} {left,top}
	     */
	    getPosition: function(){
	        return {
	            left: this.left,
	            top : this.top
	        }
	    },

	    /**
	     * Returns the point at the given position from this region.
	     *
	     * @param {String} position Any of:
	     *
	     *  * 'cx' - See {@link #getPointXCenter}
	     *  * 'cy' - See {@link #getPointYCenter}
	     *  * 'b'  - See {@link #getPointBottom}
	     *  * 'bc' - See {@link #getPointBottomCenter}
	     *  * 'l'  - See {@link #getPointLeft}F
	     *  * 'lc' - See {@link #getPointLeftCenter}
	     *  * 't'  - See {@link #getPointTop}
	     *  * 'tc' - See {@link #getPointTopCenter}
	     *  * 'r'  - See {@link #getPointRight}
	     *  * 'rc' - See {@link #getPointRightCenter}
	     *  * 'c'  - See {@link #getPointCenter}
	     *  * 'tl' - See {@link #getPointTopLeft}
	     *  * 'bl' - See {@link #getPointBottomLeft}
	     *  * 'br' - See {@link #getPointBottomRight}
	     *  * 'tr' - See {@link #getPointTopRight}
	     *
	     * @param {Boolean} asLeftTop
	     *
	     * @return {Object} either an object with {x,y} or {left,top} if asLeftTop is true
	     */
	    getPoint: function(position, asLeftTop){

	        //<debug>
	        if (!POINT_POSITIONS[position]) {
	            console.warn('The position ', position, ' could not be found! Available options are tl, bl, tr, br, l, r, t, b.');
	        }
	        //</debug>

	        var method = 'getPoint' + POINT_POSITIONS[position],
	            result = this[method]()

	        if (asLeftTop){
	            return {
	                left : result.x,
	                top  : result.y
	            }
	        }

	        return result
	    },

	    /**
	     * Returns a point with x = null and y being the middle of the left region segment
	     * @return {Object} {x,y}
	     */
	    getPointYCenter: function(){
	        return { x: null, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x being the middle of the top region segment
	     * @return {Object} {x,y}
	     */
	    getPointXCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: null }
	    },

	    /**
	     * Returns a point with x = null and y the region top position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointTop: function(){
	        return { x: null, y: this.top }
	    },

	    /**
	     * Returns a point that is the middle point of the region top segment
	     * @return {Object} {x,y}
	     */
	    getPointTopCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top }
	    },

	    /**
	     * Returns a point that is the top-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopLeft: function(){
	        return { x: this.left, y: this.top}
	    },

	    /**
	     * Returns a point that is the top-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopRight: function(){
	        return { x: this.right, y: this.top}
	    },

	    /**
	     * Returns a point with x = null and y the region bottom position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointBottom: function(){
	        return { x: null, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the middle point of the region bottom segment
	     * @return {Object} {x,y}
	     */
	    getPointBottomCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the bottom-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomLeft: function(){
	        return { x: this.left, y: this.bottom}
	    },

	    /**
	     * Returns a point that is the bottom-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomRight: function(){
	        return { x: this.right, y: this.bottom}
	    },

	    /**
	     * Returns a point with y = null and x the region left position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointLeft: function(){
	        return { x: this.left, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region left segment
	     * @return {Object} {x,y}
	     */
	    getPointLeftCenter: function(){
	        return { x: this.left, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x the region right position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointRight: function(){
	        return { x: this.right, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region right segment
	     * @return {Object} {x,y}
	     */
	    getPointRightCenter: function(){
	        return { x: this.right, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point that is the center of the region
	     * @return {Object} {x,y}
	     */
	    getPointCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * @return {Number} returns the height of the region
	     */
	    getHeight: function(){
	        return this.bottom - this.top
	    },

	    /**
	     * @return {Number} returns the width of the region
	     */
	    getWidth: function(){
	        return this.right - this.left
	    },

	    /**
	     * @return {Number} returns the top property of the region
	     */
	    getTop: function(){
	        return this.top
	    },

	    /**
	     * @return {Number} returns the left property of the region
	     */
	    getLeft: function(){
	        return this.left
	    },

	    /**
	     * @return {Number} returns the bottom property of the region
	     */
	    getBottom: function(){
	        return this.bottom
	    },

	    /**
	     * @return {Number} returns the right property of the region
	     */
	    getRight: function(){
	        return this.right
	    },

	    /**
	     * Returns the area of the region
	     * @return {Number} the computed area
	     */
	    getArea: function(){
	        return this.getWidth() * this.getHeight()
	    },

	    constrainTo: function(contrain){
	        var intersect = this.getIntersection(contrain)
	        var shift

	        if (!intersect || !intersect.equals(this)){

	            var contrainWidth  = contrain.getWidth(),
	                contrainHeight = contrain.getHeight()

	            if (this.getWidth() > contrainWidth){
	                this.left = contrain.left
	                this.setWidth(contrainWidth)
	            }

	            if (this.getHeight() > contrainHeight){
	                this.top = contrain.top
	                this.setHeight(contrainHeight)
	            }

	            shift = {}

	            if (this.right > contrain.right){
	                shift.left = contrain.right - this.right
	            }

	            if (this.bottom > contrain.bottom){
	                shift.top = contrain.bottom - this.bottom
	            }

	            if (this.left < contrain.left){
	                shift.left = contrain.left - this.left
	            }

	            if (this.top < contrain.top){
	                shift.top = contrain.top - this.top
	            }

	            this.shift(shift)

	            return true
	        }

	        return false
	    },

	    __IS_REGION: true

	    /**
	     * @property {Number} top
	     */

	    /**
	     * @property {Number} right
	     */

	    /**
	     * @property {Number} bottom
	     */

	    /**
	     * @property {Number} left
	     */

	    /**
	     * @property {Number} [0] the top property
	     */

	    /**
	     * @property {Number} [1] the left property
	     */

	    /**
	     * @method getIntersection
	     * Returns a region that is the intersection of this region and the given region
	     * @param  {Region} region The region to intersect with
	     * @return {Region}        The intersection region
	     */

	    /**
	     * @method getUnion
	     * Returns a region that is the union of this region with the given region
	     * @param  {Region} region  The region to make union with
	     * @return {Region}        The union region. The smallest region that contains both this and the given region.
	     */

	}, REGION.prototype)

	Object.defineProperties(REGION.prototype, {
	    width: {
	        get: function(){
	            return this.getWidth()
	        },
	        set: function(width){
	            return this.setWidth(width)
	        }
	    },
	    height: {
	        get: function(){
	            return this.getHeight()
	        },
	        set: function(height){
	            return this.setHeight(height)
	        }
	    }
	})

	__webpack_require__(39)(REGION)

	module.exports = REGION

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    toLowerFirst     : __webpack_require__(40),
	    toUpperFirst     : __webpack_require__(41),
	    separate         : __webpack_require__(42),
	    stripWhitespace  : __webpack_require__(43),
	    compactWhitespace: __webpack_require__(44),
	    camelize         : __webpack_require__(45),
	    humanize         : __webpack_require__(46),
	    hyphenate        : __webpack_require__(47),
	    endsWith         : __webpack_require__(48),

	    is: __webpack_require__(49)
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var hasOwn = Object.prototype.hasOwnProperty

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}


	module.exports = curry(function(object, property){
	    return hasOwn.call(object, property)
	})

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	// shim for Node's 'util' package
	// DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
	var util = {
	  isArray: function (ar) {
	    return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
	  },
	  isDate: function (d) {
	    return typeof d === 'object' && objectToString(d) === '[object Date]';
	  },
	  isRegExp: function (re) {
	    return typeof re === 'object' && objectToString(re) === '[object RegExp]';
	  },
	  getRegExpFlags: function (re) {
	    var flags = '';
	    re.global && (flags += 'g');
	    re.ignoreCase && (flags += 'i');
	    re.multiline && (flags += 'm');
	    return flags;
	  }
	};


	if (true)
	  module.exports = clone;

	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	*/

	function clone(parent, circular, depth, prototype) {
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];

	  var useBuffer = typeof Buffer != 'undefined';

	  if (typeof circular == 'undefined')
	    circular = true;

	  if (typeof depth == 'undefined')
	    depth = Infinity;

	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;

	    if (depth == 0)
	      return parent;

	    var child;
	    if (typeof parent != 'object') {
	      return parent;
	    }

	    if (util.isArray(parent)) {
	      child = [];
	    } else if (util.isRegExp(parent)) {
	      child = new RegExp(parent.source, util.getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (util.isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      child = new Buffer(parent.length);
	      parent.copy(child);
	      return child;
	    } else {
	      if (typeof prototype == 'undefined') child = Object.create(Object.getPrototypeOf(parent));
	      else child = Object.create(prototype);
	    }

	    if (circular) {
	      var index = allParents.indexOf(parent);

	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }

	    for (var i in parent) {
	      child[i] = _clone(parent[i], depth - 1);
	    }

	    return child;
	  }

	  return _clone(parent, depth);
	}

	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function(parent) {
	  if (parent === null)
	    return null;

	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54).Buffer))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1)
	var F     = __webpack_require__(55)
	var copy  = __webpack_require__(51).copy

	function emptyFn(){}

	module.exports = React.createClass({

	    displayName: 'Menu',

	    getDefaultProps: function(){

	        return {
	            defaultStyle: {
	                border : '1px solid gray',
	                display: 'inline-block'
	            },
	            rowStyle: {
	                cursor: 'pointer'
	            },
	            columnStyle: {
	                padding: 10
	            },
	            columns: ['label'],
	            items: [
	                {
	                    label: 'New item',
	                    fn: function(){}
	                }
	            ]
	        }
	    },

	    render: function() {
	        var props = copy(this.props)

	        props.style = copy(props.style, this.props.defaultStyle)

	        return (
	            React.createElement("div", React.__spread({},  props), 
	                React.createElement("table", null, 
	                    React.createElement("tbody", null, 
	                        this.props.items.map(this.renderItem, this)
	                    )
	                )
	            )
	        )
	    },

	    renderItem: function(item, index) {
	        return (
	            React.createElement("tr", {style: this.props.rowStyle, key: index, onClick: this.handleClick(item, index).bind(this)}, 
	                this.props.columns.map(this.renderColumn(item), this)
	            )
	        )
	    },

	    renderColumn: F.curry(function(item, column) {
	        return React.createElement("td", {style: this.props.columnStyle, key: column}, item[column])
	    }),

	    handleClick: F.curry(function(item, index, event) {
	        event.stopPropagation()

	        ;(item.fn || emptyFn)(item, event)
	        ;(this.props.onClick || emptyFn)(item, index, event)
	    })
	})

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(35)

	module.exports = React.createClass({

	    displayName: 'Loader',

	    getDefaultProps: function(){
	        return {
	            defaultStyle: {
	                margin: 'auto',
	                position: 'absolute',
	                top: 0,
	                left: 0,
	                bottom: 0,
	                right: 0,
	            },
	            defaultClassName: 'loader',
	            size: 40,
	        }
	    },

	    render: function() {
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' ' + props.defaultClassName

	        return React.DOM.div(props,
	            React.createElement("div", {className: "loadbar loadbar-1"}),
	            React.createElement("div", {className: "loadbar loadbar-2"}),
	            React.createElement("div", {className: "loadbar loadbar-3"}),
	            React.createElement("div", {className: "loadbar loadbar-4"}),
	            React.createElement("div", {className: "loadbar loadbar-5"}),
	            React.createElement("div", {className: "loadbar loadbar-6"}),
	            React.createElement("div", {className: "loadbar loadbar-7"}),
	            React.createElement("div", {className: "loadbar loadbar-8"}),
	            React.createElement("div", {className: "loadbar loadbar-9"}),
	            React.createElement("div", {className: "loadbar loadbar-10"}),
	            React.createElement("div", {className: "loadbar loadbar-11"}),
	            React.createElement("div", {className: "loadbar loadbar-12"})
	        )
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.width = props.size
	        style.height = props.size

	        props.style = style
	    }
	})

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var F      = __webpack_require__(68)
	var copy   = __webpack_require__(51).copy
	var Region = __webpack_require__(69)

	var Helper = function(config){
	    this.config = config
	}

	function emptyFn(){}

	copy({

	    /**
	     * Should be called on a mousedown event
	     *
	     * @param  {Event} event
	     * @return {[type]}       [description]
	     */
	    initDrag: function(event) {

	        this.onDragInit(event)

	        var onDragStart = F.once(this.onDragStart, this)

	        var mouseMoveListener = (function(event){
	            onDragStart(event)
	            this.onDrag(event)
	        }).bind(this)

	        var mouseUpListener = (function(event){

	            this.onDrop(event)

	            window.removeEventListener('mousemove', mouseMoveListener)
	            window.removeEventListener('mouseup', mouseUpListener)
	        }).bind(this)

	        window.addEventListener('mousemove', mouseMoveListener, false)
	        window.addEventListener('mouseup', mouseUpListener)
	    },

	    onDragInit: function(event){

	        var config = {
	            diff: {
	                left: 0,
	                top : 0
	            }
	        }
	        this.state = {
	            config: config
	        }

	        var initPageCoords = this.state.initPageCoords = {
	            pageX: event.pageX,
	            pageY: event.pageY
	        }

	        if (this.config.region){
	            this.state.initialRegion = Region.from(this.config.region)
	            this.state.dragRegion =
	                config.dragRegion =
	                    this.state.initialRegion.clone()
	        }
	        if (this.config.constrainTo){
	            this.state.constrainTo = Region.from(this.config.constrainTo)
	        }

	        this.callConfig('onDragInit', event)
	    },

	    /**
	     * Called when the first mousemove event occurs after drag is initialized
	     * @param  {Event} event
	     */
	    onDragStart: function(event){
	        this.state.didDrag = this.state.config.didDrag = true
	        this.callConfig('onDragStart', event)
	    },

	    /**
	     * Called on all mousemove events after drag is initialized.
	     *
	     * @param  {Event} event
	     */
	    onDrag: function(event){

	        var config = this.state.config
	        var args   = [event, config]

	        var initPageCoords = this.state.initPageCoords

	        var diff = config.diff = {
	            left: event.pageX - initPageCoords.pageX,
	            top : event.pageY - initPageCoords.pageY
	        }

	        if (this.state.initialRegion){
	            var dragRegion = config.dragRegion

	            //set the dragRegion to initial coords
	            dragRegion.set(this.state.initialRegion)

	            //shift it to the new position
	            dragRegion.shift(diff)

	            if (this.state.constrainTo){
	                //and finally constrain it if it's the case
	                dragRegion.constrainTo(this.state.constrainTo)

	                diff.left = dragRegion.left - this.state.initialRegion.left
	                diff.top  = dragRegion.top - this.state.initialRegion.top
	            }

	            config.dragRegion = dragRegion
	        }

	        this.callConfig('onDrag', event)
	    },

	    /**
	     * Called on the mouseup event on window
	     *
	     * @param  {Event} event
	     */
	    onDrop: function(event){
	        this.callConfig('onDrop', event)

	        this.state = null
	    },

	    callConfig: function(fnName, event){
	        var config = this.state.config
	        var args   = [event, config]

	        var fn = this.config[fnName]

	        if (fn){
	            fn.apply(this, args)
	        }
	    }

	}, Helper.prototype)

	module.exports = function(event, config){

	    if (config.scope){
	        var skippedKeys = {
	            scope      : 1,
	            region     : 1,
	            constrainTo: 1
	        }

	        Object.keys(config).forEach(function(key){
	            var value = config[key]

	            if (key in skippedKeys){
	                return
	            }

	            if (typeof value == 'function'){
	                config[key] = value.bind(config.scope)
	            }
	        })
	    }
	    var helper = new Helper(config)

	    helper.initDrag(event)

	    return helper

	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	            value       : ctor,
	            enumerable  : false,
	            writable    : true,
	            configurable: true
	        }
	    })
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @static
	 * Returns true if the given region is valid, false otherwise.
	 * @param  {Region} region The region to check
	 * @return {Boolean}        True, if the region is valid, false otherwise.
	 * A region is valid if
	 *  * left <= right  &&
	 *  * top  <= bottom
	 */
	module.exports = function validate(region){

	    var isValid = true

	    if (region.right < region.left){
	        isValid = false
	        region.right = region.left
	    }

	    if (region.bottom < region.top){
	        isValid = false
	        region.bottom = region.top
	    }

	    return isValid
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn   = __webpack_require__(31)
	var VALIDATE = __webpack_require__(38)

	module.exports = function(REGION){

	    var MAX = Math.max
	    var MIN = Math.min

	    var statics = {
	        init: function(){
	            var exportAsNonStatic = {
	                getIntersection      : true,
	                getIntersectionArea  : true,
	                getIntersectionHeight: true,
	                getIntersectionWidth : true,
	                getUnion             : true
	            }
	            var thisProto = REGION.prototype
	            var newName

	            var exportHasOwn = hasOwn(exportAsNonStatic)
	            var methodName

	            for (methodName in exportAsNonStatic) if (exportHasOwn(methodName)) {
	                newName = exportAsNonStatic[methodName]
	                if (typeof newName != 'string'){
	                    newName = methodName
	                }

	                ;(function(proto, methodName, protoMethodName){

	                    proto[methodName] = function(region){
	                        //<debug>
	                        if (!REGION[protoMethodName]){
	                            console.warn('cannot find method ', protoMethodName,' on ', REGION)
	                        }
	                        //</debug>
	                        return REGION[protoMethodName](this, region)
	                    }

	                })(thisProto, newName, methodName);
	            }
	        },

	        validate: VALIDATE,

	        /**
	         * Returns the region corresponding to the documentElement
	         * @return {Region} The region corresponding to the documentElement. This region is the maximum region visible on the screen.
	         */
	        getDocRegion: function(){
	            return REGION.fromDOM(document.documentElement)
	        },

	        from: function(reg){
	            if (reg.__IS_REGION){
	                return reg
	            }

	            if (typeof document != 'undefined'){
	                if (typeof HTMLElement != 'undefined' && reg instanceof HTMLElement){
	                    return REGION.fromDOM(reg)
	                }

	                if (reg.type && typeof reg.pageX !== 'undefined' && typeof reg.pageY !== 'undefined'){
	                    return REGION.fromEvent(reg)
	                }
	            }

	            return REGION(reg)
	        },

	        fromEvent: function(event){
	            return REGION.fromPoint({
	                x: event.pageX,
	                y: event.pageY
	            })
	        },

	        fromDOM: function(dom){
	            var rect = dom.getBoundingClientRect()
	            // var docElem = document.documentElement
	            // var win     = window

	            // var top  = rect.top + win.pageYOffset - docElem.clientTop
	            // var left = rect.left + win.pageXOffset - docElem.clientLeft

	            return new REGION({
	                top   : rect.top,
	                left  : rect.left,
	                bottom: rect.bottom,
	                right : rect.right
	            })
	        },

	        /**
	         * @static
	         * Returns a region that is the intersection of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region/Boolean}        The intersection region or false if no intersection found
	         */
	        getIntersection: function(first, second){

	            var area = this.getIntersectionArea(first, second)

	            if (area){
	                return new REGION(area)
	            }

	            return false
	        },

	        getIntersectionWidth: function(first, second){
	            var minRight  = MIN(first.right, second.right)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (maxLeft < minRight){
	                return minRight  - maxLeft
	            }

	            return 0
	        },

	        getIntersectionHeight: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minBottom = MIN(first.bottom,second.bottom)

	            if (maxTop  < minBottom){
	                return minBottom - maxTop
	            }

	            return 0
	        },

	        getIntersectionArea: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minRight  = MIN(first.right, second.right)
	            var minBottom = MIN(first.bottom,second.bottom)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (
	                    maxTop  < minBottom &&
	                    maxLeft < minRight
	                ){
	                return {
	                    top    : maxTop,
	                    right  : minRight,
	                    bottom : minBottom,
	                    left   : maxLeft,

	                    width  : minRight  - maxLeft,
	                    height : minBottom - maxTop
	                }
	            }

	            return false
	        },

	        /**
	         * @static
	         * Returns a region that is the union of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region}        The union region. The smallest region that contains both given regions.
	         */
	        getUnion: function(first, second){
	            var top    = MIN(first.top,   second.top)
	            var right  = MAX(first.right, second.right)
	            var bottom = MAX(first.bottom,second.bottom)
	            var left   = MIN(first.left,  second.left)

	            return new REGION(top, right, bottom, left)
	        },

	        /**
	         * @static
	         * Returns a region. If the reg argument is a region, returns it, otherwise return a new region built from the reg object.
	         *
	         * @param  {Region} reg A region or an object with either top, left, bottom, right or
	         * with top, left, width, height
	         * @return {Region} A region
	         */
	        getRegion: function(reg){
	            return REGION.from(reg)
	        },

	        /**
	         * Creates a region that corresponds to a point.
	         *
	         * @param  {Object} xy The point
	         * @param  {Number} xy.x
	         * @param  {Number} xy.y
	         *
	         * @return {Region}    The new region, with top==xy.y, bottom = xy.y and left==xy.x, right==xy.x
	         */
	        fromPoint: function(xy){
	            return new REGION({
	                        top    : xy.y,
	                        bottom : xy.y,
	                        left   : xy.x,
	                        right  : xy.x
	                    })
	        }
	    }

	    Object.keys(statics).forEach(function(key){
	        REGION[key] = statics[key]
	    })

	    REGION.init()
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(str){
	    return str.length?
	            str.charAt(0).toLowerCase() + str.substring(1):
	            str
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return value.length?
	                value.charAt(0).toUpperCase() + value.substring(1):
	                value
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var doubleColonRe      = /::/g
	var upperToLowerRe     = /([A-Z]+)([A-Z][a-z])/g
	var lowerToUpperRe     = /([a-z\d])([A-Z])/g
	var underscoreToDashRe = /_/g

	module.exports = function(name, separator){

	   return name?
	           name.replace(doubleColonRe, '/')
	                .replace(upperToLowerRe, '$1_$2')
	                .replace(lowerToUpperRe, '$1_$2')
	                .replace(underscoreToDashRe, separator || '-')
	            :
	            ''
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var RE = /\s/g

	module.exports = function(str){
	    if (!str){
	        return ''
	    }

	    return str.replace(RE, '')
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var RE = /\s+/g

	module.exports = function(str){
	    if (!str){
	        return ''
	    }

	    return str.trim().replace(RE, ' ')
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var toCamelFn = function(str, letter){
	       return letter ? letter.toUpperCase(): ''
	   }

	var hyphenRe = __webpack_require__(56)

	module.exports = function(str){
	   return str?
	          str.replace(hyphenRe, toCamelFn):
	          ''
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var separate     = __webpack_require__(42)
	var camelize     = __webpack_require__(45)
	var toUpperFirst = __webpack_require__(41)
	var hyphenRe     = __webpack_require__(56)

	function toLowerAndSpace(str, letter){
	    return letter? ' ' + letter.toLowerCase(): ' '
	}

	module.exports = function(name, config){

	    var str = config && config.capitalize?
	                    separate(camelize(name), ' '):
	                    separate(name, ' ').replace(hyphenRe, toLowerAndSpace)

	    return toUpperFirst(str.trim())
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var separate = __webpack_require__(42)

	module.exports = function(name){
	   return separate(name).toLowerCase()
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(str, endsWith){

	    str += ''

	    if (!str){
	        return typeof endsWith == 'string'?
	                    !endsWith:
	                    false
	    }

	    endsWith += ''

	    if (str.length < endsWith.length){
	        return false
	    }

	    return str.lastIndexOf(endsWith) == str.length - endsWith.length
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    alphanum: __webpack_require__(57),
	    match   : __webpack_require__(58),
	    guid   : __webpack_require__(59),
	    // email   : require('./email'),
	    numeric   : __webpack_require__(60)
	}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(61)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict'

	    var HAS_OWN       = Object.prototype.hasOwnProperty,
	        STR_OBJECT    = 'object',
	        STR_UNDEFINED = 'undefined'

	    return {

	        /**
	         * Copies all properties from source to destination
	         *
	         *      copy({name: 'jon',age:5}, this);
	         *      // => this will have the 'name' and 'age' properties set to 'jon' and 5 respectively
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         *
	         * @return {Object} destination
	         */
	        copy: __webpack_require__(62),

	        /**
	         * Copies all properties from source to destination, if the property does not exist into the destination
	         *
	         *      copyIf({name: 'jon',age:5}, {age:7})
	         *      // => { name: 'jon', age: 7}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         *
	         * @return {Object} destination
	         */
	        copyIf: __webpack_require__(63),

	        /**
	         * Copies all properties from source to a new object, with the given value. This object is returned
	         *
	         *      copyAs({name: 'jon',age:5})
	         *      // => the resulting object will have the 'name' and 'age' properties set to 1
	         *
	         * @param {Object} source
	         * @param {Object/Number/String} [value=1]
	         *
	         * @return {Object} destination
	         */
	        copyAs: function(source, value){

	            var destination = {}

	            value = value || 1

	            if (source != null && typeof source === STR_OBJECT ){

	                for (var i in source) if ( HAS_OWN.call(source, i) ) {
	                    destination[i] = value
	                }

	            }

	            return destination
	        },

	        /**
	         * Copies all properties named in the list, from source to destination
	         *
	         *      copyList({name: 'jon',age:5, year: 2006}, {}, ['name','age'])
	         *      // => {name: 'jon', age: 5}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Array} list the array with the names of the properties to copy
	         *
	         * @return {Object} destination
	         */
	        copyList: __webpack_require__(64),

	        /**
	         * Copies all properties named in the list, from source to destination, if the property does not exist into the destination
	         *
	         *      copyListIf({name: 'jon',age:5, year: 2006}, {age: 10}, ['name','age'])
	         *      // => {name: 'jon', age: 10}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Array} list the array with the names of the properties to copy
	         *
	         * @return {Object} destination
	         */
	        copyListIf: __webpack_require__(65),

	        /**
	         * Copies all properties named in the namedKeys, from source to destination
	         *
	         *      copyKeys({name: 'jon',age:5, year: 2006, date: '2010/05/12'}, {}, {name:1 ,age: true, year: 'theYear'})
	         *      // => {name: 'jon', age: 5, theYear: 2006}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Object} namedKeys an object with keys denoting the properties to be copied
	         *
	         * @return {Object} destination
	         */
	        copyKeys: __webpack_require__(66),

	        /**
	         * Copies all properties named in the namedKeys, from source to destination,
	         * but only if the property does not already exist in the destination object
	         *
	         *      copyKeysIf({name: 'jon',age:5, year: 2006}, {aname: 'test'}, {name:'aname' ,age: true})
	         *      // => {aname: 'test', age: 5}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Object} namedKeys an object with keys denoting the properties to be copied
	         *
	         * @return {Object} destination
	         */
	        copyKeysIf: __webpack_require__(67),

	        copyExceptKeys: function(source, destination, exceptKeys){
	            destination = destination || {}
	            exceptKeys  = exceptKeys  || {}

	            if (source != null && typeof source === STR_OBJECT ){

	                for (var i in source) if ( HAS_OWN.call(source, i) && !HAS_OWN.call(exceptKeys, i) ) {

	                    destination[i] = source[i]
	                }

	            }

	            return destination
	        },

	        /**
	         * Copies the named keys from source to destination.
	         * For the keys that are functions, copies the functions bound to the source
	         *
	         * @param  {Object} source      The source object
	         * @param  {Object} destination The target object
	         * @param  {Object} namedKeys   An object with the names of the keys to copy The values from the keys in this object
	         *                              need to be either numbers or booleans if you want to copy the property under the same name,
	         *                              or a string if you want to copy the property under a different name
	         * @return {Object}             Returns the destination object
	         */
	        bindCopyKeys: function(source, destination, namedKeys){
	            if (arguments.length == 2){
	                namedKeys = destination
	                destination = null
	            }

	            destination = destination || {}

	            if (
	                       source != null && typeof source    === STR_OBJECT &&
	                    namedKeys != null && typeof namedKeys === STR_OBJECT
	                ) {


	                var typeOfNamedProperty,
	                    namedPropertyValue,

	                    typeOfSourceProperty,
	                    propValue


	                for(var propName in namedKeys) if (HAS_OWN.call(namedKeys, propName)) {

	                    namedPropertyValue = namedKeys[propName]
	                    typeOfNamedProperty = typeof namedPropertyValue

	                    propValue = source[propName]
	                    typeOfSourceProperty = typeof propValue


	                    if ( typeOfSourceProperty !== STR_UNDEFINED ) {

	                        destination[
	                            typeOfNamedProperty == 'string'?
	                                            namedPropertyValue :
	                                            propName
	                            ] = typeOfSourceProperty == 'function' ?
	                                            propValue.bind(source):
	                                            propValue
	                    }
	                }
	            }

	            return destination
	        }
	    }

	}()

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(70)

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(103)
	var ieee754 = __webpack_require__(84)
	var isArray = __webpack_require__(85)

	exports.Buffer = Buffer
	exports.SlowBuffer = Buffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var kMaxLength = 0x3fffffff

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Note:
	 *
	 * - Implementation must support adding new properties to `Uint8Array` instances.
	 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
	 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *    incorrect length in some situations.
	 *
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
	 * get the Object implementation, which is slower but will work correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    return 42 === arr.foo() && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (subject, encoding, noZero) {
	  if (!(this instanceof Buffer))
	    return new Buffer(subject, encoding, noZero)

	  var type = typeof subject

	  // Find the length
	  var length
	  if (type === 'number')
	    length = subject > 0 ? subject >>> 0 : 0
	  else if (type === 'string') {
	    if (encoding === 'base64')
	      subject = base64clean(subject)
	    length = Buffer.byteLength(subject, encoding)
	  } else if (type === 'object' && subject !== null) { // assume object is array-like
	    if (subject.type === 'Buffer' && isArray(subject.data))
	      subject = subject.data
	    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
	  } else
	    throw new TypeError('must start with number, buffer, array or string')

	  if (this.length > kMaxLength)
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	      'size: 0x' + kMaxLength.toString(16) + ' bytes')

	  var buf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Preferred: Return an augmented `Uint8Array` instance for best performance
	    buf = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return THIS instance of Buffer (created by `new`)
	    buf = this
	    buf.length = length
	    buf._isBuffer = true
	  }

	  var i
	  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
	    // Speed optimization -- use set if we're copying from a typed array
	    buf._set(subject)
	  } else if (isArrayish(subject)) {
	    // Treat array-ish objects as a byte array
	    if (Buffer.isBuffer(subject)) {
	      for (i = 0; i < length; i++)
	        buf[i] = subject.readUInt8(i)
	    } else {
	      for (i = 0; i < length; i++)
	        buf[i] = ((subject[i] % 256) + 256) % 256
	    }
	  } else if (type === 'string') {
	    buf.write(subject, 0, encoding)
	  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
	    for (i = 0; i < length; i++) {
	      buf[i] = 0
	    }
	  }

	  return buf
	}

	Buffer.isBuffer = function (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
	    throw new TypeError('Arguments must be Buffers')

	  var x = a.length
	  var y = b.length
	  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function (list, totalLength) {
	  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (totalLength === undefined) {
	    totalLength = 0
	    for (i = 0; i < list.length; i++) {
	      totalLength += list[i].length
	    }
	  }

	  var buf = new Buffer(totalLength)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	Buffer.byteLength = function (str, encoding) {
	  var ret
	  str = str + ''
	  switch (encoding || 'utf8') {
	    case 'ascii':
	    case 'binary':
	    case 'raw':
	      ret = str.length
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = str.length * 2
	      break
	    case 'hex':
	      ret = str.length >>> 1
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8ToBytes(str).length
	      break
	    case 'base64':
	      ret = base64ToBytes(str).length
	      break
	    default:
	      ret = str.length
	  }
	  return ret
	}

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function (encoding, start, end) {
	  var loweredCase = false

	  start = start >>> 0
	  end = end === undefined || end === Infinity ? this.length : end >>> 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase)
	          throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.equals = function (b) {
	  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max)
	      str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  return Buffer.compare(this, b)
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var byte = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(byte)) throw new Error('Invalid hex string')
	    buf[offset + i] = byte
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function asciiWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function utf16leWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length, 2)
	  return charsWritten
	}

	Buffer.prototype.write = function (string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length
	      length = undefined
	    }
	  } else {  // legacy
	    var swap = encoding
	    encoding = offset
	    offset = length
	    length = swap
	  }

	  offset = Number(offset) || 0
	  var remaining = this.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase()

	  var ret
	  switch (encoding) {
	    case 'hex':
	      ret = hexWrite(this, string, offset, length)
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8Write(this, string, offset, length)
	      break
	    case 'ascii':
	      ret = asciiWrite(this, string, offset, length)
	      break
	    case 'binary':
	      ret = binaryWrite(this, string, offset, length)
	      break
	    case 'base64':
	      ret = base64Write(this, string, offset, length)
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = utf16leWrite(this, string, offset, length)
	      break
	    default:
	      throw new TypeError('Unknown encoding: ' + encoding)
	  }
	  return ret
	}

	Buffer.prototype.toJSON = function () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  return asciiSlice(buf, start, end)
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len;
	    if (start < 0)
	      start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0)
	      end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start)
	    end = start

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    return Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    var newBuf = new Buffer(sliceLen, undefined, true)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	    return newBuf
	  }
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0)
	    throw new RangeError('offset is not uint')
	  if (offset + ext > length)
	    throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUInt8 = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	      ((this[offset + 1] << 16) |
	      (this[offset + 2] << 8) |
	      this[offset + 3])
	}

	Buffer.prototype.readInt8 = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80))
	    return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16) |
	      (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	      (this[offset + 1] << 16) |
	      (this[offset + 2] << 8) |
	      (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new TypeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new TypeError('index out of range')
	}

	Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else objectWriteUInt16(this, value, offset, true)
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else objectWriteUInt16(this, value, offset, false)
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else objectWriteUInt32(this, value, offset, true)
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else objectWriteUInt32(this, value, offset, false)
	  return offset + 4
	}

	Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else objectWriteUInt16(this, value, offset, true)
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else objectWriteUInt16(this, value, offset, false)
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else objectWriteUInt32(this, value, offset, true)
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else objectWriteUInt32(this, value, offset, false)
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new TypeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new TypeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert)
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert)
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function (target, target_start, start, end) {
	  var source = this

	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (!target_start) target_start = 0

	  // Copy 0 bytes; we're done
	  if (end === start) return
	  if (target.length === 0 || source.length === 0) return

	  // Fatal error conditions
	  if (end < start) throw new TypeError('sourceEnd < sourceStart')
	  if (target_start < 0 || target_start >= target.length)
	    throw new TypeError('targetStart out of bounds')
	  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
	  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length)
	    end = this.length
	  if (target.length - target_start < end - start)
	    end = target.length - target_start + start

	  var len = end - start

	  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < len; i++) {
	      target[i + target_start] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), target_start)
	  }
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new TypeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array get/set methods before overwriting
	  arr._get = arr.get
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function isArrayish (subject) {
	  return isArray(subject) || Buffer.isBuffer(subject) ||
	      subject && typeof subject === 'object' &&
	      typeof subject.length === 'number'
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    var b = str.charCodeAt(i)
	    if (b <= 0x7F) {
	      byteArray.push(b)
	    } else {
	      var start = i
	      if (b >= 0xD800 && b <= 0xDFFF) i++
	      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
	      for (var j = 0; j < h.length; j++) {
	        byteArray.push(parseInt(h[j], 16))
	      }
	    }
	  }
	  return byteArray
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(str)
	}

	function blitBuffer (src, dst, offset, length, unitSize) {
	  if (unitSize) length -= length % unitSize;
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length))
	      break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(71).Buffer))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	    var setImmediate = function(fn){
	        setTimeout(fn, 0)
	    }
	    var clearImmediate = clearTimeout
	    /**
	     * Utility methods for working with functions.
	     * These methods augment the Function prototype.
	     *
	     * Using {@link #before}
	     *
	     *      function log(m){
	     *          console.log(m)
	     *      }
	     *
	     *      var doLog = function (m){
	     *          console.log('LOG ')
	     *      }.before(log)
	     *
	     *      doLog('test')
	     *      //will log
	     *      //"LOG "
	     *      //and then
	     *      //"test"
	     *
	     *
	     *
	     * Using {@link #bindArgs}:
	     *
	     *      //returns the sum of all arguments
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1 = add.bindArgs(1)
	     *
	     *      add1(2, 3) == 6
	     *
	     * Using {@link #lockArgs}:
	     *
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1_2   = add.lockArgs(1,2)
	     *      var add1_2_3 = add.lockArgs(1,2,3)
	     *
	     *      add1_2(3,4)  == 3 //args are locked to only be 1 and 2
	     *      add1_2_3(6)  == 6 //args are locked to only be 1, 2 and 3
	     *
	     *
	     *
	     * Using {@link #compose}:
	     *
	     *      function multiply(a,b){
	     *          return a* b
	     *      }
	     *
	     *      var multiply2 = multiply.curry()(2)
	     *
	     *      Function.compose(multiply2( add(5,6) )) == multiply2( add(5,6) )
	     *
	     *
	     * @class Function
	     */

	    var SLICE = Array.prototype.slice

	    var curry = __webpack_require__(72),

	        findFn = function(fn, target, onFound){
	            // if (typeof target.find == 'function'){
	            //     return target.find(fn)
	            // }

	            onFound = typeof onFound == 'function'?
	                        onFound:
	                        function(found, key, target){
	                            return found
	                        }

	            if (Array.isArray(target)){
	                var i   = 0
	                var len = target.length
	                var it

	                for(; i < len; i++){
	                    it = target[i]
	                    if (fn(it, i, target)){
	                        return onFound(it, i, target)
	                    }
	                }

	                return
	            }

	            if (typeof target == 'object'){
	                var keys = Object.keys(target)
	                var i = 0
	                var len = keys.length
	                var k
	                var it

	                for( ; i < len; i++){
	                    k  = keys[i]
	                    it = target[k]

	                    if (fn(it, k, target)){
	                        return onFound(it, k, target)
	                    }
	                }
	            }
	        },

	        find = curry(findFn, 2),

	        findIndex = curry(function(fn, target){
	            return findFn(fn, target, function(it, i){
	                return i
	            })
	        }),

	        bindFunctionsOf = function(obj) {
	            Object.keys(obj).forEach(function(k){
	                if (typeof obj[k] == 'function'){
	                    obj[k] = obj[k].bind(obj)
	                }
	            })

	            return obj
	        },

	        /*
	         * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	         *
	         * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	         *
	         * @return the result of the first function in the enumeration
	         */
	        compose = __webpack_require__(73),

	        chain = __webpack_require__(74),

	        once = __webpack_require__(75),

	        bindArgsArray = __webpack_require__(76),

	        bindArgs = __webpack_require__(77),

	        lockArgsArray = __webpack_require__(78),

	        lockArgs = __webpack_require__(79),

	        skipArgs = function(fn, count){
	            return function(){
	                var args = SLICE.call(arguments, count || 0)

	                return fn.apply(this, args)
	            }
	        },

	        intercept = function(interceptedFn, interceptingFn, withStopArg){

	            return function(){
	                var args    = [].from(arguments),
	                    stopArg = { stop: false }

	                if (withStopArg){
	                    args.push(stopArg)
	                }

	                var result = interceptingFn.apply(this, args)

	                if (withStopArg){
	                    if (stopArg.stop === true){
	                        return result
	                    }

	                } else {
	                    if (result === false){
	                        return result
	                    }
	                }

	                //the interception was not stopped
	                return interceptedFn.apply(this, arguments)
	            }

	        },

	        delay = function(fn, delay, scope){

	            var delayIsNumber = delay * 1 == delay

	            if (arguments.length == 2 && !delayIsNumber){
	                scope = delay
	                delay = 0
	            } else {
	                if (!delayIsNumber){
	                    delay = 0
	                }
	            }

	            return function(){
	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                if (delay || !setImmediate){
	                    setTimeout(function(){
	                        fn.apply(self, args)
	                    }, delay)

	                } else {
	                    setImmediate(function(){
	                        fn.apply(self, args)
	                    })
	                }
	            }
	        },

	        defer = function(fn, scope){
	            return delay(fn, 0, scope)
	        },

	        buffer = function(fn, delay, scope){

	            var timeoutId = -1

	            return function(){

	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                var withTimeout = delay || !setImmediate,
	                    clearFn = withTimeout?
	                                clearTimeout:
	                                clearImmediate,
	                    setFn   = withTimeout?
	                                setTimeout:
	                                setImmediate

	                if (timeoutId !== -1){
	                    clearFn(timeoutId)
	                }

	                timeoutId = setFn(function(){
	                    fn.apply(self, args)
	                    self = null
	                }, delay)

	            }

	        },

	        throttle = function(fn, delay, scope) {
	            var timeoutId = -1,
	                self,
	                args

	            return function () {

	                self = scope || this
	                args = arguments

	                if (timeoutId !== -1) {
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function () {
	                        fn.apply(self, args)

	                        self = null
	                        timeoutId = -1
	                    }, delay)
	                }

	            }

	        },

	        spread = function(fn, delay, scope){

	            var timeoutId       = -1
	            var callCount       = 0
	            var executeCount    = 0
	            var nextArgs        = {}
	            var increaseCounter = true
	            var resultingFnUnbound
	            var resultingFn

	            resultingFn = resultingFnUnbound = function(){

	                var args = arguments,
	                    self = scope || this

	                if (increaseCounter){
	                    nextArgs[callCount++] = {args: args, scope: self}
	                }

	                if (timeoutId !== -1){
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function(){
	                        fn.apply(self, args)

	                        timeoutId = -1
	                        executeCount++

	                        if (callCount !== executeCount){
	                            resultingFn = bindArgsArray(resultingFnUnbound, nextArgs[executeCount].args).bind(nextArgs[executeCount].scope)
	                            delete nextArgs[executeCount]

	                            increaseCounter = false
	                            resultingFn.apply(self)
	                            increaseCounter = true
	                        } else {
	                            nextArgs = {}
	                        }
	                    }, delay)
	                }

	            }

	            return resultingFn
	        },

	        /*
	         * @param {Array} args the array for which to create a cache key
	         * @param {Number} [cacheParamNumber] the number of args to use for the cache key. Use this to limit the args that area actually used for the cache key
	         */
	        getCacheKey = function(args, cacheParamNumber){
	            if (cacheParamNumber == null){
	                cacheParamNumber = -1
	            }

	            var i        = 0,
	                len      = Math.min(args.length, cacheParamNumber),
	                cacheKey = [],
	                it

	            for ( ; i < len; i++){
	                it = args[i]

	                if (root.check.isPlainObject(it) || Array.isArray(it)){
	                    cacheKey.push(JSON.stringify(it))
	                } else {
	                    cacheKey.push(String(it))
	                }
	            }

	            return cacheKey.join(', ')
	        },

	        /*
	         * @param {Function} fn - the function to cache results for
	         * @param {Number} skipCacheParamNumber - the index of the boolean parameter that makes this function skip the caching and
	         * actually return computed results.
	         * @param {Function|String} cacheBucketMethod - a function or the name of a method on this object which makes caching distributed across multiple buckets.
	         * If given, cached results will be searched into the cache corresponding to this bucket. If no result found, return computed result.
	         *
	         * For example this param is very useful when a function from a prototype is cached,
	         * but we want to return the same cached results only for one object that inherits that proto, not for all objects. Thus, for example for Wes.Element,
	         * we use the 'getId' cacheBucketMethod to indicate cached results for one object only.
	         * @param {Function} [cacheKeyBuilder] A function to be used to compose the cache key
	         *
	         * @return {Function} a new function, which returns results from cache, if they are available, otherwise uses the given fn to compute the results.
	         * This returned function has a 'clearCache' function attached, which clears the caching. If a parameter ( a bucket id) is  provided,
	         * only clears the cache in the specified cache bucket.
	         */
	        cache = function(fn, config){
	            config = config || {}

	            var bucketCache = {},
	                cache       = {},
	                skipCacheParamNumber = config.skipCacheIndex,
	                cacheBucketMethod    = config.cacheBucket,
	                cacheKeyBuilder      = config.cacheKey,
	                cacheArgsLength      = skipCacheParamNumber == null?
	                                            fn.length:
	                                            skipCacheParamNumber,
	                cachingFn

	            cachingFn = function(){
	                var result,
	                    skipCache = skipCacheParamNumber != null?
	                                                arguments[skipCacheParamNumber] === true:
	                                                false,
	                    args = skipCache?
	                                    SLICE.call(arguments, 0, cacheArgsLength):
	                                    SLICE.call(arguments),

	                    cacheBucketId = cacheBucketMethod != null?
	                                        typeof cacheBucketMethod == 'function'?
	                                            cacheBucketMethod():
	                                            typeof this[cacheBucketMethod] == 'function'?
	                                                this[cacheBucketMethod]():
	                                                null
	                                        :
	                                        null,


	                    cacheObject = cacheBucketId?
	                                        bucketCache[cacheBucketId]:
	                                        cache,

	                    cacheKey = (cacheKeyBuilder || getCacheKey)(args, cacheArgsLength)

	                if (cacheBucketId && !cacheObject){
	                    cacheObject = bucketCache[cacheBucketId] = {}
	                }

	                if (skipCache || cacheObject[cacheKey] == null){
	                    cacheObject[cacheKey] = result = fn.apply(this, args)
	                } else {
	                    result = cacheObject[cacheKey]
	                }

	                return result
	            }

	            /*
	             * @param {String|Object|Number} [bucketId] the bucket for which to clear the cache. If none given, clears all the cache for this function.
	             */
	            cachingFn.clearCache = function(bucketId){
	                if (bucketId){
	                    delete bucketCache[String(bucketId)]
	                } else {
	                    cache = {}
	                    bucketCache = {}
	                }
	            }

	            /*
	             *
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getCache = function(cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.getBucketCache(null, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket from which to retrieve the cached value
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getBucketCache = function(bucketId, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId);

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {}
	                }

	                return cacheObject[cacheKey]
	            }

	            /*
	             *
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setCache = function(value, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.setBucketCache(null, value, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket for which to set the cache value
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setBucketCache = function(bucketId, value, cacheArgs, cacheParamNumber, cacheKeyBuilder){

	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId)

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {};
	                }

	                return cacheObject[cacheKey] = value
	            }

	            return cachingFn
	        }

	module.exports = {

	    map: __webpack_require__(80),

	    dot: __webpack_require__(81),

	    maxArgs: __webpack_require__(82),

	    /**
	     * @method compose
	     *
	     * Example:
	     *
	     *      zippy.Function.compose(c, b, a)
	     *
	     * See {@link Function#compose}
	     */
	    compose: compose,

	    /**
	     * See {@link Function#self}
	     */
	    self: function(fn){
	        return fn
	    },

	    /**
	     * See {@link Function#buffer}
	     */
	    buffer: buffer,

	    /**
	     * See {@link Function#delay}
	     */
	    delay: delay,

	    /**
	     * See {@link Function#defer}
	     * @param {Function} fn
	     * @param {Object} scope
	     */
	    defer:defer,

	    /**
	     * See {@link Function#skipArgs}
	     * @param {Function} fn
	     * @param {Number} [count=0] how many args to skip when calling the resulting function
	     * @return {Function} The function that will call the original fn without the first count args.
	     */
	    skipArgs: skipArgs,

	    /**
	     * See {@link Function#intercept}
	     */
	    intercept: function(fn, interceptedFn, withStopArgs){
	        return intercept(interceptedFn, fn, withStopArgs)
	    },

	    /**
	     * See {@link Function#throttle}
	     */
	    throttle: throttle,

	    /**
	     * See {@link Function#spread}
	     */
	    spread: spread,

	    /**
	     * See {@link Function#chain}
	     */
	    chain: function(fn, where, mainFn){
	        return chain(where, mainFn, fn)
	    },

	    /**
	     * See {@link Function#before}
	     */
	    before: function(fn, otherFn){
	        return chain('before', otherFn, fn)
	    },

	    /**
	     * See {@link Function#after}
	     */
	    after: function(fn, otherFn){
	        return chain('after', otherFn, fn)
	    },

	    /**
	     * See {@link Function#curry}
	     */
	    curry: curry,

	    /**
	     * See {@link Function#once}
	     */
	    once: once,

	    /**
	     * See {@link Function#bindArgs}
	     */
	    bindArgs: bindArgs,

	    /**
	     * See {@link Function#bindArgsArray}
	     */
	    bindArgsArray: bindArgsArray,

	    /**
	     * See {@link Function#lockArgs}
	     */
	    lockArgs: lockArgs,

	    /**
	     * See {@link Function#lockArgsArray}
	     */
	    lockArgsArray: lockArgsArray,

	    bindFunctionsOf: bindFunctionsOf,

	    find: find,

	    findIndex: findIndex,

	    newify: __webpack_require__(83)
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = /[-\s]+(.)?/g

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = __webpack_require__(58)(/^[a-zA-Z0-9]+$/)

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var F = __webpack_require__(102)

	module.exports = F.curry(function(re, value){
	    return !!re.test(value)
	})

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var regex = /^[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}$/i
	var regex2 = /^\{[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}\}$/i

	module.exports = function(value){
	    return regex.test(value) || regex2.test(value)
	}



/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = __webpack_require__(101).numeric

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var HAS_OWN       = Object.prototype.hasOwnProperty
	var STR_OBJECT    = 'object'

	/**
	 * Copies all properties from source to destination
	 *
	 *      copy({name: 'jon',age:5}, this);
	 *      // => this will have the 'name' and 'age' properties set to 'jon' and 5 respectively
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination){

	    destination = destination || {}

	    if (source != null && typeof source === STR_OBJECT ){

	        for (var i in source) if ( HAS_OWN.call(source, i) ) {
	            destination[i] = source[i]
	        }

	    }

	    return destination
	}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var HAS_OWN       = Object.prototype.hasOwnProperty
	var STR_OBJECT    = 'object'
	var STR_UNDEFINED = 'undefined'

	/**
	 * Copies all properties from source to destination, if the property does not exist into the destination
	 *
	 *      copyIf({name: 'jon',age:5}, {age:7})
	 *      // => { name: 'jon', age: 7}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination){
	    destination = destination || {}

	    if (source != null && typeof source === STR_OBJECT){

	        for (var i in source) if ( HAS_OWN.call(source, i) && (typeof destination[i] === STR_UNDEFINED) ) {

	            destination[i] = source[i]

	        }
	    }

	    return destination
	}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'

	/**
	 * Copies all properties named in the list, from source to destination
	 *
	 *      copyList({name: 'jon',age:5, year: 2006}, {}, ['name','age'])
	 *      // => {name: 'jon', age: 5}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Array} list the array with the names of the properties to copy
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, list){
	    if (arguments.length < 3){
	        list = destination
	        destination = null
	    }

	    destination = destination || {}
	    list        = list || Object.keys(source)

	    var i   = 0
	    var len = list.length
	    var propName

	    for ( ; i < len; i++ ){
	        propName = list[i]

	        if ( typeof source[propName] !== STR_UNDEFINED ) {
	            destination[list[i]] = source[list[i]]
	        }
	    }

	    return destination
	}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'

	/**
	 * Copies all properties named in the list, from source to destination, if the property does not exist into the destination
	 *
	 *      copyListIf({name: 'jon',age:5, year: 2006}, {age: 10}, ['name','age'])
	 *      // => {name: 'jon', age: 10}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Array} list the array with the names of the properties to copy
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, list){
	    if (arguments.length < 3){
	        list = destination
	        destination = null
	    }

	    destination = destination || {}
	    list        = list || Object.keys(source)

	    var i   = 0
	    var len = list.length
	    var propName

	    for ( ; i < len ; i++ ){
	        propName = list[i]
	        if (
	                (typeof source[propName]      !== STR_UNDEFINED) &&
	                (typeof destination[propName] === STR_UNDEFINED)
	            ){
	            destination[propName] = source[propName]
	        }
	    }

	    return destination
	}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'
	var STR_OBJECT    = 'object'
	var HAS_OWN       = Object.prototype.hasOwnProperty

	var copyList = __webpack_require__(64)

	/**
	 * Copies all properties named in the namedKeys, from source to destination
	 *
	 *      copyKeys({name: 'jon',age:5, year: 2006, date: '2010/05/12'}, {}, {name:1 ,age: true, year: 'theYear'})
	 *      // => {name: 'jon', age: 5, theYear: 2006}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Object} namedKeys an object with keys denoting the properties to be copied
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, namedKeys){
	    if (arguments.length < 3 ){
	        namedKeys = destination
	        destination = null
	    }

	    destination = destination || {}

	    if (!namedKeys || Array.isArray(namedKeys)){
	        return copyList(source, destination, namedKeys)
	    }

	    if (
	           source != null && typeof source    === STR_OBJECT &&
	        namedKeys != null && typeof namedKeys === STR_OBJECT
	    ) {
	        var typeOfNamedProperty
	        var namedPropertyValue

	        for  (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {
	            namedPropertyValue  = namedKeys[propName]
	            typeOfNamedProperty = typeof namedPropertyValue

	            if (typeof source[propName] !== STR_UNDEFINED){
	                destination[typeOfNamedProperty == 'string'? namedPropertyValue : propName] = source[propName]
	            }
	        }
	    }

	    return destination
	}

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'
	var STR_OBJECT    = 'object'
	var HAS_OWN       = Object.prototype.hasOwnProperty

	var copyListIf = __webpack_require__(65)

	/**
	 * Copies all properties named in the namedKeys, from source to destination,
	 * but only if the property does not already exist in the destination object
	 *
	 *      copyKeysIf({name: 'jon',age:5, year: 2006}, {aname: 'test'}, {name:'aname' ,age: true})
	 *      // => {aname: 'test', age: 5}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Object} namedKeys an object with keys denoting the properties to be copied
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, namedKeys){
	    if (arguments.length < 3 ){
	        namedKeys = destination
	        destination = null
	    }

	    destination = destination || {}

	    if (!namedKeys || Array.isArray(namedKeys)){
	        return copyListIf(source, destination, namedKeys)
	    }

	    if (
	               source != null && typeof source    === STR_OBJECT &&
	            namedKeys != null && typeof namedKeys === STR_OBJECT
	        ) {

	            var typeOfNamedProperty
	            var namedPropertyValue
	            var newPropertyName

	            for (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {

	                namedPropertyValue  = namedKeys[propName]
	                typeOfNamedProperty = typeof namedPropertyValue
	                newPropertyName     = typeOfNamedProperty == 'string'? namedPropertyValue : propName

	                if (
	                        typeof      source[propName]        !== STR_UNDEFINED &&
	                        typeof destination[newPropertyName] === STR_UNDEFINED
	                    ) {
	                    destination[newPropertyName] = source[propName]
	                }

	            }
	        }

	    return destination
	}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	    var setImmediate = function(fn){
	        setTimeout(fn, 0)
	    }
	    var clearImmediate = clearTimeout
	    /**
	     * Utility methods for working with functions.
	     * These methods augment the Function prototype.
	     *
	     * Using {@link #before}
	     *
	     *      function log(m){
	     *          console.log(m)
	     *      }
	     *
	     *      var doLog = function (m){
	     *          console.log('LOG ')
	     *      }.before(log)
	     *
	     *      doLog('test')
	     *      //will log
	     *      //"LOG "
	     *      //and then
	     *      //"test"
	     *
	     *
	     *
	     * Using {@link #bindArgs}:
	     *
	     *      //returns the sum of all arguments
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1 = add.bindArgs(1)
	     *
	     *      add1(2, 3) == 6
	     *
	     * Using {@link #lockArgs}:
	     *
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1_2   = add.lockArgs(1,2)
	     *      var add1_2_3 = add.lockArgs(1,2,3)
	     *
	     *      add1_2(3,4)  == 3 //args are locked to only be 1 and 2
	     *      add1_2_3(6)  == 6 //args are locked to only be 1, 2 and 3
	     *
	     *
	     *
	     * Using {@link #compose}:
	     *
	     *      function multiply(a,b){
	     *          return a* b
	     *      }
	     *
	     *      var multiply2 = multiply.curry()(2)
	     *
	     *      Function.compose(multiply2( add(5,6) )) == multiply2( add(5,6) )
	     *
	     *
	     * @class Function
	     */

	    var SLICE = Array.prototype.slice

	    var curry = __webpack_require__(104),

	        findFn = function(fn, target, onFound){
	            // if (typeof target.find == 'function'){
	            //     return target.find(fn)
	            // }

	            onFound = typeof onFound == 'function'?
	                        onFound:
	                        function(found, key, target){
	                            return found
	                        }

	            if (Array.isArray(target)){
	                var i   = 0
	                var len = target.length
	                var it

	                for(; i < len; i++){
	                    it = target[i]
	                    if (fn(it, i, target)){
	                        return onFound(it, i, target)
	                    }
	                }

	                return
	            }

	            if (typeof target == 'object'){
	                var keys = Object.keys(target)
	                var i = 0
	                var len = keys.length
	                var k
	                var it

	                for( ; i < len; i++){
	                    k  = keys[i]
	                    it = target[k]

	                    if (fn(it, k, target)){
	                        return onFound(it, k, target)
	                    }
	                }
	            }
	        },

	        find = curry(findFn, 2),

	        findIndex = curry(function(fn, target){
	            return findFn(fn, target, function(it, i){
	                return i
	            })
	        }),

	        bindFunctionsOf = function(obj) {
	            Object.keys(obj).forEach(function(k){
	                if (typeof obj[k] == 'function'){
	                    obj[k] = obj[k].bind(obj)
	                }
	            })

	            return obj
	        },

	        /*
	         * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	         *
	         * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	         *
	         * @return the result of the first function in the enumeration
	         */
	        compose = __webpack_require__(105),

	        chain = __webpack_require__(106),

	        once = __webpack_require__(107),

	        bindArgsArray = __webpack_require__(108),

	        bindArgs = __webpack_require__(109),

	        lockArgsArray = __webpack_require__(110),

	        lockArgs = __webpack_require__(111),

	        skipArgs = function(fn, count){
	            return function(){
	                var args = SLICE.call(arguments, count || 0)

	                return fn.apply(this, args)
	            }
	        },

	        intercept = function(interceptedFn, interceptingFn, withStopArg){

	            return function(){
	                var args    = [].from(arguments),
	                    stopArg = { stop: false }

	                if (withStopArg){
	                    args.push(stopArg)
	                }

	                var result = interceptingFn.apply(this, args)

	                if (withStopArg){
	                    if (stopArg.stop === true){
	                        return result
	                    }

	                } else {
	                    if (result === false){
	                        return result
	                    }
	                }

	                //the interception was not stopped
	                return interceptedFn.apply(this, arguments)
	            }

	        },

	        delay = function(fn, delay, scope){

	            var delayIsNumber = delay * 1 == delay

	            if (arguments.length == 2 && !delayIsNumber){
	                scope = delay
	                delay = 0
	            } else {
	                if (!delayIsNumber){
	                    delay = 0
	                }
	            }

	            return function(){
	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                if (delay || !setImmediate){
	                    setTimeout(function(){
	                        fn.apply(self, args)
	                    }, delay)

	                } else {
	                    setImmediate(function(){
	                        fn.apply(self, args)
	                    })
	                }
	            }
	        },

	        defer = function(fn, scope){
	            return delay(fn, 0, scope)
	        },

	        buffer = function(fn, delay, scope){

	            var timeoutId = -1

	            return function(){

	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                var withTimeout = delay || !setImmediate,
	                    clearFn = withTimeout?
	                                clearTimeout:
	                                clearImmediate,
	                    setFn   = withTimeout?
	                                setTimeout:
	                                setImmediate

	                if (timeoutId !== -1){
	                    clearFn(timeoutId)
	                }

	                timeoutId = setFn(function(){
	                    fn.apply(self, args)
	                    self = null
	                }, delay)

	            }

	        },

	        throttle = function(fn, delay, scope) {
	            var timeoutId = -1,
	                self,
	                args

	            return function () {

	                self = scope || this
	                args = arguments

	                if (timeoutId !== -1) {
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function () {
	                        fn.apply(self, args)

	                        self = null
	                        timeoutId = -1
	                    }, delay)
	                }

	            }

	        },

	        spread = function(fn, delay, scope){

	            var timeoutId       = -1
	            var callCount       = 0
	            var executeCount    = 0
	            var nextArgs        = {}
	            var increaseCounter = true
	            var resultingFnUnbound
	            var resultingFn

	            resultingFn = resultingFnUnbound = function(){

	                var args = arguments,
	                    self = scope || this

	                if (increaseCounter){
	                    nextArgs[callCount++] = {args: args, scope: self}
	                }

	                if (timeoutId !== -1){
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function(){
	                        fn.apply(self, args)

	                        timeoutId = -1
	                        executeCount++

	                        if (callCount !== executeCount){
	                            resultingFn = bindArgsArray(resultingFnUnbound, nextArgs[executeCount].args).bind(nextArgs[executeCount].scope)
	                            delete nextArgs[executeCount]

	                            increaseCounter = false
	                            resultingFn.apply(self)
	                            increaseCounter = true
	                        } else {
	                            nextArgs = {}
	                        }
	                    }, delay)
	                }

	            }

	            return resultingFn
	        },

	        /*
	         * @param {Array} args the array for which to create a cache key
	         * @param {Number} [cacheParamNumber] the number of args to use for the cache key. Use this to limit the args that area actually used for the cache key
	         */
	        getCacheKey = function(args, cacheParamNumber){
	            if (cacheParamNumber == null){
	                cacheParamNumber = -1
	            }

	            var i        = 0,
	                len      = Math.min(args.length, cacheParamNumber),
	                cacheKey = [],
	                it

	            for ( ; i < len; i++){
	                it = args[i]

	                if (root.check.isPlainObject(it) || Array.isArray(it)){
	                    cacheKey.push(JSON.stringify(it))
	                } else {
	                    cacheKey.push(String(it))
	                }
	            }

	            return cacheKey.join(', ')
	        },

	        /*
	         * @param {Function} fn - the function to cache results for
	         * @param {Number} skipCacheParamNumber - the index of the boolean parameter that makes this function skip the caching and
	         * actually return computed results.
	         * @param {Function|String} cacheBucketMethod - a function or the name of a method on this object which makes caching distributed across multiple buckets.
	         * If given, cached results will be searched into the cache corresponding to this bucket. If no result found, return computed result.
	         *
	         * For example this param is very useful when a function from a prototype is cached,
	         * but we want to return the same cached results only for one object that inherits that proto, not for all objects. Thus, for example for Wes.Element,
	         * we use the 'getId' cacheBucketMethod to indicate cached results for one object only.
	         * @param {Function} [cacheKeyBuilder] A function to be used to compose the cache key
	         *
	         * @return {Function} a new function, which returns results from cache, if they are available, otherwise uses the given fn to compute the results.
	         * This returned function has a 'clearCache' function attached, which clears the caching. If a parameter ( a bucket id) is  provided,
	         * only clears the cache in the specified cache bucket.
	         */
	        cache = function(fn, config){
	            config = config || {}

	            var bucketCache = {},
	                cache       = {},
	                skipCacheParamNumber = config.skipCacheIndex,
	                cacheBucketMethod    = config.cacheBucket,
	                cacheKeyBuilder      = config.cacheKey,
	                cacheArgsLength      = skipCacheParamNumber == null?
	                                            fn.length:
	                                            skipCacheParamNumber,
	                cachingFn

	            cachingFn = function(){
	                var result,
	                    skipCache = skipCacheParamNumber != null?
	                                                arguments[skipCacheParamNumber] === true:
	                                                false,
	                    args = skipCache?
	                                    SLICE.call(arguments, 0, cacheArgsLength):
	                                    SLICE.call(arguments),

	                    cacheBucketId = cacheBucketMethod != null?
	                                        typeof cacheBucketMethod == 'function'?
	                                            cacheBucketMethod():
	                                            typeof this[cacheBucketMethod] == 'function'?
	                                                this[cacheBucketMethod]():
	                                                null
	                                        :
	                                        null,


	                    cacheObject = cacheBucketId?
	                                        bucketCache[cacheBucketId]:
	                                        cache,

	                    cacheKey = (cacheKeyBuilder || getCacheKey)(args, cacheArgsLength)

	                if (cacheBucketId && !cacheObject){
	                    cacheObject = bucketCache[cacheBucketId] = {}
	                }

	                if (skipCache || cacheObject[cacheKey] == null){
	                    cacheObject[cacheKey] = result = fn.apply(this, args)
	                } else {
	                    result = cacheObject[cacheKey]
	                }

	                return result
	            }

	            /*
	             * @param {String|Object|Number} [bucketId] the bucket for which to clear the cache. If none given, clears all the cache for this function.
	             */
	            cachingFn.clearCache = function(bucketId){
	                if (bucketId){
	                    delete bucketCache[String(bucketId)]
	                } else {
	                    cache = {}
	                    bucketCache = {}
	                }
	            }

	            /*
	             *
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getCache = function(cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.getBucketCache(null, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket from which to retrieve the cached value
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getBucketCache = function(bucketId, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId);

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {}
	                }

	                return cacheObject[cacheKey]
	            }

	            /*
	             *
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setCache = function(value, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.setBucketCache(null, value, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket for which to set the cache value
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setBucketCache = function(bucketId, value, cacheArgs, cacheParamNumber, cacheKeyBuilder){

	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId)

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {};
	                }

	                return cacheObject[cacheKey] = value
	            }

	            return cachingFn
	        }

	module.exports = {

	    map: __webpack_require__(112),

	    dot: __webpack_require__(113),

	    maxArgs: __webpack_require__(114),

	    /**
	     * @method compose
	     *
	     * Example:
	     *
	     *      zippy.Function.compose(c, b, a)
	     *
	     * See {@link Function#compose}
	     */
	    compose: compose,

	    /**
	     * See {@link Function#self}
	     */
	    self: function(fn){
	        return fn
	    },

	    /**
	     * See {@link Function#buffer}
	     */
	    buffer: buffer,

	    /**
	     * See {@link Function#delay}
	     */
	    delay: delay,

	    /**
	     * See {@link Function#defer}
	     * @param {Function} fn
	     * @param {Object} scope
	     */
	    defer:defer,

	    /**
	     * See {@link Function#skipArgs}
	     * @param {Function} fn
	     * @param {Number} [count=0] how many args to skip when calling the resulting function
	     * @return {Function} The function that will call the original fn without the first count args.
	     */
	    skipArgs: skipArgs,

	    /**
	     * See {@link Function#intercept}
	     */
	    intercept: function(fn, interceptedFn, withStopArgs){
	        return intercept(interceptedFn, fn, withStopArgs)
	    },

	    /**
	     * See {@link Function#throttle}
	     */
	    throttle: throttle,

	    /**
	     * See {@link Function#spread}
	     */
	    spread: spread,

	    /**
	     * See {@link Function#chain}
	     */
	    chain: function(fn, where, mainFn){
	        return chain(where, mainFn, fn)
	    },

	    /**
	     * See {@link Function#before}
	     */
	    before: function(fn, otherFn){
	        return chain('before', otherFn, fn)
	    },

	    /**
	     * See {@link Function#after}
	     */
	    after: function(fn, otherFn){
	        return chain('after', otherFn, fn)
	    },

	    /**
	     * See {@link Function#curry}
	     */
	    curry: curry,

	    /**
	     * See {@link Function#once}
	     */
	    once: once,

	    /**
	     * See {@link Function#bindArgs}
	     */
	    bindArgs: bindArgs,

	    /**
	     * See {@link Function#bindArgsArray}
	     */
	    bindArgsArray: bindArgsArray,

	    /**
	     * See {@link Function#lockArgs}
	     */
	    lockArgs: lockArgs,

	    /**
	     * See {@link Function#lockArgsArray}
	     */
	    lockArgsArray: lockArgsArray,

	    bindFunctionsOf: bindFunctionsOf,

	    find: find,

	    findIndex: findIndex,

	    newify: __webpack_require__(115)
	}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(116)

	__webpack_require__(86)
	__webpack_require__(87)

	var COMPUTE_ALIGN_REGION = __webpack_require__(88)

	/**
	 * region-align module exposes methods for aligning {@link Element} and {@link Region} instances
	 *
	 * The #alignTo method aligns this to the target element/region using the specified positions. See #alignTo for a graphical example.
	 *
	 *
	 *      var div = Element.select('div.first')
	 *
	 *      div.alignTo(Element.select('body') , 'br-br')
	 *
	 *      //aligns the div to be in the bottom-right corner of the body
	 *
	 * Other useful methods
	 *
	 *  * {@link #alignRegions} - aligns a given source region to a target region
	 *  * {@link #COMPUTE_ALIGN_REGION} - given a source region and a target region, and alignment positions, returns a clone of the source region, but aligned to satisfy the given alignments
	 */


	/**
	 * Aligns sourceRegion to targetRegion. It modifies the sourceRegion in order to perform the correct alignment.
	 * See #COMPUTE_ALIGN_REGION for details and examples.
	 *
	 * This method calls #COMPUTE_ALIGN_REGION passing to it all its arguments. The #COMPUTE_ALIGN_REGION method returns a region that is properly aligned.
	 * If this returned region position/size differs from sourceRegion, then the sourceRegion is modified to be an exact copy of the aligned region.
	 *
	 * @inheritdoc #COMPUTE_ALIGN_REGION
	 * @return {String} the position used for alignment
	 */
	Region.alignRegions = function(sourceRegion, targetRegion, positions, config){

	    var result        = COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config)
	    var alignedRegion = result.region

	    if ( !alignedRegion.equals(sourceRegion) ) {
	        sourceRegion.setRegion(alignedRegion)
	    }

	    return result.position

	}

	    /**
	     *
	     * The #alignTo method aligns this to the given target region, using the specified alignment position(s).
	     * You can also specify a constrain for the alignment.
	     *
	     * Example
	     *
	     *      BIG
	     *      ________________________
	     *      |  _______              |
	     *      | |       |             |
	     *      | |   A   |             |
	     *      | |       |      _____  |
	     *      | |_______|     |     | |
	     *      |               |  B  | |
	     *      |               |     | |
	     *      |_______________|_____|_|
	     *
	     * Assume the *BIG* outside rectangle is our constrain region, and you want to align the *A* rectangle
	     * to the *B* rectangle. Ideally, you'll want their tops to be aligned, and *A* to be placed at the right side of *B*
	     *
	     *
	     *      //so we would align them using
	     *
	     *      A.alignTo(B, 'tl-tr', { constrain: BIG })
	     *
	     * But this would result in
	     *
	     *       BIG
	     *      ________________________
	     *      |                       |
	     *      |                       |
	     *      |                       |
	     *      |                _____ _|_____
	     *      |               |     | .     |
	     *      |               |  B  | . A   |
	     *      |               |     | .     |
	     *      |_______________|_____|_._____|
	     *
	     *
	     * Which is not what we want. So we specify an array of options to try
	     *
	     *      A.alignTo(B, ['tl-tr', 'tr-tl'], { constrain: BIG })
	     *
	     * So by this we mean: try to align A(top,left) with B(top,right) and stick to the BIG constrain. If this is not possible,
	     * try the next option: align A(top,right) with B(top,left)
	     *
	     * So this is what we end up with
	     *
	     *      BIG
	     *      ________________________
	     *      |                       |
	     *      |                       |
	     *      |                       |
	     *      |        _______ _____  |
	     *      |       |       |     | |
	     *      |       |   A   |  B  | |
	     *      |       |       |     | |
	     *      |_______|_______|_____|_|
	     *
	     *
	     * Which is a lot better!
	     *
	     * @param {Element/Region} target The target to which to align this alignable.
	     *
	     * @param {String[]/String} positions The positions for the alignment.
	     *
	     * Example:
	     *
	     *      'br-tl'
	     *      ['br-tl','br-tr','cx-tc']
	     *
	     * This method will try to align using the first position. But if there is a constrain region, that position might not satisfy the constrain.
	     * If this is the case, the next positions will be tried. If one of them satifies the constrain, it will be used for aligning and it will be returned from this method.
	     *
	     * If no position matches the contrain, the one with the largest intersection of the source region with the constrain will be used, and this alignable will be resized to fit the constrain region.
	     *
	     * @param {Object} config A config object with other configuration for this method
	     *
	     * @param {Array[]/Object[]/Object} config.offset The offset to use for aligning. If more that one offset is specified, then offset at a given index is used with the position at the same index.
	     *
	     * An offset can have the following form:
	     *
	     *      [left_offset, top_offset]
	     *      {left: left_offset, top: top_offset}
	     *      {x: left_offset, y: top_offset}
	     *
	     * You can pass one offset or an array of offsets. In case you pass just one offset,
	     * it cannot have the array form, so you cannot call
	     *
	     *      this.alignTo(target, positions, [10, 20])
	     *
	     * If you do, it will not be considered. Instead, please use
	     *
	     *      this.alignTo(target, positions, {x: 10, y: 20})
	     *
	     * Or
	     *
	     *      this.alignTo(target, positions, [[10, 20]] )
	     *
	     * @param {Boolean/Element/Region} config.constrain If boolean, target will be constrained to the document region, otherwise,
	     * getRegion will be called on this argument to determine the region we need to constrain to.
	     *
	     * @param {Boolean/Object} config.sync Either boolean or an object with {width, height}. If it is boolean,
	     * both width and height will be synced. If directions are specified, will only sync the direction which is specified as true
	     *
	     * @return {String}
	     *
	     */
	Region.prototype.alignTo = function(target, positions, config){

	    config = config || {}

	    var sourceRegion = this
	    var targetRegion = Region.from(target)

	    var result = COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config)
	    var resultRegion = result.region

	    if (!resultRegion.equalsSize(sourceRegion)){
	        this.setSize(resultRegion.getSize())
	    }
	    if (!resultRegion.equalsPosition(sourceRegion)){
	        this.setPosition(resultRegion.getPosition(), { absolute: !!config.absolute })
	    }

	    return result.position
	}

	module.exports = Region

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	    'numeric'  : __webpack_require__(89),
	    'number'   : __webpack_require__(90),
	    'int'      : __webpack_require__(91),
	    'float'    : __webpack_require__(92),
	    'string'   : __webpack_require__(93),
	    'function' : __webpack_require__(94),
	    'object'   : __webpack_require__(95),
	    'arguments': __webpack_require__(96),
	    'boolean'  : __webpack_require__(97),
	    'date'     : __webpack_require__(98),
	    'regexp'   : __webpack_require__(99),
	    'array'    : __webpack_require__(100)
	}

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(103)
	var ieee754 = __webpack_require__(84)
	var isArray = __webpack_require__(85)

	exports.Buffer = Buffer
	exports.SlowBuffer = Buffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var kMaxLength = 0x3fffffff

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Note:
	 *
	 * - Implementation must support adding new properties to `Uint8Array` instances.
	 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
	 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *    incorrect length in some situations.
	 *
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
	 * get the Object implementation, which is slower but will work correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    return 42 === arr.foo() && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (subject, encoding, noZero) {
	  if (!(this instanceof Buffer))
	    return new Buffer(subject, encoding, noZero)

	  var type = typeof subject

	  // Find the length
	  var length
	  if (type === 'number')
	    length = subject > 0 ? subject >>> 0 : 0
	  else if (type === 'string') {
	    if (encoding === 'base64')
	      subject = base64clean(subject)
	    length = Buffer.byteLength(subject, encoding)
	  } else if (type === 'object' && subject !== null) { // assume object is array-like
	    if (subject.type === 'Buffer' && isArray(subject.data))
	      subject = subject.data
	    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
	  } else
	    throw new TypeError('must start with number, buffer, array or string')

	  if (this.length > kMaxLength)
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	      'size: 0x' + kMaxLength.toString(16) + ' bytes')

	  var buf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Preferred: Return an augmented `Uint8Array` instance for best performance
	    buf = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return THIS instance of Buffer (created by `new`)
	    buf = this
	    buf.length = length
	    buf._isBuffer = true
	  }

	  var i
	  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
	    // Speed optimization -- use set if we're copying from a typed array
	    buf._set(subject)
	  } else if (isArrayish(subject)) {
	    // Treat array-ish objects as a byte array
	    if (Buffer.isBuffer(subject)) {
	      for (i = 0; i < length; i++)
	        buf[i] = subject.readUInt8(i)
	    } else {
	      for (i = 0; i < length; i++)
	        buf[i] = ((subject[i] % 256) + 256) % 256
	    }
	  } else if (type === 'string') {
	    buf.write(subject, 0, encoding)
	  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
	    for (i = 0; i < length; i++) {
	      buf[i] = 0
	    }
	  }

	  return buf
	}

	Buffer.isBuffer = function (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
	    throw new TypeError('Arguments must be Buffers')

	  var x = a.length
	  var y = b.length
	  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function (list, totalLength) {
	  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (totalLength === undefined) {
	    totalLength = 0
	    for (i = 0; i < list.length; i++) {
	      totalLength += list[i].length
	    }
	  }

	  var buf = new Buffer(totalLength)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	Buffer.byteLength = function (str, encoding) {
	  var ret
	  str = str + ''
	  switch (encoding || 'utf8') {
	    case 'ascii':
	    case 'binary':
	    case 'raw':
	      ret = str.length
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = str.length * 2
	      break
	    case 'hex':
	      ret = str.length >>> 1
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8ToBytes(str).length
	      break
	    case 'base64':
	      ret = base64ToBytes(str).length
	      break
	    default:
	      ret = str.length
	  }
	  return ret
	}

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function (encoding, start, end) {
	  var loweredCase = false

	  start = start >>> 0
	  end = end === undefined || end === Infinity ? this.length : end >>> 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase)
	          throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.equals = function (b) {
	  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max)
	      str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  return Buffer.compare(this, b)
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var byte = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(byte)) throw new Error('Invalid hex string')
	    buf[offset + i] = byte
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function asciiWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function utf16leWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length, 2)
	  return charsWritten
	}

	Buffer.prototype.write = function (string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length
	      length = undefined
	    }
	  } else {  // legacy
	    var swap = encoding
	    encoding = offset
	    offset = length
	    length = swap
	  }

	  offset = Number(offset) || 0
	  var remaining = this.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase()

	  var ret
	  switch (encoding) {
	    case 'hex':
	      ret = hexWrite(this, string, offset, length)
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8Write(this, string, offset, length)
	      break
	    case 'ascii':
	      ret = asciiWrite(this, string, offset, length)
	      break
	    case 'binary':
	      ret = binaryWrite(this, string, offset, length)
	      break
	    case 'base64':
	      ret = base64Write(this, string, offset, length)
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = utf16leWrite(this, string, offset, length)
	      break
	    default:
	      throw new TypeError('Unknown encoding: ' + encoding)
	  }
	  return ret
	}

	Buffer.prototype.toJSON = function () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  return asciiSlice(buf, start, end)
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len;
	    if (start < 0)
	      start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0)
	      end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start)
	    end = start

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    return Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    var newBuf = new Buffer(sliceLen, undefined, true)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	    return newBuf
	  }
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0)
	    throw new RangeError('offset is not uint')
	  if (offset + ext > length)
	    throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUInt8 = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	      ((this[offset + 1] << 16) |
	      (this[offset + 2] << 8) |
	      this[offset + 3])
	}

	Buffer.prototype.readInt8 = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80))
	    return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16) |
	      (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	      (this[offset + 1] << 16) |
	      (this[offset + 2] << 8) |
	      (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new TypeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new TypeError('index out of range')
	}

	Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else objectWriteUInt16(this, value, offset, true)
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else objectWriteUInt16(this, value, offset, false)
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else objectWriteUInt32(this, value, offset, true)
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else objectWriteUInt32(this, value, offset, false)
	  return offset + 4
	}

	Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else objectWriteUInt16(this, value, offset, true)
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else objectWriteUInt16(this, value, offset, false)
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else objectWriteUInt32(this, value, offset, true)
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else objectWriteUInt32(this, value, offset, false)
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new TypeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new TypeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert)
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert)
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function (target, target_start, start, end) {
	  var source = this

	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (!target_start) target_start = 0

	  // Copy 0 bytes; we're done
	  if (end === start) return
	  if (target.length === 0 || source.length === 0) return

	  // Fatal error conditions
	  if (end < start) throw new TypeError('sourceEnd < sourceStart')
	  if (target_start < 0 || target_start >= target.length)
	    throw new TypeError('targetStart out of bounds')
	  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
	  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length)
	    end = this.length
	  if (target.length - target_start < end - start)
	    end = target.length - target_start + start

	  var len = end - start

	  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < len; i++) {
	      target[i + target_start] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), target_start)
	  }
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new TypeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array get/set methods before overwriting
	  arr._get = arr.get
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function isArrayish (subject) {
	  return isArray(subject) || Buffer.isBuffer(subject) ||
	      subject && typeof subject === 'object' &&
	      typeof subject.length === 'number'
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    var b = str.charCodeAt(i)
	    if (b <= 0x7F) {
	      byteArray.push(b)
	    } else {
	      var start = i
	      if (b >= 0xD800 && b <= 0xDFFF) i++
	      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
	      for (var j = 0; j < h.length; j++) {
	        byteArray.push(parseInt(h[j], 16))
	      }
	    }
	  }
	  return byteArray
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(str)
	}

	function blitBuffer (src, dst, offset, length, unitSize) {
	  if (unitSize) length -= length % unitSize;
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length))
	      break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(71).Buffer))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function composeTwo(f, g) {
	    return function () {
	        return f(g.apply(this, arguments))
	    }
	}

	/*
	 * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	 *
	 * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	 *
	 * @return the result of the first function in the enumeration
	 */
	module.exports = function(){

	    var args = arguments
	    var len  = args.length
	    var i    = 0
	    var f    = args[0]

	    while (++i < len) {
	        f = composeTwo(f, args[i])
	    }

	    return f
	}

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function chain(where, fn, secondFn){

	    return function(){
	        if (where === 'before'){
	            secondFn.apply(this, arguments)
	        }

	        var result = fn.apply(this, arguments)

	        if (where !== 'before'){
	            secondFn.apply(this, arguments)
	        }

	        return result
	    }
	}

	module.exports = chain

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use once'

	function once(fn, scope){

	    var called
	    var result

	    return function(){
	        if (called){
	            return result
	        }

	        called = true

	        return result = fn.apply(scope || this, arguments)
	    }
	}

	module.exports = once

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){
	    return function(){
	        var thisArgs = SLICE.call(args || [])

	        if (arguments.length){
	            thisArgs.push.apply(thisArgs, arguments)
	        }

	        return fn.apply(this, thisArgs)
	    }
	}

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var bindArgsArray = __webpack_require__(76)

	module.exports = function(fn){
	    return bindArgsArray(fn, SLICE.call(arguments,1))
	}

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){

	    return function(){
	        if (!Array.isArray(args)){
	            args = SLICE.call(args || [])
	        }

	        return fn.apply(this, args)
	    }
	}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var lockArgsArray = __webpack_require__(78)

	module.exports = function(fn){
	    return lockArgsArray(fn, SLICE.call(arguments, 1))
	}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(72)

	module.exports = curry(function(fn, value){
	    return value != undefined && typeof value.map?
	            value.map(fn):
	            fn(value)
	})

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(72)

	module.exports = curry(function(prop, value){
	    return value != undefined? value[prop]: undefined
	})

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var curry = __webpack_require__(72)

	module.exports = function(fn, count){
	    return function(){
	        return fn.apply(this, SLICE.call(arguments, 0, count))
	    }
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var newify = __webpack_require__(118)
	var curry  = __webpack_require__(72)

	module.exports = curry(newify)

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	exports.read = function(buffer, offset, isLE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isLE ? (nBytes - 1) : 0,
	      d = isLE ? -1 : 1,
	      s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity);
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isLE ? 0 : (nBytes - 1),
	      d = isLE ? 1 : -1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

	  buffer[offset + i - d] |= s * 128;
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var Region = __webpack_require__(116)

	/**
	 * @static
	 * Aligns the source region to the target region, so as to correspond to the given alignment.
	 *
	 * NOTE that this method makes changes on the sourceRegion in order for it to be aligned as specified.
	 *
	 * @param {Region} sourceRegion
	 * @param {Region} targetRegion
	 *
	 * @param {String} align A string with 2 valid align positions, eg: 'tr-bl'.
	 * For valid positions, see {@link Region#getPoint}
	 *
	 * Having 2 regions, we need to be able to align them as we wish:
	 *
	 * for example, if we have
	 *
	 *       source    target
	 *       ________________
	 *       ____
	 *      |    |     ________
	 *      |____|    |        |
	 *                |        |
	 *                |________|
	 *
	 * and we align 't-t', we get:
	 *
	 *       source    target
	 *       _________________
	 *
	 *       ____      ________
	 *      |    |    |        |
	 *      |____|    |        |
	 *                |________|
	 *
	 *  In this case, the source was moved down to be aligned to the top of the target
	 *
	 *
	 * and if we align 'tc-tc' we get
	 *
	 *       source     target
	 *       __________________
	 *
	 *                 ________
	 *                | |    | |
	 *                | |____| |
	 *                |________|
	 *
	 *  Since the source was moved to have the top-center point to be the same with target top-center
	 *
	 *
	 *
	 * @return {RegionClass} The Region class
	 */
	Region.align = function(sourceRegion, targetRegion, align){

	    targetRegion = Region.from(targetRegion)

	    align = (align || 'c-c').split('-')

	    //<debug>
	    if (align.length != 2){
	        console.warn('Incorrect region alignment! The align parameter need to be in the form \'br-c\', that is, a - separated string!', align)
	    }
	    //</debug>

	    return Region.alignToPoint(sourceRegion, targetRegion.getPoint(align[1]), align[0])
	}

	/**
	 * Modifies the given region to be aligned to the point, as specified by anchor
	 *
	 * @param {Region} region The region to align to the point
	 * @param {Object} point The point to be used as a reference
	 * @param {Number} point.x
	 * @param {Number} point.y
	 * @param {String} anchor The position where to anchor the region to the point. See {@link #getPoint} for available options/
	 *
	 * @return {Region} the given region
	 */
	Region.alignToPoint = function(region, point, anchor){

	    region = Region.from(region)

	    var sourcePoint = region.getPoint(anchor)
	    var count       = 0
	    var shiftObj    = {}

	    if (
	            sourcePoint.x != null &&
	            point.x != null
	        ){

	            count++
	            shiftObj.left = point.x - sourcePoint.x
	    }

	    if (
	            sourcePoint.y != null &&
	            point.y != null
	        ){
	            count++
	            shiftObj.top = point.y - sourcePoint.y
	    }

	    if (count){

	        region.shift(shiftObj)

	    }

	    return region
	}

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(116)

	/**
	 *
	 * Aligns this region to the given region
	 * @param {Region} region
	 * @param {String} alignPositions For available positions, see {@link #getPoint}
	 *
	 *     eg: 'tr-bl'
	 *
	 * @return this
	 */
	Region.prototype.alignToRegion = function(region, alignPositions){
	    Region.align(this, region, alignPositions)

	    return this
	}

	/**
	 * Aligns this region to the given point, in the anchor position
	 * @param {Object} point eg: {x: 20, y: 600}
	 * @param {Number} point.x
	 * @param {Number} point.y
	 *
	 * @param {String} anchor For available positions, see {@link #getPoint}
	 *
	 *     eg: 'bl'
	 *
	 * @return this
	 */
	 Region.prototype.alignToPoint = function(point, anchor){
	    Region.alignToPoint(this, point, anchor)

	    return this
	}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var ALIGN_TO_NORMALIZED = __webpack_require__(117)

	var Region = __webpack_require__(116)

	/**
	 * @localdoc Given source and target regions, and the given alignments required, returns a region that is the resulting allignment.
	 * Does not modify the sourceRegion.
	 *
	 * Example
	 *
	 *      var sourceRegion = zippy.getInstance({
	 *          alias  : 'z.region',
	 *          top    : 10,
	 *          left   : 10,
	 *          bottom : 40,
	 *          right  : 100
	 *      })
	 *
	 *      var targetRegion = zippy.getInstance({
	 *          alias  : 'z.region',
	 *          top    : 10,
	 *          left   : 10,
	 *          bottom : 40,
	 *          right  : 100
	 *      })
	 *      //has top-left at (10,10)
	 *      //and bottom-right at (40, 100)
	 *
	 *      var alignRegion = alignable.COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, 'tl-br')
	 *
	 *      //alignRegion will be a clone of sourceRegion, but will have the
	 *      //top-left corner aligned with bottom-right of targetRegion
	 *
	 *      alignRegion.get() // => { top: 40, left: 100, bottom: 70, right: 190 }
	 *
	 * @param  {Region} sourceRegion The source region to align to targetRegion
	 * @param  {Region} targetRegion The target region to which to align the sourceRegion
	 * @param  {String/String[]} positions    A string ( delimited by "-" characters ) or an array of strings with the position to try, in the order of their priority.
	 * See Region#getPoint for a list of available positions. They can be combined in any way.
	 * @param  {Object} config      A config object with other configuration for the alignment
	 * @param  {Object/Object[]} config.offset      Optional offsets. Either an object or an array with a different offset for each position
	 * @param  {Element/Region/Boolean} config.constrain  The constrain to region or element. If the boolean true, Region.getDocRegion() will be used
	 * @param  {Object/Boolean} config.sync   A boolean object that indicates whether to sync sourceRegion and targetRegion sizes (width/height or both). Can be
	 *
	 *  * true - in order to sync both width and height
	 *  * { width: true }  - to only sync width
	 *  * { height: true } - to only sync height
	 *  * { size: true }   - to sync both width and height
	 *
	 * @return {Object} an object with the following keys:
	 *
	 *  * position - the position where the alignment was made. One of the given positions
	 *  * region   - the region where the alignment is in place
	 *  * positionChanged - boolean value indicating if the position of the returned region is different from the position of sourceRegion
	 *  * widthChanged    - boolean value indicating if the width of the returned region is different from the width of sourceRegion
	 *  * heightChanged   - boolean value indicating if the height of the returned region is different from the height of sourceRegion
	 */
	function COMPUTE_ALIGN_REGION(sourceRegion, targetRegion, positions, config){
	    sourceRegion = Region.from(sourceRegion)

	    var sourceClone = sourceRegion.clone()
	    var position    = ALIGN_TO_NORMALIZED(sourceClone, targetRegion, positions, config)

	    return {
	        position        : position,
	        region          : sourceClone,
	        widthChanged    : sourceClone.getWidth() != sourceRegion.getWidth(),
	        heightChanged   : sourceClone.getHeight() != sourceRegion.getHeight(),
	        positionChanged : sourceClone.equalsPosition(sourceRegion)
	    }
	}


	module.exports = COMPUTE_ALIGN_REGION

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return !isNaN( parseFloat( value ) ) && isFinite( value )
	}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value === 'number' && isFinite(value)
	}

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(90)

	module.exports = function(value){
	    return number(value) && (value === parseInt(value, 10))
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(90)

	module.exports = function(value){
	    return number(value) && (value === parseFloat(value, 10)) && !(value === parseInt(value, 10))
	}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'string'
	}

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Function]'
	}

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Object]'
	}

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Arguments]' || !!value.callee
	}

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'boolean'
	}

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Date]'
	}

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object RegExp]'
	}

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return Array.isArray(value)
	}

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(119)

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	    var setImmediate = function(fn){
	        setTimeout(fn, 0)
	    }
	    var clearImmediate = clearTimeout
	    /**
	     * Utility methods for working with functions.
	     * These methods augment the Function prototype.
	     *
	     * Using {@link #before}
	     *
	     *      function log(m){
	     *          console.log(m)
	     *      }
	     *
	     *      var doLog = function (m){
	     *          console.log('LOG ')
	     *      }.before(log)
	     *
	     *      doLog('test')
	     *      //will log
	     *      //"LOG "
	     *      //and then
	     *      //"test"
	     *
	     *
	     *
	     * Using {@link #bindArgs}:
	     *
	     *      //returns the sum of all arguments
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1 = add.bindArgs(1)
	     *
	     *      add1(2, 3) == 6
	     *
	     * Using {@link #lockArgs}:
	     *
	     *      function add(){
	     *          var sum = 0
	     *          [].from(arguments).forEach(function(n){
	     *              sum += n
	     *          })
	     *
	     *          return sum
	     *      }
	     *
	     *      var add1_2   = add.lockArgs(1,2)
	     *      var add1_2_3 = add.lockArgs(1,2,3)
	     *
	     *      add1_2(3,4)  == 3 //args are locked to only be 1 and 2
	     *      add1_2_3(6)  == 6 //args are locked to only be 1, 2 and 3
	     *
	     *
	     *
	     * Using {@link #compose}:
	     *
	     *      function multiply(a,b){
	     *          return a* b
	     *      }
	     *
	     *      var multiply2 = multiply.curry()(2)
	     *
	     *      Function.compose(multiply2( add(5,6) )) == multiply2( add(5,6) )
	     *
	     *
	     * @class Function
	     */

	    var SLICE = Array.prototype.slice

	    var curry = __webpack_require__(120),

	        findFn = function(fn, target, onFound){
	            // if (typeof target.find == 'function'){
	            //     return target.find(fn)
	            // }

	            onFound = typeof onFound == 'function'?
	                        onFound:
	                        function(found, key, target){
	                            return found
	                        }

	            if (Array.isArray(target)){
	                var i   = 0
	                var len = target.length
	                var it

	                for(; i < len; i++){
	                    it = target[i]
	                    if (fn(it, i, target)){
	                        return onFound(it, i, target)
	                    }
	                }

	                return
	            }

	            if (typeof target == 'object'){
	                var keys = Object.keys(target)
	                var i = 0
	                var len = keys.length
	                var k
	                var it

	                for( ; i < len; i++){
	                    k  = keys[i]
	                    it = target[k]

	                    if (fn(it, k, target)){
	                        return onFound(it, k, target)
	                    }
	                }
	            }
	        },

	        find = curry(findFn, 2),

	        findIndex = curry(function(fn, target){
	            return findFn(fn, target, function(it, i){
	                return i
	            })
	        }),

	        bindFunctionsOf = function(obj) {
	            Object.keys(obj).forEach(function(k){
	                if (typeof obj[k] == 'function'){
	                    obj[k] = obj[k].bind(obj)
	                }
	            })

	            return obj
	        },

	        /*
	         * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	         *
	         * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	         *
	         * @return the result of the first function in the enumeration
	         */
	        compose = __webpack_require__(121),

	        chain = __webpack_require__(122),

	        once = __webpack_require__(123),

	        bindArgsArray = __webpack_require__(124),

	        bindArgs = __webpack_require__(125),

	        lockArgsArray = __webpack_require__(126),

	        lockArgs = __webpack_require__(127),

	        skipArgs = function(fn, count){
	            return function(){
	                var args = SLICE.call(arguments, count || 0)

	                return fn.apply(this, args)
	            }
	        },

	        intercept = function(interceptedFn, interceptingFn, withStopArg){

	            return function(){
	                var args    = [].from(arguments),
	                    stopArg = { stop: false }

	                if (withStopArg){
	                    args.push(stopArg)
	                }

	                var result = interceptingFn.apply(this, args)

	                if (withStopArg){
	                    if (stopArg.stop === true){
	                        return result
	                    }

	                } else {
	                    if (result === false){
	                        return result
	                    }
	                }

	                //the interception was not stopped
	                return interceptedFn.apply(this, arguments)
	            }

	        },

	        delay = function(fn, delay, scope){

	            var delayIsNumber = delay * 1 == delay

	            if (arguments.length == 2 && !delayIsNumber){
	                scope = delay
	                delay = 0
	            } else {
	                if (!delayIsNumber){
	                    delay = 0
	                }
	            }

	            return function(){
	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                if (delay || !setImmediate){
	                    setTimeout(function(){
	                        fn.apply(self, args)
	                    }, delay)

	                } else {
	                    setImmediate(function(){
	                        fn.apply(self, args)
	                    })
	                }
	            }
	        },

	        defer = function(fn, scope){
	            return delay(fn, 0, scope)
	        },

	        buffer = function(fn, delay, scope){

	            var timeoutId = -1

	            return function(){

	                var self = scope || this,
	                    args = arguments

	                if (delay < 0){
	                    fn.apply(self, args)
	                    return
	                }

	                var withTimeout = delay || !setImmediate,
	                    clearFn = withTimeout?
	                                clearTimeout:
	                                clearImmediate,
	                    setFn   = withTimeout?
	                                setTimeout:
	                                setImmediate

	                if (timeoutId !== -1){
	                    clearFn(timeoutId)
	                }

	                timeoutId = setFn(function(){
	                    fn.apply(self, args)
	                    self = null
	                }, delay)

	            }

	        },

	        throttle = function(fn, delay, scope) {
	            var timeoutId = -1,
	                self,
	                args

	            return function () {

	                self = scope || this
	                args = arguments

	                if (timeoutId !== -1) {
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function () {
	                        fn.apply(self, args)

	                        self = null
	                        timeoutId = -1
	                    }, delay)
	                }

	            }

	        },

	        spread = function(fn, delay, scope){

	            var timeoutId       = -1
	            var callCount       = 0
	            var executeCount    = 0
	            var nextArgs        = {}
	            var increaseCounter = true
	            var resultingFnUnbound
	            var resultingFn

	            resultingFn = resultingFnUnbound = function(){

	                var args = arguments,
	                    self = scope || this

	                if (increaseCounter){
	                    nextArgs[callCount++] = {args: args, scope: self}
	                }

	                if (timeoutId !== -1){
	                    //the function was called once again in the delay interval
	                } else {
	                    timeoutId = setTimeout(function(){
	                        fn.apply(self, args)

	                        timeoutId = -1
	                        executeCount++

	                        if (callCount !== executeCount){
	                            resultingFn = bindArgsArray(resultingFnUnbound, nextArgs[executeCount].args).bind(nextArgs[executeCount].scope)
	                            delete nextArgs[executeCount]

	                            increaseCounter = false
	                            resultingFn.apply(self)
	                            increaseCounter = true
	                        } else {
	                            nextArgs = {}
	                        }
	                    }, delay)
	                }

	            }

	            return resultingFn
	        },

	        /*
	         * @param {Array} args the array for which to create a cache key
	         * @param {Number} [cacheParamNumber] the number of args to use for the cache key. Use this to limit the args that area actually used for the cache key
	         */
	        getCacheKey = function(args, cacheParamNumber){
	            if (cacheParamNumber == null){
	                cacheParamNumber = -1
	            }

	            var i        = 0,
	                len      = Math.min(args.length, cacheParamNumber),
	                cacheKey = [],
	                it

	            for ( ; i < len; i++){
	                it = args[i]

	                if (root.check.isPlainObject(it) || Array.isArray(it)){
	                    cacheKey.push(JSON.stringify(it))
	                } else {
	                    cacheKey.push(String(it))
	                }
	            }

	            return cacheKey.join(', ')
	        },

	        /*
	         * @param {Function} fn - the function to cache results for
	         * @param {Number} skipCacheParamNumber - the index of the boolean parameter that makes this function skip the caching and
	         * actually return computed results.
	         * @param {Function|String} cacheBucketMethod - a function or the name of a method on this object which makes caching distributed across multiple buckets.
	         * If given, cached results will be searched into the cache corresponding to this bucket. If no result found, return computed result.
	         *
	         * For example this param is very useful when a function from a prototype is cached,
	         * but we want to return the same cached results only for one object that inherits that proto, not for all objects. Thus, for example for Wes.Element,
	         * we use the 'getId' cacheBucketMethod to indicate cached results for one object only.
	         * @param {Function} [cacheKeyBuilder] A function to be used to compose the cache key
	         *
	         * @return {Function} a new function, which returns results from cache, if they are available, otherwise uses the given fn to compute the results.
	         * This returned function has a 'clearCache' function attached, which clears the caching. If a parameter ( a bucket id) is  provided,
	         * only clears the cache in the specified cache bucket.
	         */
	        cache = function(fn, config){
	            config = config || {}

	            var bucketCache = {},
	                cache       = {},
	                skipCacheParamNumber = config.skipCacheIndex,
	                cacheBucketMethod    = config.cacheBucket,
	                cacheKeyBuilder      = config.cacheKey,
	                cacheArgsLength      = skipCacheParamNumber == null?
	                                            fn.length:
	                                            skipCacheParamNumber,
	                cachingFn

	            cachingFn = function(){
	                var result,
	                    skipCache = skipCacheParamNumber != null?
	                                                arguments[skipCacheParamNumber] === true:
	                                                false,
	                    args = skipCache?
	                                    SLICE.call(arguments, 0, cacheArgsLength):
	                                    SLICE.call(arguments),

	                    cacheBucketId = cacheBucketMethod != null?
	                                        typeof cacheBucketMethod == 'function'?
	                                            cacheBucketMethod():
	                                            typeof this[cacheBucketMethod] == 'function'?
	                                                this[cacheBucketMethod]():
	                                                null
	                                        :
	                                        null,


	                    cacheObject = cacheBucketId?
	                                        bucketCache[cacheBucketId]:
	                                        cache,

	                    cacheKey = (cacheKeyBuilder || getCacheKey)(args, cacheArgsLength)

	                if (cacheBucketId && !cacheObject){
	                    cacheObject = bucketCache[cacheBucketId] = {}
	                }

	                if (skipCache || cacheObject[cacheKey] == null){
	                    cacheObject[cacheKey] = result = fn.apply(this, args)
	                } else {
	                    result = cacheObject[cacheKey]
	                }

	                return result
	            }

	            /*
	             * @param {String|Object|Number} [bucketId] the bucket for which to clear the cache. If none given, clears all the cache for this function.
	             */
	            cachingFn.clearCache = function(bucketId){
	                if (bucketId){
	                    delete bucketCache[String(bucketId)]
	                } else {
	                    cache = {}
	                    bucketCache = {}
	                }
	            }

	            /*
	             *
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getCache = function(cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.getBucketCache(null, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket from which to retrieve the cached value
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.getBucketCache = function(bucketId, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId);

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {}
	                }

	                return cacheObject[cacheKey]
	            }

	            /*
	             *
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setCache = function(value, cacheArgs, cacheParamNumber, cacheKeyBuilder){
	                return cachingFn.setBucketCache(null, value, cacheArgs, cacheParamNumber, cacheKeyBuilder)
	            }

	            /*
	             *
	             * @param {String} bucketId The id of the cache bucket for which to set the cache value
	             * @param {Object} value The value to set in the cache
	             * @param {Array} cacheArgs The array of objects from which to create the cache key
	             * @param {Number} [cacheParamNumber] A limit for the cache args that are actually used to compute the cache key.
	             * @param {Function} [cacheKeyBuilder] The function to be used to compute the cache key from the given cacheArgs and cacheParamNumber
	             */
	            cachingFn.setBucketCache = function(bucketId, value, cacheArgs, cacheParamNumber, cacheKeyBuilder){

	                var cacheObject = cache,
	                    cacheKey = (cacheKeyBuilder || getCacheKey)(cacheArgs, cacheParamNumber)

	                if (bucketId){
	                    bucketId = String(bucketId)

	                    cacheObject = bucketCache[bucketId] = bucketCache[bucketId] || {};
	                }

	                return cacheObject[cacheKey] = value
	            }

	            return cachingFn
	        }

	module.exports = {

	    map: __webpack_require__(128),

	    dot: __webpack_require__(129),

	    maxArgs: __webpack_require__(130),

	    /**
	     * @method compose
	     *
	     * Example:
	     *
	     *      zippy.Function.compose(c, b, a)
	     *
	     * See {@link Function#compose}
	     */
	    compose: compose,

	    /**
	     * See {@link Function#self}
	     */
	    self: function(fn){
	        return fn
	    },

	    /**
	     * See {@link Function#buffer}
	     */
	    buffer: buffer,

	    /**
	     * See {@link Function#delay}
	     */
	    delay: delay,

	    /**
	     * See {@link Function#defer}
	     * @param {Function} fn
	     * @param {Object} scope
	     */
	    defer:defer,

	    /**
	     * See {@link Function#skipArgs}
	     * @param {Function} fn
	     * @param {Number} [count=0] how many args to skip when calling the resulting function
	     * @return {Function} The function that will call the original fn without the first count args.
	     */
	    skipArgs: skipArgs,

	    /**
	     * See {@link Function#intercept}
	     */
	    intercept: function(fn, interceptedFn, withStopArgs){
	        return intercept(interceptedFn, fn, withStopArgs)
	    },

	    /**
	     * See {@link Function#throttle}
	     */
	    throttle: throttle,

	    /**
	     * See {@link Function#spread}
	     */
	    spread: spread,

	    /**
	     * See {@link Function#chain}
	     */
	    chain: function(fn, where, mainFn){
	        return chain(where, mainFn, fn)
	    },

	    /**
	     * See {@link Function#before}
	     */
	    before: function(fn, otherFn){
	        return chain('before', otherFn, fn)
	    },

	    /**
	     * See {@link Function#after}
	     */
	    after: function(fn, otherFn){
	        return chain('after', otherFn, fn)
	    },

	    /**
	     * See {@link Function#curry}
	     */
	    curry: curry,

	    /**
	     * See {@link Function#once}
	     */
	    once: once,

	    /**
	     * See {@link Function#bindArgs}
	     */
	    bindArgs: bindArgs,

	    /**
	     * See {@link Function#bindArgsArray}
	     */
	    bindArgsArray: bindArgsArray,

	    /**
	     * See {@link Function#lockArgs}
	     */
	    lockArgs: lockArgs,

	    /**
	     * See {@link Function#lockArgsArray}
	     */
	    lockArgsArray: lockArgsArray,

	    bindFunctionsOf: bindFunctionsOf,

	    find: find,

	    findIndex: findIndex,

	    newify: __webpack_require__(131)
	}

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS)
				return 62 // '+'
			if (code === SLASH)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}(false ? (this.base64js = {}) : exports))


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function composeTwo(f, g) {
	    return function () {
	        return f(g.apply(this, arguments))
	    }
	}

	/*
	 * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	 *
	 * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	 *
	 * @return the result of the first function in the enumeration
	 */
	module.exports = function(){

	    var args = arguments
	    var len  = args.length
	    var i    = 0
	    var f    = args[0]

	    while (++i < len) {
	        f = composeTwo(f, args[i])
	    }

	    return f
	}

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function chain(where, fn, secondFn){

	    return function(){
	        if (where === 'before'){
	            secondFn.apply(this, arguments)
	        }

	        var result = fn.apply(this, arguments)

	        if (where !== 'before'){
	            secondFn.apply(this, arguments)
	        }

	        return result
	    }
	}

	module.exports = chain

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use once'

	function once(fn, scope){

	    var called
	    var result

	    return function(){
	        if (called){
	            return result
	        }

	        called = true

	        return result = fn.apply(scope || this, arguments)
	    }
	}

	module.exports = once

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){
	    return function(){
	        var thisArgs = SLICE.call(args || [])

	        if (arguments.length){
	            thisArgs.push.apply(thisArgs, arguments)
	        }

	        return fn.apply(this, thisArgs)
	    }
	}

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var bindArgsArray = __webpack_require__(108)

	module.exports = function(fn){
	    return bindArgsArray(fn, SLICE.call(arguments,1))
	}

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){

	    return function(){
	        if (!Array.isArray(args)){
	            args = SLICE.call(args || [])
	        }

	        return fn.apply(this, args)
	    }
	}

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var lockArgsArray = __webpack_require__(110)

	module.exports = function(fn){
	    return lockArgsArray(fn, SLICE.call(arguments, 1))
	}

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(104)

	module.exports = curry(function(fn, value){
	    return value != undefined && typeof value.map?
	            value.map(fn):
	            fn(value)
	})

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(104)

	module.exports = curry(function(prop, value){
	    return value != undefined? value[prop]: undefined
	})

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var curry = __webpack_require__(104)

	module.exports = function(fn, count){
	    return function(){
	        return fn.apply(this, SLICE.call(arguments, 0, count))
	    }
	}

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var newify = __webpack_require__(132)
	var curry  = __webpack_require__(104)

	module.exports = curry(newify)

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(133)

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var Region = __webpack_require__(116)

	/**
	 *
	 * This method is trying to align the sourceRegion to the targetRegion, given the alignment positions
	 * and the offsets. It only modifies the sourceRegion
	 *
	 * This is all well and easy, but if there is a constrainTo region, the algorithm has to take it into account.
	 * In this case, it works as follows.
	 *
	 *  * start with the first alignment position. Aligns the region, adds the offset and then check for the constraint.
	 *  * if the constraint condition is ok, return the position.
	 *  * otherwise, remember the intersection area, if the regions are intersecting.
	 *  * then go to the next specified align position, and so on, computing the maximum intersection area.
	 *
	 * If no alignment fits the constrainRegion, the sourceRegion will be resized to match it,
	 * using the position with the maximum intersection area.
	 *
	 * Since we have computed the index of the position with the max intersection area, take that position,
	 * and align the sourceRegion accordingly. Then resize the sourceRegion to the intersection, and reposition
	 * it again, since resizing it might have destroyed the alignment.
	 *
	 * Return the position.
	 *
	 * @param {Region} sourceRegion
	 * @param {Region} targetRegion
	 * @param {String[]} positions
	 * @param {Object} config
	 * @param {Array} config.offset
	 * @param {Region} config.constrain
	 * @param {Boolean/Object} config.sync
	 *
	 * @return {String/Undefined} the chosen position for the alignment, or undefined if no position found
	 */
	function ALIGN_TO_NORMALIZED(sourceRegion, targetRegion, positions, config){

	    targetRegion = Region.from(targetRegion)

	    config = config  || {}

	    var constrainTo = config.constrain,
	        syncOption  = config.sync,
	        offsets     = config.offset || [],
	        syncWidth   = false,
	        syncHeight  = false,
	        sourceClone = sourceRegion.clone()

	    /*
	     * Prepare the method arguments: positions, offsets, constrain and sync options
	     */
	    if (!Array.isArray(positions)){
	        positions = positions? [positions]: []
	    }

	    if (!Array.isArray(offsets)){
	        offsets = offsets? [offsets]: []
	    }

	    if (constrainTo){
	        constrainTo = constrainTo === true?
	                                Region.getDocRegion():
	                                constrainTo.getRegion()
	    }

	    if (syncOption){

	        if (syncOption.size){
	            syncWidth  = true
	            syncHeight = true
	        } else {
	            syncWidth  = syncOption === true?
	                            true:
	                            syncOption.width || false

	            syncHeight = syncOption === true?
	                            true:
	                            syncOption.height || false
	        }
	    }

	    if (syncWidth){
	        sourceClone.setWidth(targetRegion.getWidth())
	    }
	    if (syncHeight){
	        sourceClone.setHeight(targetRegion.getHeight())

	    }

	    var offset,
	        i = 0,
	        len = positions.length,
	        pos,
	        intersection,
	        itArea,
	        maxArea = -1,
	        maxAreaIndex = -1

	    for (; i < len; i++){
	        pos     = positions[i]
	        offset  = offsets[i]

	        sourceClone.alignToRegion(targetRegion, pos)

	        if (offset){
	            if (!Array.isArray(offset)){
	                offset = offsets[i] = [offset.x || offset.left, offset.y || offset.top]
	            }

	            sourceClone.shift({
	                left: offset[0],
	                top : offset[1]
	            })
	        }

	        //the source region is already aligned in the correct position

	        if (constrainTo){
	            //if we have a constrain region, test for the constrain
	            intersection = sourceClone.getIntersection(constrainTo)

	            if ( intersection && intersection.equals(sourceClone) ) {
	                //constrain respected, so return (the aligned position)

	                sourceRegion.set(sourceClone)
	                return pos
	            } else {

	                //the constrain was not respected, so continue trying
	                if (intersection && ((itArea = intersection.getArea()) > maxArea)){
	                    maxArea      = itArea
	                    maxAreaIndex = i
	                }
	            }

	        } else {
	            sourceRegion.set(sourceClone)
	            return pos
	        }
	    }

	    //no alignment respected the constraints
	    if (~maxAreaIndex){
	        pos     = positions[maxAreaIndex]
	        offset  = offsets[maxAreaIndex]

	        sourceClone.alignToRegion(targetRegion, pos)

	        if (offset){
	            sourceClone.shift({
	                left: offset[0],
	                top : offset[1]
	            })
	        }

	        //we are sure an intersection exists, because of the way the maxAreaIndex was computed
	        intersection = sourceClone.getIntersection(constrainTo)

	        sourceClone.setRegion(intersection)
	        sourceClone.alignToRegion(targetRegion, pos)

	        if (offset){
	            sourceClone.shift({
	                left: offset[0],
	                top : offset[1]
	            })
	        }

	        sourceRegion.set(sourceClone)

	        return pos
	    }

	}

	module.exports = ALIGN_TO_NORMALIZED

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(134)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	    'numeric'  : __webpack_require__(135),
	    'number'   : __webpack_require__(136),
	    'int'      : __webpack_require__(137),
	    'float'    : __webpack_require__(138),
	    'string'   : __webpack_require__(139),
	    'function' : __webpack_require__(140),
	    'object'   : __webpack_require__(141),
	    'arguments': __webpack_require__(142),
	    'boolean'  : __webpack_require__(143),
	    'date'     : __webpack_require__(144),
	    'regexp'   : __webpack_require__(145),
	    'array'    : __webpack_require__(146)
	}

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function composeTwo(f, g) {
	    return function () {
	        return f(g.apply(this, arguments))
	    }
	}

	/*
	 * @param {Function...} an enumeration of functions, each consuming the result of the following function.
	 *
	 * For example: compose(c, b, a)(1,4) == c(b(a(1,4)))
	 *
	 * @return the result of the first function in the enumeration
	 */
	module.exports = function(){

	    var args = arguments
	    var len  = args.length
	    var i    = 0
	    var f    = args[0]

	    while (++i < len) {
	        f = composeTwo(f, args[i])
	    }

	    return f
	}

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	function chain(where, fn, secondFn){

	    return function(){
	        if (where === 'before'){
	            secondFn.apply(this, arguments)
	        }

	        var result = fn.apply(this, arguments)

	        if (where !== 'before'){
	            secondFn.apply(this, arguments)
	        }

	        return result
	    }
	}

	module.exports = chain

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use once'

	function once(fn, scope){

	    var called
	    var result

	    return function(){
	        if (called){
	            return result
	        }

	        called = true

	        return result = fn.apply(scope || this, arguments)
	    }
	}

	module.exports = once

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){
	    return function(){
	        var thisArgs = SLICE.call(args || [])

	        if (arguments.length){
	            thisArgs.push.apply(thisArgs, arguments)
	        }

	        return fn.apply(this, thisArgs)
	    }
	}

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var bindArgsArray = __webpack_require__(124)

	module.exports = function(fn){
	    return bindArgsArray(fn, SLICE.call(arguments,1))
	}

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice

	module.exports = function(fn, args){

	    return function(){
	        if (!Array.isArray(args)){
	            args = SLICE.call(args || [])
	        }

	        return fn.apply(this, args)
	    }
	}

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var lockArgsArray = __webpack_require__(126)

	module.exports = function(fn){
	    return lockArgsArray(fn, SLICE.call(arguments, 1))
	}

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(120)

	module.exports = curry(function(fn, value){
	    return value != undefined && typeof value.map?
	            value.map(fn):
	            fn(value)
	})

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry = __webpack_require__(120)

	module.exports = curry(function(prop, value){
	    return value != undefined? value[prop]: undefined
	})

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var SLICE = Array.prototype.slice
	var curry = __webpack_require__(120)

	module.exports = function(fn, count){
	    return function(){
	        return fn.apply(this, SLICE.call(arguments, 0, count))
	    }
	}

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var newify = __webpack_require__(151)
	var curry  = __webpack_require__(120)

	module.exports = curry(newify)

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(147)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn    = __webpack_require__(153)
	var newify    = __webpack_require__(152)
	var copyUtils = __webpack_require__(51)
	var copyList  = copyUtils.copyList
	var copy      = copyUtils.copy
	var isObject  = __webpack_require__(154).object
	var EventEmitter = __webpack_require__(53).EventEmitter
	var inherits = __webpack_require__(148)
	var VALIDATE = __webpack_require__(149)

	/**
	 * @class Region
	 *
	 * The Region is an abstraction that allows the developer to refer to rectangles on the screen,
	 * and move them around, make diffs and unions, detect intersections, compute areas, etc.
	 *
	 * ## Creating a region
	 *      var region = require('region')({
	 *          top  : 10,
	 *          left : 10,
	 *          bottom: 100,
	 *          right : 100
	 *      })
	 *      //this region is a square, 90x90, starting from (10,10) to (100,100)
	 *
	 *      var second = require('region')({ top: 10, left: 100, right: 200, bottom: 60})
	 *      var union  = region.getUnion(second)
	 *
	 *      //the "union" region is a union between "region" and "second"
	 */

	var POINT_POSITIONS = {
	        cy: 'YCenter',
	        cx: 'XCenter',
	        t : 'Top',
	        tc: 'TopCenter',
	        tl: 'TopLeft',
	        tr: 'TopRight',
	        b : 'Bottom',
	        bc: 'BottomCenter',
	        bl: 'BottomLeft',
	        br: 'BottomRight',
	        l : 'Left',
	        lc: 'LeftCenter',
	        r : 'Right',
	        rc: 'RightCenter',
	        c : 'Center'
	    }

	/**
	 * @constructor
	 *
	 * Construct a new Region.
	 *
	 * Example:
	 *
	 *      var r = new Region({ top: 10, left: 20, bottom: 100, right: 200 })
	 *
	 *      //or, the same, but with numbers (can be used with new or without)
	 *
	 *      r = Region(10, 200, 100, 20)
	 *
	 *      //or, with width and height
	 *
	 *      r = Region({ top: 10, left: 20, width: 180, height: 90})
	 *
	 * @param {Number|Object} top The top pixel position, or an object with top, left, bottom, right properties. If an object is passed,
	 * instead of having bottom and right, it can have width and height.
	 *
	 * @param {Number} right The right pixel position
	 * @param {Number} bottom The bottom pixel position
	 * @param {Number} left The left pixel position
	 *
	 * @return {Region} this
	 */
	var REGION = function(top, right, bottom, left){

	    if (!(this instanceof REGION)){
	        return newify(REGION, arguments)
	    }

	    EventEmitter.call(this)

	    if (isObject(top)){
	        copyList(top, this, ['top','right','bottom','left'])

	        if (top.bottom == null && top.height != null){
	            this.bottom = this.top + top.height
	        }
	        if (top.right == null && top.width != null){
	            this.right = this.left + top.width
	        }

	        if (top.emitChangeEvents){
	            this.emitChangeEvents = top.emitChangeEvents
	        }
	    } else {
	        this.top    = top
	        this.right  = right
	        this.bottom = bottom
	        this.left   = left
	    }

	    this[0] = this.left
	    this[1] = this.top

	    VALIDATE(this)
	}

	inherits(REGION, EventEmitter)

	copy({

	    /**
	     * @cfg {Boolean} emitChangeEvents If this is set to true, the region
	     * will emit 'changesize' and 'changeposition' whenever the size or the position changs
	     */
	    emitChangeEvents: false,

	    /**
	     * Returns this region, or a clone of this region
	     * @param  {Boolean} [clone] If true, this method will return a clone of this region
	     * @return {Region}       This region, or a clone of this
	     */
	    getRegion: function(clone){
	        return clone?
	                    this.clone():
	                    this
	    },

	    /**
	     * Sets the properties of this region to those of the given region
	     * @param {Region/Object} reg The region or object to use for setting properties of this region
	     * @return {Region} this
	     */
	    setRegion: function(reg){

	        if (reg instanceof REGION){
	            this.set(reg.get())
	        } else {
	            this.set(reg)
	        }

	        return this
	    },

	    /**
	     * Returns true if this region is valid, false otherwise
	     *
	     * @param  {Region} region The region to check
	     * @return {Boolean}        True, if the region is valid, false otherwise.
	     * A region is valid if
	     *  * left <= right  &&
	     *  * top  <= bottom
	     */
	    validate: function(){
	        return REGION.validate(this)
	    },

	    _before: function(){
	        if (this.emitChangeEvents){
	            return copyList(this, {}, ['left','top','bottom','right'])
	        }
	    },

	    _after: function(before){
	        if (this.emitChangeEvents){

	            if(this.top != before.top || this.left != before.left) {
	                this.emitPositionChange()
	            }

	            if(this.right != before.right || this.bottom != before.bottom) {
	                this.emitSizeChange()
	            }
	        }
	    },

	    notifyPositionChange: function(){
	        this.emit('changeposition', this)
	    },

	    emitPositionChange: function(){
	        this.notifyPositionChange()
	    },

	    notifySizeChange: function(){
	        this.emit('changesize', this)
	    },

	    emitSizeChange: function(){
	        this.notifySizeChange()
	    },

	    /**
	     * Add the given amounts to each specified side. Example
	     *
	     *      region.add({
	     *          top: 50,    //add 50 px to the top side
	     *          bottom: -100    //substract 100 px from the bottom side
	     *      })
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    add: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            this[direction] += directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * The same as {@link #add}, but substracts the given values
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    substract: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if (hasOwn(directions, direction) ) {
	            this[direction] -= directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the size of the region.
	     * @return {Object} An object with {width, height}, corresponding to the width and height of the region
	     */
	    getSize: function(){
	        return {
	            width  : this.getWidth(),
	            height : this.getHeight()
	        }
	    },

	    /**
	     * Move the region to the given position and keeps the region width and height.
	     *
	     * @param {Object} position An object with {top, left} properties. The values in {top,left} are used to move the region by the given amounts.
	     * @param {Number} [position.left]
	     * @param {Number} [position.top]
	     *
	     * @return {Region} this
	     */
	    setPosition: function(position){
	        var width  = this.getWidth(),
	            height = this.getHeight()

	        if (position.left){
	            position.right  = position.left + width
	        }

	        if (position.top){
	            position.bottom = position.top  + height
	        }

	        return this.set(position)
	    },

	    /**
	     * Sets both the height and the width of this region to the given size.
	     *
	     * @param {Number} size The new size for the region
	     * @return {Region} this
	     */
	    setSize: function(size){
	        if (size.height && size.width){
	            return this.set({
	                right  : this.left + size.width,
	                bottom : this.top + size.height
	            })
	        }

	        if (size.width){
	            this.setWidth(size.width)
	        }

	        if (size.height){
	            this.setHeight(size.height)
	        }

	        return this
	    },



	    /**
	     * @chainable
	     *
	     * Sets the width of this region
	     * @param {Number} width The new width for this region
	     * @return {Region} this
	     */
	    setWidth: function(width){
	        return this.set({
	            right: this.left + width
	        })
	    },

	    /**
	     * @chainable
	     *
	     * Sets the height of this region
	     * @param {Number} height The new height for this region
	     * @return {Region} this
	     */
	    setHeight: function(height){
	        return this.set({
	            bottom: this.top + height
	        })
	    },

	    /**
	     * Sets the given properties on this region
	     *
	     * @param {Object} directions an object containing top, left, and EITHER bottom, right OR width, height
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @param {Number} [directions.width]
	     * @param {Number} [directions.height]
	     *
	     *
	     * @return {Region} this
	     */
	    set: function(directions){
	        var before = this._before()

	        copyList(directions, this, ['left','top','bottom','right'])

	        if (directions.bottom == null && directions.height != null){
	            this.bottom = this.top + directions.height
	        }
	        if (directions.right == null && directions.width != null){
	            this.right = this.left + directions.width
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the given property from this region. If no property is given, return an object
	     * with {left, top, right, bottom}
	     *
	     * @param {String} [dir] the property to retrieve from this region
	     * @return {Number/Object}
	     */
	    get: function(dir){
	        return dir? this[dir]:
	                    copyList(this, {}, ['left','right','top','bottom'])
	    },

	    /**
	     * Shifts this region to either top, or left or both.
	     * Shift is similar to {@link #add} by the fact that it adds the given dimensions to top/left sides, but also adds the given dimensions
	     * to bottom and right
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    shift: function(directions){

	        var before = this._before()

	        if (directions.top){
	            this.top    += directions.top
	            this.bottom += directions.top
	        }

	        if (directions.left){
	            this.left  += directions.left
	            this.right += directions.left
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Same as {@link #shift}, but substracts the given values
	     * @chainable
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    unshift: function(directions){

	        if (directions.top){
	            directions.top *= -1
	        }

	        if (directions.left){
	            directions.left *= -1
	        }

	        return this.shift(directions)
	    },

	    /**
	     * Compare this region and the given region. Return true if they have all the same size and position
	     * @param  {Region} region The region to compare with
	     * @return {Boolean}       True if this and region have same size and position
	     */
	    equals: function(region){
	        return this.equalsPosition(region) && this.equalsSize(region)
	    },

	    /**
	     * Returns true if this region has the same bottom,right properties as the given region
	     * @param  {Region/Object} size The region to compare against
	     * @return {Boolean}       true if this region is the same size as the given size
	     */
	    equalsSize: function(size){
	        var isInstance = size instanceof REGION

	        var s = {
	            width: size.width == null && isInstance?
	                    size.getWidth():
	                    size.width,

	            height: size.height == null && isInstance?
	                    size.getHeight():
	                    size.height
	        }
	        return this.getWidth() == s.width && this.getHeight() == s.height
	    },

	    /**
	     * Returns true if this region has the same top,left properties as the given region
	     * @param  {Region} region The region to compare against
	     * @return {Boolean}       true if this.top == region.top and this.left == region.left
	     */
	    equalsPosition: function(region){
	        return this.top == region.top && this.left == region.left
	    },

	    /**
	     * Adds the given ammount to the left side of this region
	     * @param {Number} left The ammount to add
	     * @return {Region} this
	     */
	    addLeft: function(left){
	        var before = this._before()

	        this.left = this[0] = this.left + left

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the top side of this region
	     * @param {Number} top The ammount to add
	     * @return {Region} this
	     */
	    addTop: function(top){
	        var before = this._before()

	        this.top = this[1] = this.top + top

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the bottom side of this region
	     * @param {Number} bottom The ammount to add
	     * @return {Region} this
	     */
	    addBottom: function(bottom){
	        var before = this._before()

	        this.bottom += bottom

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the right side of this region
	     * @param {Number} right The ammount to add
	     * @return {Region} this
	     */
	    addRight: function(right){
	        var before = this._before()

	        this.right += right

	        this._after(before)

	        return this
	    },

	    /**
	     * Minimize the top side.
	     * @return {Region} this
	     */
	    minTop: function(){
	        return this.expand({top: 1})
	    },
	    /**
	     * Minimize the bottom side.
	     * @return {Region} this
	     */
	    maxBottom: function(){
	        return this.expand({bottom: 1})
	    },
	    /**
	     * Minimize the left side.
	     * @return {Region} this
	     */
	    minLeft: function(){
	        return this.expand({left: 1})
	    },
	    /**
	     * Maximize the right side.
	     * @return {Region} this
	     */
	    maxRight: function(){
	        return this.expand({right: 1})
	    },

	    /**
	     * Expands this region to the dimensions of the given region, or the document region, if no region is expanded.
	     * But only expand the given sides (any of the four can be expanded).
	     *
	     * @param {Object} directions
	     * @param {Boolean} [directions.top]
	     * @param {Boolean} [directions.bottom]
	     * @param {Boolean} [directions.left]
	     * @param {Boolean} [directions.right]
	     *
	     * @param {Region} [region] the region to expand to, defaults to the document region
	     * @return {Region} this region
	     */
	    expand: function(directions, region){
	        var docRegion = region || REGION.getDocRegion()
	        var list      = []
	        var direction
	        var before = this._before()

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            list.push(direction)
	        }

	        copyList(docRegion, this, list)

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Returns a clone of this region
	     * @return {Region} A new region, with the same position and dimension as this region
	     */
	    clone: function(){
	        return new REGION({
	                    top    : this.top,
	                    left   : this.left,
	                    right  : this.right,
	                    bottom : this.bottom
	                })
	    },

	    /**
	     * Returns true if this region contains the given point
	     * @param {Number/Object} x the x coordinate of the point
	     * @param {Number} [y] the y coordinate of the point
	     *
	     * @return {Boolean} true if this region constains the given point, false otherwise
	     */
	    containsPoint: function(x, y){
	        if (arguments.length == 1){
	            y = x.y
	            x = x.x
	        }

	        return this.left <= x  &&
	               x <= this.right &&
	               this.top <= y   &&
	               y <= this.bottom
	    },

	    /**
	     *
	     * @param region
	     *
	     * @return {Boolean} true if this region contains the given region, false otherwise
	     */
	    containsRegion: function(region){
	        return this.containsPoint(region.left, region.top)    &&
	               this.containsPoint(region.right, region.bottom)
	    },

	    /**
	     * Returns an object with the difference for {top, bottom} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {top,bottom}
	     */
	    diffHeight: function(region){
	        return this.diff(region, {top: true, bottom: true})
	    },

	    /**
	     * Returns an object with the difference for {left, right} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {left,right}
	     */
	    diffWidth: function(region){
	        return this.diff(region, {left: true, right: true})
	    },

	    /**
	     * Returns an object with the difference in sizes for the given directions, between this and region
	     *
	     * @param  {Region} region     The region to use for diff
	     * @param  {Object} directions An object with the directions to diff. Can have any of the following keys:
	     *  * left
	     *  * right
	     *  * top
	     *  * bottom
	     *
	     * @return {Object} and object with the same keys as the directions object, but the values being the
	     * differences between this region and the given region
	     */
	    diff: function(region, directions){
	        var result = {}
	        var dirName

	        for (dirName in directions) if ( hasOwn(directions, dirName) ) {
	            result[dirName] = this[dirName] - region[dirName]
	        }

	        return result
	    },

	    /**
	     * Returns the position, in {left,top} properties, of this region
	     *
	     * @return {Object} {left,top}
	     */
	    getPosition: function(){
	        return {
	            left: this.left,
	            top : this.top
	        }
	    },

	    /**
	     * Returns the point at the given position from this region.
	     *
	     * @param {String} position Any of:
	     *
	     *  * 'cx' - See {@link #getPointXCenter}
	     *  * 'cy' - See {@link #getPointYCenter}
	     *  * 'b'  - See {@link #getPointBottom}
	     *  * 'bc' - See {@link #getPointBottomCenter}
	     *  * 'l'  - See {@link #getPointLeft}
	     *  * 'lc' - See {@link #getPointLeftCenter}
	     *  * 't'  - See {@link #getPointTop}
	     *  * 'tc' - See {@link #getPointTopCenter}
	     *  * 'r'  - See {@link #getPointRight}
	     *  * 'rc' - See {@link #getPointRightCenter}
	     *  * 'c'  - See {@link #getPointCenter}
	     *  * 'tl' - See {@link #getPointTopLeft}
	     *  * 'bl' - See {@link #getPointBottomLeft}
	     *  * 'br' - See {@link #getPointBottomRight}
	     *  * 'tr' - See {@link #getPointTopRight}
	     *
	     * @param {Boolean} asLeftTop
	     *
	     * @return {Object} either an object with {x,y} or {left,top} if asLeftTop is true
	     */
	    getPoint: function(position, asLeftTop){

	        //<debug>
	        if (!POINT_POSITIONS[position]) {
	            console.warn('The position ', position, ' could not be found! Available options are tl, bl, tr, br, l, r, t, b.');
	        }
	        //</debug>

	        var method = 'getPoint' + POINT_POSITIONS[position],
	            result = this[method]()

	        if (asLeftTop){
	            return {
	                left : result.x,
	                top  : result.y
	            }
	        }

	        return result
	    },

	    /**
	     * Returns a point with x = null and y being the middle of the left region segment
	     * @return {Object} {x,y}
	     */
	    getPointYCenter: function(){
	        return { x: null, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x being the middle of the top region segment
	     * @return {Object} {x,y}
	     */
	    getPointXCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: null }
	    },

	    /**
	     * Returns a point with x = null and y the region top position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointTop: function(){
	        return { x: null, y: this.top }
	    },

	    /**
	     * Returns a point that is the middle point of the region top segment
	     * @return {Object} {x,y}
	     */
	    getPointTopCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top }
	    },

	    /**
	     * Returns a point that is the top-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopLeft: function(){
	        return { x: this.left, y: this.top}
	    },

	    /**
	     * Returns a point that is the top-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopRight: function(){
	        return { x: this.right, y: this.top}
	    },

	    /**
	     * Returns a point with x = null and y the region bottom position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointBottom: function(){
	        return { x: null, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the middle point of the region bottom segment
	     * @return {Object} {x,y}
	     */
	    getPointBottomCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the bottom-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomLeft: function(){
	        return { x: this.left, y: this.bottom}
	    },

	    /**
	     * Returns a point that is the bottom-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomRight: function(){
	        return { x: this.right, y: this.bottom}
	    },

	    /**
	     * Returns a point with y = null and x the region left position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointLeft: function(){
	        return { x: this.left, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region left segment
	     * @return {Object} {x,y}
	     */
	    getPointLeftCenter: function(){
	        return { x: this.left, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x the region right position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointRight: function(){
	        return { x: this.right, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region right segment
	     * @return {Object} {x,y}
	     */
	    getPointRightCenter: function(){
	        return { x: this.right, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point that is the center of the region
	     * @return {Object} {x,y}
	     */
	    getPointCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * @return {Number} returns the height of the region
	     */
	    getHeight: function(){
	        return this.bottom - this.top
	    },

	    /**
	     * @return {Number} returns the width of the region
	     */
	    getWidth: function(){
	        return this.right - this.left
	    },

	    /**
	     * @return {Number} returns the top property of the region
	     */
	    getTop: function(){
	        return this.top
	    },

	    /**
	     * @return {Number} returns the left property of the region
	     */
	    getLeft: function(){
	        return this.left
	    },

	    /**
	     * @return {Number} returns the bottom property of the region
	     */
	    getBottom: function(){
	        return this.bottom
	    },

	    /**
	     * @return {Number} returns the right property of the region
	     */
	    getRight: function(){
	        return this.right
	    },

	    /**
	     * Returns the area of the region
	     * @return {Number} the computed area
	     */
	    getArea: function(){
	        return this.getWidth() * this.getHeight()
	    },

	    constrainTo: function(contrain){
	        var intersect = this.getIntersection(contrain)
	        var shift

	        if (!intersect || !intersect.equals(this)){

	            var contrainWidth  = contrain.getWidth(),
	                contrainHeight = contrain.getHeight()

	            if (this.getWidth() > contrainWidth){
	                this.left = contrain.left
	                this.setWidth(contrainWidth)
	            }

	            if (this.getHeight() > contrainHeight){
	                this.top = contrain.top
	                this.setHeight(contrainHeight)
	            }

	            shift = {}

	            if (this.right > contrain.right){
	                shift.left = contrain.right - this.right
	            }

	            if (this.bottom > contrain.bottom){
	                shift.top = contrain.bottom - this.bottom
	            }

	            if (this.left < contrain.left){
	                shift.left = contrain.left - this.left
	            }

	            if (this.top < contrain.top){
	                shift.top = contrain.top - this.top
	            }

	            this.shift(shift)

	            return true
	        }

	        return false
	    },

	    __IS_REGION: true

	    /**
	     * @property {Number} top
	     */

	    /**
	     * @property {Number} right
	     */

	    /**
	     * @property {Number} bottom
	     */

	    /**
	     * @property {Number} left
	     */

	    /**
	     * @property {Number} [0] the top property
	     */

	    /**
	     * @property {Number} [1] the left property
	     */

	    /**
	     * @method getIntersection
	     * Returns a region that is the intersection of this region and the given region
	     * @param  {Region} region The region to intersect with
	     * @return {Region}        The intersection region
	     */

	    /**
	     * @method getUnion
	     * Returns a region that is the union of this region with the given region
	     * @param  {Region} region  The region to make union with
	     * @return {Region}        The union region. The smallest region that contains both this and the given region.
	     */

	}, REGION.prototype)

	Object.defineProperties(REGION.prototype, {
	    width: {
	        get: function(){
	            return this.getWidth()
	        },
	        set: function(width){
	            return this.setWidth(width)
	        }
	    },
	    height: {
	        get: function(){
	            return this.getHeight()
	        },
	        set: function(height){
	            return this.setHeight(height)
	        }
	    }
	})

	__webpack_require__(150)(REGION)

	module.exports = REGION

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return !isNaN( parseFloat( value ) ) && isFinite( value )
	}

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value === 'number' && isFinite(value)
	}

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(136)

	module.exports = function(value){
	    return number(value) && (value === parseInt(value, 10))
	}

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(136)

	module.exports = function(value){
	    return number(value) && (value === parseFloat(value, 10)) && !(value === parseInt(value, 10))
	}

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'string'
	}

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Function]'
	}

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Object]'
	}

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Arguments]' || !!value.callee
	}

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'boolean'
	}

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Date]'
	}

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object RegExp]'
	}

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return Array.isArray(value)
	}

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	            value       : ctor,
	            enumerable  : false,
	            writable    : true,
	            configurable: true
	        }
	    })
	}

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @static
	 * Returns true if the given region is valid, false otherwise.
	 * @param  {Region} region The region to check
	 * @return {Boolean}        True, if the region is valid, false otherwise.
	 * A region is valid if
	 *  * left <= right  &&
	 *  * top  <= bottom
	 */
	module.exports = function validate(region){

	    var isValid = true

	    if (region.right < region.left){
	        isValid = false
	        region.right = region.left
	    }

	    if (region.bottom < region.top){
	        isValid = false
	        region.bottom = region.top
	    }

	    return isValid
	}

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn   = __webpack_require__(153)
	var VALIDATE = __webpack_require__(149)

	module.exports = function(REGION){

	    var MAX = Math.max
	    var MIN = Math.min

	    var statics = {
	        init: function(){
	            var exportAsNonStatic = {
	                getIntersection      : true,
	                getIntersectionArea  : true,
	                getIntersectionHeight: true,
	                getIntersectionWidth : true,
	                getUnion             : true
	            }
	            var thisProto = REGION.prototype
	            var newName

	            var exportHasOwn = hasOwn(exportAsNonStatic)
	            var methodName

	            for (methodName in exportAsNonStatic) if (exportHasOwn(methodName)) {
	                newName = exportAsNonStatic[methodName]
	                if (typeof newName != 'string'){
	                    newName = methodName
	                }

	                ;(function(proto, methodName, protoMethodName){

	                    proto[methodName] = function(region){
	                        //<debug>
	                        if (!REGION[protoMethodName]){
	                            console.warn('cannot find method ', protoMethodName,' on ', REGION)
	                        }
	                        //</debug>
	                        return REGION[protoMethodName](this, region)
	                    }

	                })(thisProto, newName, methodName);
	            }
	        },

	        validate: VALIDATE,

	        /**
	         * Returns the region corresponding to the documentElement
	         * @return {Region} The region corresponding to the documentElement. This region is the maximum region visible on the screen.
	         */
	        getDocRegion: function(){
	            return REGION.fromDOM(document.documentElement)
	        },

	        from: function(reg){
	            if (reg.__IS_REGION){
	                return reg
	            }

	            if (typeof document){
	                if (typeof HTMLElement != 'undefined' && reg instanceof HTMLElement){
	                    return REGION.fromDOM(reg)
	                }

	                if (reg.type && typeof reg.pageX !== 'undefined' && typeof reg.pageY !== 'undefined'){
	                    return REGION.fromEvent(reg)
	                }
	            }

	            return REGION(reg)
	        },

	        fromEvent: function(event){
	            return REGION.fromPoint({
	                x: event.pageX,
	                y: event.pageY
	            })
	        },

	        fromDOM: function(dom){
	            var rect = dom.getBoundingClientRect()
	            // var docElem = document.documentElement
	            // var win     = window

	            // var top  = rect.top + win.pageYOffset - docElem.clientTop
	            // var left = rect.left + win.pageXOffset - docElem.clientLeft

	            return new REGION({
	                top   : rect.top,
	                left  : rect.left,
	                bottom: rect.bottom,
	                right : rect.right
	            })
	        },

	        /**
	         * @static
	         * Returns a region that is the intersection of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region/Boolean}        The intersection region or false if no intersection found
	         */
	        getIntersection: function(first, second){

	            var area = this.getIntersectionArea(first, second)

	            if (area){
	                return new REGION(area)
	            }

	            return false
	        },

	        getIntersectionWidth: function(first, second){
	            var minRight  = MIN(first.right, second.right)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (maxLeft < minRight){
	                return minRight  - maxLeft
	            }

	            return 0
	        },

	        getIntersectionHeight: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minBottom = MIN(first.bottom,second.bottom)

	            if (maxTop  < minBottom){
	                return minBottom - maxTop
	            }

	            return 0
	        },

	        getIntersectionArea: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minRight  = MIN(first.right, second.right)
	            var minBottom = MIN(first.bottom,second.bottom)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (
	                    maxTop  < minBottom &&
	                    maxLeft < minRight
	                ){
	                return {
	                    top    : maxTop,
	                    right  : minRight,
	                    bottom : minBottom,
	                    left   : maxLeft,

	                    width  : minRight  - maxLeft,
	                    height : minBottom - maxTop
	                }
	            }

	            return false
	        },

	        /**
	         * @static
	         * Returns a region that is the union of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region}        The union region. The smallest region that contains both given regions.
	         */
	        getUnion: function(first, second){
	            var top    = MIN(first.top,   second.top)
	            var right  = MAX(first.right, second.right)
	            var bottom = MAX(first.bottom,second.bottom)
	            var left   = MIN(first.left,  second.left)

	            return new REGION(top, right, bottom, left)
	        },

	        /**
	         * @static
	         * Returns a region. If the reg argument is a region, returns it, otherwise return a new region built from the reg object.
	         *
	         * @param  {Region} reg A region or an object with either top, left, bottom, right or
	         * with top, left, width, height
	         * @return {Region} A region
	         */
	        getRegion: function(reg){
	            return REGION.from(reg)
	        },

	        /**
	         * Creates a region that corresponds to a point.
	         *
	         * @param  {Object} xy The point
	         * @param  {Number} xy.x
	         * @param  {Number} xy.y
	         *
	         * @return {Region}    The new region, with top==xy.y, bottom = xy.y and left==xy.x, right==xy.x
	         */
	        fromPoint: function(xy){
	            return new REGION({
	                        top    : xy.y,
	                        bottom : xy.y,
	                        left   : xy.x,
	                        right  : xy.x
	                    })
	        }
	    }

	    Object.keys(statics).forEach(function(key){
	        REGION[key] = statics[key]
	    })

	    REGION.init()
	}

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(155)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(156)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var hasOwn = Object.prototype.hasOwnProperty

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}


	module.exports = curry(function(object, property){
	    return hasOwn.call(object, property)
	})

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(157)

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	    'numeric'  : __webpack_require__(158),
	    'number'   : __webpack_require__(159),
	    'int'      : __webpack_require__(160),
	    'float'    : __webpack_require__(161),
	    'string'   : __webpack_require__(162),
	    'function' : __webpack_require__(163),
	    'object'   : __webpack_require__(164),
	    'arguments': __webpack_require__(165),
	    'boolean'  : __webpack_require__(166),
	    'date'     : __webpack_require__(167),
	    'regexp'   : __webpack_require__(168),
	    'array'    : __webpack_require__(169)
	}

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return !isNaN( parseFloat( value ) ) && isFinite( value )
	}

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value === 'number' && isFinite(value)
	}

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(159)

	module.exports = function(value){
	    return number(value) && (value === parseInt(value, 10))
	}

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(159)

	module.exports = function(value){
	    return number(value) && (value === parseFloat(value, 10)) && !(value === parseInt(value, 10))
	}

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'string'
	}

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Function]'
	}

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Object]'
	}

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Arguments]' || !!value.callee
	}

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'boolean'
	}

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Date]'
	}

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object RegExp]'
	}

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return Array.isArray(value)
	}

/***/ }
/******/ ])
});
