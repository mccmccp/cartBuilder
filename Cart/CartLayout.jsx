import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import ContentWrapper from '../../components/Layout/ContentWrapper';
import { cartAction } from '../../actions';
import { apiCart } from '../../api';
import LineLayout from './LineLayout';
import BoxLayout from './BoxLayout';
import LayoutNameEdit from './LayoutNameEdit';
import EditButtonsLayout from './EditButtonsLayout';
import { generateColumns, findNextOrder } from './helpers';

class CartLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.cartName,
        };
        this.changeName = this.changeName.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDeleteCart = this.onDeleteCart.bind(this);
        this.changeOrders = this.changeOrders.bind(this);
        this.addBoxes = this.addBoxes.bind(this);
        this.saveLayouts = this.saveLayouts.bind(this);
        this.updateIfOrderChanged = this.updateIfOrderChanged.bind(this);
        this.deleteLayouts = this.deleteLayouts.bind(this);
    }
    componentWillUnmount() {
        const { closeEditModes } = this.props;
        closeEditModes();
    }
    onSave() {
        const { cartId, cartName, updateCart, changeEditMode, changeCurrentCartName } = this.props;
        if (cartName !== this.state.name) {
            changeCurrentCartName(this.state.name);
            updateCart({ id: cartId, name: this.state.name });
        }
        this.saveLayouts();
        this.deleteLayouts();
        this.updateIfOrderChanged();
        changeEditMode();
    }
    onDeleteCart() {
        const { deleteCart, cartId, backToCartPage } = this.props;
        deleteCart(cartId);
        backToCartPage();
    }
    onCancel() {
        const { backToPreviousLayout } = this.props;
        backToPreviousLayout();
    }
    updateIfOrderChanged() {
        const { cartId, cartsLayout, cartsLayoutCopy, updateCartLayout } = this.props;
        cartsLayout.forEach((newLayout) => {
            cartsLayoutCopy.forEach((oldLayout) => {
                if (!newLayout.isNew && oldLayout.id === newLayout.id && oldLayout.order !== newLayout.order) { //
                    updateCartLayout(cartId, newLayout.id, { order: newLayout.order });
                }
            });
        });
    }
    saveLayouts() {
        const { cartId, saveCartLayout, cartsLayout, cartsLayoutCopy } = this.props;
        cartsLayout.forEach((newLayout) => {
            const isPreviousExist = cartsLayoutCopy.find(item => item.id === newLayout.id);
            if (!isPreviousExist) {
                saveCartLayout(
                    cartId,
                    newLayout,
                    { order: newLayout.order },
                    newLayout.isHorizontalLine,
                );
            }
        });
    }
    deleteLayouts() {
        const { cartId, cartsLayout, cartsLayoutCopy, deleteCartLayout } = this.props;
        cartsLayoutCopy.forEach((oldLayout) => {
            const isLayoutStillExist = cartsLayout.find(item => item.id === oldLayout.id);
            if (!isLayoutStillExist) {
                deleteCartLayout(cartId, oldLayout.id, false);
            }
        });
    }
    changeName(e) {
        this.setState({ name: e.target.value });
    }
    addBoxes(number, isHorizontalLine) {
        const { saveCartLayoutAction, cartsLayout } = this.props;
        const columnsArray = generateColumns(number);
        if (isHorizontalLine) {
            const horizontalLineObj = {
                component_type: 'horizontalLine',
                item: 'horizontalLine',
                label: 'horizontalLine',
            };
            columnsArray[0].items.push(horizontalLineObj);
        }
        const order = findNextOrder(cartsLayout);
        const layout = {
            order,
            id: order,
            number_of_columns: number,
            columns: columnsArray,
            isNew: true,
            isHorizontalLine,
        };
        saveCartLayoutAction(layout);
    }
    changeOrders(selectedId, dropedId) {
        const { cartsLayout } = this.props;
        const cartsLayoutCopy = [...cartsLayout];
        const selectedObject = Object.assign({}, cartsLayout[selectedId]);
        const dropedObject = Object.assign({}, cartsLayout[dropedId]);
        const selectedOrder = selectedObject.order;
        const dropedOrder = dropedObject.order;
        dropedObject.order = selectedOrder;
        selectedObject.order = dropedOrder;
        cartsLayoutCopy[selectedId] = dropedObject;
        cartsLayoutCopy[dropedId] = selectedObject;
        return cartsLayoutCopy;
    }
    render() {
        const { name } = this.state;
        const {
            cartId,
            cartsLayout,
            changeEditMode,
            isEdit,
            changeCartPosition,
            cartName,
            isSingleEdit,
            changeSingleEditMode,
            updateColumnCartLayout,
            deleteCartLayout,
            deleteCartLayoutAction,
        } = this.props;
        return (
            <ContentWrapper>
                <h3>Cart Builder -- {cartName}</h3>
                {isEdit ?
                    <LayoutNameEdit name={name} changeName={this.changeName} />
                    : null
                }
                <div className="panel-default panel mainBox">
                    <div className="panel-body">
                        {cartsLayout.map((cart, i) => (
                            <LineLayout
                                key={cart.id}
                                changeCartPosition={changeCartPosition}
                                changeOrders={this.changeOrders}
                                id={i}
                                layoutId={cart.id}
                                cartId={cartId}
                                isEdit={isEdit}
                                isSingleEdit={isSingleEdit}
                                onDelete={deleteCartLayoutAction}
                                onDeleteWithoutEdit={deleteCartLayout}
                            >
                                {cart.columns.map(column => (
                                    <BoxLayout
                                        key={column.id}
                                        id={column.id}
                                        layoutId={cart.id}
                                        cartId={cartId}
                                        isEdit={isEdit}
                                        isSingleEdit={isSingleEdit}
                                        column={column}
                                        col={12 / cart.columns.length}
                                        changeSingleEditMode={changeSingleEditMode}
                                        updateColumn={updateColumnCartLayout}
                                    />
                                ))}
                            </LineLayout>
                        ))}
                    </div>
                </div>
                <EditButtonsLayout
                    isEdit={isEdit}
                    isSingleEdit={isSingleEdit}
                    changeEditMode={changeEditMode}
                    onDeleteCart={this.onDeleteCart}
                    onSave={this.onSave}
                    onCancel={this.onCancel}
                    addBoxes={this.addBoxes}
                />
            </ContentWrapper>
        );
    }
}

CartLayout.propTypes = {
    changeEditMode: PropTypes.func.isRequired,
    changeCartPosition: PropTypes.func.isRequired,
    changeCurrentCartName: PropTypes.func.isRequired,
    deleteCartLayoutAction: PropTypes.func.isRequired,
    changeSingleEditMode: PropTypes.func.isRequired,
    cartsLayoutCopy: PropTypes.array.isRequired,
    updateCartLayout: PropTypes.func.isRequired,
    saveCartLayoutAction: PropTypes.func.isRequired,
    saveCartLayout: PropTypes.func.isRequired,
    closeEditModes: PropTypes.func.isRequired,
    deleteCart: PropTypes.func.isRequired,
    updateColumnCartLayout: PropTypes.func.isRequired,
    backToPreviousLayout: PropTypes.func.isRequired,
    updateCart: PropTypes.func.isRequired,
    backToCartPage: PropTypes.func.isRequired,
    deleteCartLayout: PropTypes.func.isRequired,
    isEdit: PropTypes.bool.isRequired,
    isSingleEdit: PropTypes.bool.isRequired,
    cartsLayout: PropTypes.array.isRequired,
    cartName: PropTypes.string.isRequired,
    cartId: PropTypes.number.isRequired,
};

export default compose(
    connect(state => ({
        cartsLayout: state.cart.cartsLayout,
        cartsLayoutCopy: state.cart.cartsLayoutCopy,
        isEdit: state.cart.isEdit,
        isSingleEdit: state.cart.isSingleEdit,
        cartId: state.cart.currentCart.id,
        cartName: state.cart.currentCart.name,
    }), cartAction),
    withProps(apiCart),
)(CartLayout);

