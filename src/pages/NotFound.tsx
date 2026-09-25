import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * NotFound — neon 404.
 */
const NotFound: React.FC = () => {
  return (
    <div className="wrap" style={{ paddingTop: 90, textAlign: 'center' }}>
      <div
        className="glitch neon-text"
        data-text="404"
        style={{ fontSize: 'clamp(80px,20vw,180px)', fontWeight: 800, lineHeight: 1 }}
      >
        404
      </div>
      <p className="mono" style={{ color: 'var(--muted)', margin: '20px 0 8px' }}>
        &gt; error: route_not_found
      </p>
      <p className="mono" style={{ color: 'var(--muted)', margin: '0 0 26px' }}>
        the page you're looking for doesn't exist in this system.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> back to home
      </Link>
    </div>
  );
};

export default NotFound;