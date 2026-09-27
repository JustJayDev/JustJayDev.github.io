import React from 'react';
import { PROJECTS, type ProjectId } from '@/data/devlog';

/**
 * ProjectLogo — consistent per-project branding mark.
 *
 * Renders the project's inline SVG glyph inside a rounded tile with the
 * project's accent colour. Works at any size, on light or dark backgrounds
 * (the glyph is currentColor on a translucent panel), and inside cards or
 * nav rows. Used by Projects, Devlog and the home project section.
 */
const ProjectLogo: React.FC<{
  projectId: ProjectId;
  size?: number;
  className?: string;
  withGlow?: boolean;
}> = ({ projectId, size = 40, className, withGlow = true }) => {
  const p = PROJECTS.find((x) => x.id === projectId) || PROJECTS[0];
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: Math.max(8, size * 0.28),
        color: p.accent,
        background: `${p.accent}14`,
        border: `1px solid ${p.accent}40`,
        boxShadow: withGlow ? `0 0 18px ${p.accent}22` : 'none',
        flex: 'none',
        transition: 'transform 0.25s cubic-bezier(0.2,0.7,0.2,1), box-shadow 0.25s ease',
      }}
    >
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ display: 'block' }}
        dangerouslySetInnerHTML={{ __html: p.logo }}
      />
    </span>
  );
};

export default ProjectLogo;