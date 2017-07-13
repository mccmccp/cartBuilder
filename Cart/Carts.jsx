import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Grid, Row, Col } from 'react-bootstrap';
import { cartAction } from '../../actions';
import { apiCart } from '../../api';
import ContentWrapper from '../../components/Layout/ContentWrapper';
import LinkBox from '../../components/linkbox/LinkBox';

class Carts extends Component {
    componentWillMount() {
        const { carts, getCarts } = this.props;
        getCarts();
    }
    render() {
        const { carts, setCurrentCart } = this.props;
        return (
            <ContentWrapper>
                <h3>Carts</h3>
                <Grid fluid>
                    <Row>
                        {carts.length > 0 ?
                            carts.map(
                                cart => (
                                    <Col md={2} sm={4} key={cart.id}>
                                        <span role="button" tabIndex={0} onClick={() => setCurrentCart(cart)}>
                                            <LinkBox
                                                onClick={this.onClick}
                                                url={`cart/${cart.id}`}
                                                params={{ name: cart.name }}
                                                title={cart.name}
                                            />
                                        </span>
                                    </Col>
                                ),
                            )
                            : null
                        }
                        <Col md={2} sm={4}>
                            <LinkBox url={'cart/newcart'} title={'New Cart'} />
                        </Col>
                    </Row>
                </Grid>
            </ContentWrapper>
        );
    }
}

Carts.propTypes = {
    getCarts: PropTypes.func.isRequired,
    setCurrentCart: PropTypes.func.isRequired,
    carts: PropTypes.array.isRequired,
};

export default compose(
    connect(state => ({
        carts: state.cart.carts,
    }), cartAction),
    withProps(apiCart),
)(Carts);