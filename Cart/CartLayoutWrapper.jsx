import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { cartAction } from '../../actions';
import { apiCart } from '../../api';
import CartLayout from './CartLayout';

class CartLayoutWrapper extends Component {
    constructor(props) {
        super(props);
        this.backToCartPage = this.backToCartPage.bind(this);
    }
    componentWillMount() {
        const { params, getCartLayouts, currentCart, setCurrentCart } = this.props;
        if (currentCart) {
            getCartLayouts(currentCart.id);
        } else {
            const cartFromStorage = JSON.parse(sessionStorage.getItem('currentCart'));
            const idFromParams = +params.id;
            if (cartFromStorage && cartFromStorage.id === idFromParams) {
                setCurrentCart(cartFromStorage);
                getCartLayouts(cartFromStorage.id);
            }
        }
    }
    componentWillReceiveProps() {

    }
    backToCartPage() {
        this.context.router.push('/cart');
    }
    render() {
        return (
            <CartLayout
                backToCartPage={this.backToCartPage}
            />
        );
    }
}

CartLayoutWrapper.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

CartLayoutWrapper.propTypes = {
    getCartLayouts: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    currentCart: PropTypes.object,
    setCurrentCart: PropTypes.func.isRequired,
};

export default compose(
    connect(state => ({
        cartsLayout: state.cart.cartsLayout,
        currentCart: state.cart.currentCart,
    }), cartAction),
    withProps(apiCart),
)(CartLayoutWrapper);
