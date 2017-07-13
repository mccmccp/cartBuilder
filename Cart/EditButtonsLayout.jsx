import React, { PropTypes } from 'react';

function EditButtonsLayout(props) {
    const { isEdit, isSingleEdit, changeEditMode, onDeleteCart, onSave, onCancel, addBoxes } = props;
    return (
        <div className="mainBox">
            {!isEdit ?
                !isSingleEdit ?
                    <div>
                        <button onClick={changeEditMode} type="button" className="btn btn-default">Edit</button>
                        <button onClick={onDeleteCart} type="button" className="btn btn-danger noBackground delete">Delete Cart</button>
                    </div>
                    : null
                : <div>
                    <button onClick={onSave} type="button" className="btn btn-default">Save</button>
                    <button onClick={onCancel} type="button" className="btn btn-default">Cancel</button>
                    <button onClick={() => addBoxes(1)} type="button" className="btn btn-default">Add Single Box</button>
                    <button onClick={() => addBoxes(2)} type="button" className="btn btn-default">Add Double Box</button>
                    <button onClick={() => addBoxes(3)} type="button" className="btn btn-default">Add Triple Box</button>
                    <button onClick={() => addBoxes(1, true)} type="button" className="btn btn-default">Add Horizontal Line</button>
                </div>
            }
        </div>
    );
}

EditButtonsLayout.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    isSingleEdit: PropTypes.bool.isRequired,
    changeEditMode: PropTypes.func.isRequired,
    onDeleteCart: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    addBoxes: PropTypes.func.isRequired,
};

export default EditButtonsLayout;
