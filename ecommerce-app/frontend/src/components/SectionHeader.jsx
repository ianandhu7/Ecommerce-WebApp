import React from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, linkText = "See more", linkTo = "/products" }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            paddingBottom: '1rem'
        }}>
            <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '300',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#000',
                margin: 0
            }}>
                {title}
            </h2>

            <Link
                to={linkTo}
                style={{
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#000',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
                {linkText}
                <span style={{ fontSize: '1.25rem' }}>→</span>
            </Link>
        </div>
    );
};

export default SectionHeader;
