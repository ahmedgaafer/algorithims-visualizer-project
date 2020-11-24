module.exports = function findItem(array, item){
    return [].concat.apply([], ([].concat.apply([], array))).indexOf(item)
}