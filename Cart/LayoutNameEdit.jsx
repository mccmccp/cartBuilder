import React, { PropTypes } from 'react';

function LayoutNameEdit(props) {
    const { name, changeName } = props;
    return (
        <div className="mainBox">
            <div className="form-group">
                <label htmlFor="cartName"> Cart Name:</label>
                <input onChange={changeName} className="form-control" value={name} placeholder="Cart Name" type="text" />
            </div>
        </div>
    );
}

LayoutNameEdit.propTypes = {
    name: PropTypes.string.isRequired,
    changeName: PropTypes.func.isRequired,
};

export default LayoutNameEdit;
