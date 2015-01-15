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