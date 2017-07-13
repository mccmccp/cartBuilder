import React, { PropTypes } from 'react';
import { compose } from 'recompose';
import { DragSource, DropTarget } from 'react-dnd';

const listSource = {
    beginDrag(props) {
        return { id: props.id };
    },
};

const listTarget = {
    drop(props, monitor) {
        const selected = monitor.getItem();
        if (selected.id === props.id) {
            return;
        }
        const newCartsLayout = props.changeOrders(selected.id, props.id);
        props.changeCartPosition(newCartsLayout);
    },
};

const collectSource = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});
const collectTarget = connect => ({ connectDropTarget: connect.dropTarget() });

function LineLayout(props) {
    const { isDragging, connectDragSource, connectDropTarget, onDelete, cartId, layoutId, isEdit, isSingleEdit, onDeleteWithoutEdit } = props;
    const opacity = isDragging ? 0.4 : 1;
    return (
        isEdit ? (connectDragSource(connectDropTarget(
            <div className="row draggable" style={{ opacity }}>
                {props.children}
                <div className="editSave col-md-12">
                    <button onClick={() => onDelete(layoutId)} type="button" className="btn btn-danger noBackground delete">Delete Row</button>
                </div>
            </div>,
            ),
        ))
        : <div className="row deleting-row-container">
            {props.children}
            {isSingleEdit ?
                null :
                <button
                    onClick={() => onDeleteWithoutEdit(cartId, layoutId, true)}
                    type="button"
                    className="btn btn-danger noBackground delete deleting-row"
                >
                    Delete Row
                </button>
            }
        </div>
    );
}

LineLayout.propTypes = {
    children: PropTypes.node.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    isSingleEdit: PropTypes.bool.isRequired,
    layoutId: PropTypes.number.isRequired,
    cartId: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDeleteWithoutEdit: PropTypes.func.isRequired,
};

export default compose(
    DragSource('line', listSource, collectSource),
    DropTarget('line', listTarget, collectTarget),
)(LineLayout);
