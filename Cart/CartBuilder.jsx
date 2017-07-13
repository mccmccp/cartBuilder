import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import ContentWrapper from '../../components/Layout/ContentWrapper';
import { cartAction } from '../../actions';
import { apiCart } from '../../api';
import Loader from '../../components/loader/Loader';
import LineLayout from './LineLayout';
import BoxLayout from './BoxLayout';
import LayoutNameEdit from './LayoutNameEdit';
import EditButtonsLayout from './EditButtonsLayout';
import { generateColumns, findNextOrder } from './helpers';

class CartBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
        this.changeName = this.changeName.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.changeOrders = this.changeOrders.bind(this);
        this.addBoxes = this.addBoxes.bind(this);
        this.saveLayouts = this.saveLayouts.bind(this);
        this.backToCartsPage = this.backToCartsPage.bind(this);
    }
    componentWillMount() {
        const { clearLayout } = this.props;
        clearLayout();
    }
    onSave() {
        const { saveCart, finishSaving } = this.props;
        if (!this.state.name) {
            swal({
                title: 'Name field is required!',
                text: 'Please, fill the name field!',
                type: 'warning',
            });
        } else {
            saveCart({ name: this.state.name })
                .then(
                    (data) => {
                        const saveLayoutRequest = this.saveLayouts(data.id);
                        saveLayoutRequest
                            .then(
                                () => {
                                    this.backToCartsPage();
                                    finishSaving();
                                },
                            );
                    });
        }
    }
    onCancel() {
        this.backToCartsPage();
    }
    backToCartsPage() {
        this.context.router.push('/cart');
    }
    saveLayouts(cartId) {
        const { saveCartLayout, cartsLayout } = this.props;
        const requests = cartsLayout.map((newLayout) => (
            saveCartLayout(
                cartId,
                newLayout,
                { order: newLayout.order },
                newLayout.isHorizontalLine,
            )
        ));
        return Promise.all(requests);
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
            cartsLayout,
            changeEditMode,
            changeCartPosition,
            changeSingleEditMode,
            updateColumnCartLayout,
            deleteCartLayout,
            deleteCartLayoutAction,
            isSaving,
        } = this.props;
        return (
            <ContentWrapper>
                <h3>Cart Builder</h3>
                {!isSaving ?
                    <div>
                        <LayoutNameEdit name={name} changeName={this.changeName} />
                        <div className="panel-default panel mainBox">
                            <div className="panel-body">
                                {cartsLayout.map((cart, i) => (
                                    <LineLayout
                                        key={cart.id}
                                        changeCartPosition={changeCartPosition}
                                        changeOrders={this.changeOrders}
                                        id={i}
                                        layoutId={cart.id}
                                        cartId={0}
                                        isEdit
                                        isSingleEdit={false}
                                        onDelete={deleteCartLayoutAction}
                                        onDeleteWithoutEdit={deleteCartLayout}
                                    >
                                        {cart.columns.map(column => (
                                            <BoxLayout
                                                key={column.id}
                                                id={column.id}
                                                layoutId={cart.id}
                                                cartId={0}
                                                isEdit
                                                isSingleEdit={false}
                                                column={column}
                                                col={12 / cart.columns.length}
                                                changeSingleEditMode={changeSingleEditMode}
                                                updateColumn={updateColumnCartLayout}
                                            />
                                        ))}
                                    </LineLayout>
                                ))
                                }
                            </div>
                        </div>
                        <EditButtonsLayout
                            isEdit
                            isSingleEdit={false}
                            changeEditMode={changeEditMode}
                            onDeleteCart={() => {}}
                            onSave={this.onSave}
                            onCancel={this.onCancel}
                            addBoxes={this.addBoxes}
                        />
                    </div>
                    : <Loader />
                }
            </ContentWrapper>
        );
    }
}

CartBuilder.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

CartBuilder.propTypes = {
    saveCart: PropTypes.func.isRequired,
    changeCartPosition: PropTypes.func.isRequired,
    changeEditMode: PropTypes.func.isRequired,
    changeCurrentCartName: PropTypes.func.isRequired,
    deleteCartLayoutAction: PropTypes.func.isRequired,
    changeSingleEditMode: PropTypes.func.isRequired,
    updateCartLayout: PropTypes.func.isRequired,
    saveCartLayoutAction: PropTypes.func.isRequired,
    saveCartLayout: PropTypes.func.isRequired,
    closeEditModes: PropTypes.func.isRequired,
    deleteCart: PropTypes.func.isRequired,
    updateColumnCartLayout: PropTypes.func.isRequired,
    backToPreviousLayout: PropTypes.func.isRequired,
    updateCart: PropTypes.func.isRequired,
    deleteCartLayout: PropTypes.func.isRequired,
    cartsLayout: PropTypes.array.isRequired,
    isSaving: PropTypes.bool.isRequired,
};

export default compose(
    connect(state => ({
        cartsLayout: state.cart.cartsLayout,
        isSingleEdit: state.cart.isSingleEdit,
        isSaving: state.cart.isSaving,
    }), cartAction),
    withProps(apiCart),
)(CartBuilder);

