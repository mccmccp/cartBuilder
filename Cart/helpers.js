export const generateColumns = (number) => {
    const columns = [];
    for (let i = 0; i < number; i++) {
        columns.push({ id: i, items: [] });
    }
    return columns;
}
export const findNextOrder = (array) => {
    const ordersArray = array.map(item => item.order);
    let order = Math.max.apply(null, ordersArray) + 1;
    if (order < 0) { order = 0; }
    return order;
}
