import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';

function Layout({ children }) {
    return (
        <>
            <Header />
            <div className='container'>{children}</div>
        </>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
