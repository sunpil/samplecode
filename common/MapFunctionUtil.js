export const extractValue = (mapColumnData) => {
    if (typeof(mapColumnData) == 'object')
        return mapColumnData.value
    else
        return mapColumnData
}

export const extractKey = (mapColumnData) => {
    if (typeof(mapColumnData) == 'object')
        return mapColumnData.key || mapColumnData.id
    else
        return mapColumnData
}