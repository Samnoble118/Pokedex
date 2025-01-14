import React from 'react';

function ErrorMessage({ error, clearSearch }) {
    return (
        <div className="error-message">
            <p>{error}</p>
            <button onClick={clearSearch}>Clear Search</button>
        </div>
    );
}

export default ErrorMessage;
