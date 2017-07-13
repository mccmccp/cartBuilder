import React, { Component, PropTypes } from 'react';
import { withState } from 'recompose';
import { Col } from 'react-bootstrap';

class BoxLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alignment: props.column.alignment,
        };
        this.cancelEdit = this.cancelEdit.bind(this);
        this.changeAlignment = this.changeAlignment.bind(this);
        this.onSaveColumn = this.onSaveColumn.bind(this);
    }
    cancelEdit() {
        const { changeSingleEditMode, changeColumnEdit, isColumnEdit } = this.props;
        changeColumnEdit(!isColumnEdit);
        changeSingleEditMode();
    }
    changeAlignment(alignment) {
        this.setState({ alignment });
    }
    onSaveColumn() {
        const { cartId, layoutId, id, updateColumn, column } = this.props;
        const data = { alignment: this.state.alignment, order: column.order };
        updateColumn(cartId, layoutId, id, data);
        this.cancelEdit();
    }
    render() {
        const { isEdit, isSingleEdit, isColumnEdit, col, column } = this.props;
        const { alignment } = this.state;
        const isHorizontalLine = column.items && column.items.length > 0 ? column.items[0].component_type : null;
        const marginBottom = { marginBottom: !isEdit && !isSingleEdit ? 70 : 10 };
        return (
                isHorizontalLine ?
                    <Col md={col}>
                        <div className="horizontalLine" style={marginBottom} />
                    </Col>
                    : <Col md={col}>
                        <div className="optionsBox optionsBoxContent" />
                        {isEdit ?
                            null
                            : !isSingleEdit ?
                                <div className="editSave">
                                    <button onClick={this.cancelEdit} type="button" className="btn btn-default">Edit</button>
                                </div>
                                : !isColumnEdit ?
                                    null
                                    : <div className="editSave">
                                        <button onClick={this.onSaveColumn} type="button" className="btn btn-default">Save</button>
                                        <button onClick={this.cancelEdit} type="button" className="btn btn-default">Cancel</button>
                                        <button type="button" className="btn btn-default">Add</button>
                                        <div className="alignment">
                                            <span>Alignment: </span>
                                            <span>
                                            <input
                                                onChange={() => this.changeAlignment('left')}
                                                type="radio"
                                                checked={alignment === 'left'}
                                            />
                                            Left
                                        </span>
                                            <span>
                                            <input
                                                onChange={() => this.changeAlignment('center')}
                                                type="radio"
                                                checked={alignment === 'center'}
                                            />
                                            Center
                                        </span>
                                            <span>
                                            <input
                                                onChange={() => this.changeAlignment('right')}
                                                type="radio"
                                                checked={alignment === 'right'}
                                            />
                                            Right
                                        </span>
                                        </div>
                                    </div>
                        }
                    </Col>
        );
    }

}

BoxLayout.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    isSingleEdit: PropTypes.bool.isRequired,
    isColumnEdit: PropTypes.bool.isRequired,
    col: PropTypes.number.isRequired,
    cartId: PropTypes.number.isRequired,
    layoutId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    column: PropTypes.object.isRequired,
    changeSingleEditMode: PropTypes.func.isRequired,
    changeColumnEdit: PropTypes.func.isRequired,
    updateColumn: PropTypes.func.isRequired,
};

export default withState('isColumnEdit', 'changeColumnEdit', false)(BoxLayout);
