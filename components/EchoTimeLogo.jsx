import React from 'react';
import { motion } from 'framer-motion';

const EchoTimeLogo = ({ size = 40 }) => {
  const s = size;
  const center = s / 2;
  const clockRadius = s * 0.32;
  const outerRadius = s * 0.36;

  return (
    <motion.svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ overflow: 'visible' }}
    >
      {/* Outer glow pulse */}
      <motion.circle
        cx={center}
        cy={center}
        r={outerRadius + 2}
        fill="none"
        stroke="rgba(37,99,235,0.15)"
        strokeWidth={1.5}
        animate={{ r: [outerRadius + 2, outerRadius + 5, outerRadius + 2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Clock outer ring */}
      <circle cx={center} cy={center} r={outerRadius} fill="#2563EB" opacity={0.1} />
      <circle cx={center} cy={center} r={clockRadius} fill="white" stroke="#2563EB" strokeWidth={2} />

      {/* Bell left */}
      <motion.ellipse
        cx={center - clockRadius * 0.55}
        cy={center - clockRadius * 0.85}
        rx={clockRadius * 0.22}
        ry={clockRadius * 0.18}
        fill="#2563EB"
        animate={{ rotate: [0, -8, 0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        style={{ transformOrigin: `${center - clockRadius * 0.3}px ${center - clockRadius * 0.6}px` }}
      />
      {/* Bell right */}
      <motion.ellipse
        cx={center + clockRadius * 0.55}
        cy={center - clockRadius * 0.85}
        rx={clockRadius * 0.22}
        ry={clockRadius * 0.18}
        fill="#2563EB"
        animate={{ rotate: [0, 8, 0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        style={{ transformOrigin: `${center + clockRadius * 0.3}px ${center - clockRadius * 0.6}px` }}
      />

      {/* Bell connectors */}
      <line
        x1={center - clockRadius * 0.3} y1={center - clockRadius * 0.75}
        x2={center - clockRadius * 0.55} y2={center - clockRadius * 0.55}
        stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round"
      />
      <line
        x1={center + clockRadius * 0.3} y1={center - clockRadius * 0.75}
        x2={center + clockRadius * 0.55} y2={center - clockRadius * 0.55}
        stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round"
      />

      {/* Hour marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg - 90) * (Math.PI / 180);
        const inner = clockRadius * 0.78;
        const outer = clockRadius * 0.9;
        return (
          <line
            key={deg}
            x1={center + Math.cos(rad) * inner}
            y1={center + Math.sin(rad) * inner}
            x2={center + Math.cos(rad) * outer}
            y2={center + Math.sin(rad) * outer}
            stroke="#2563EB"
            strokeWidth={deg % 90 === 0 ? 1.8 : 0.8}
            strokeLinecap="round"
            opacity={deg % 90 === 0 ? 1 : 0.4}
          />
        );
      })}

      {/* Center dot */}
      <circle cx={center} cy={center} r={1.5} fill="#2563EB" />

      {/* Hour hand */}
      <motion.line
        x1={center} y1={center}
        x2={center + clockRadius * 0.35} y2={center - clockRadius * 0.35}
        stroke="#2563EB" strokeWidth={2} strokeLinecap="round"
      />

      {/* Minute hand */}
      <motion.line
        x1={center} y1={center}
        x2={center + clockRadius * 0.15} y2={center - clockRadius * 0.55}
        stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round"
      />

      {/* Second hand - animated rotation */}
      <motion.line
        x1={center} y1={center}
        x2={center} y2={center - clockRadius * 0.6}
        stroke="#3B82F6" strokeWidth={0.8} strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Circuit traces - left side */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Main trace line */}
        <line
          x1={center - clockRadius} y1={center}
          x2={center - clockRadius - s * 0.12} y2={center}
          stroke="#2563EB" strokeWidth={1.2} strokeLinecap="round"
        />
        {/* Branch up */}
        <line
          x1={center - clockRadius - s * 0.06} y1={center}
          x2={center - clockRadius - s * 0.12} y2={center - s * 0.08}
          stroke="#2563EB" strokeWidth={1.2} strokeLinecap="round"
        />
        {/* Branch down */}
        <line
          x1={center - clockRadius - s * 0.06} y1={center}
          x2={center - clockRadius - s * 0.12} y2={center + s * 0.08}
          stroke="#2563EB" strokeWidth={1.2} strokeLinecap="round"
        />

        {/* Circuit nodes - animated pulse */}
        {[
          { x: center - clockRadius - s * 0.12, y: center },
          { x: center - clockRadius - s * 0.12, y: center - s * 0.08 },
          { x: center - clockRadius - s * 0.12, y: center + s * 0.08 }
        ].map((pos, i) => (
          <motion.circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={1.8}
            fill="#2563EB"
            animate={{ r: [1.8, 2.5, 1.8], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </motion.g>

      {/* Echo wave arcs - right side */}
      {[0.06, 0.1, 0.14].map((offset, i) => (
        <motion.path
          key={i}
          d={`M ${center + clockRadius + s * offset} ${center - s * 0.08} Q ${center + clockRadius + s * (offset + 0.03)} ${center} ${center + clockRadius + s * offset} ${center + s * 0.08}`}
          fill="none"
          stroke="#2563EB"
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Feet */}
      <line
        x1={center - clockRadius * 0.4} y1={center + clockRadius + 1}
        x2={center - clockRadius * 0.55} y2={center + clockRadius + s * 0.06}
        stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round"
      />
      <line
        x1={center + clockRadius * 0.4} y1={center + clockRadius + 1}
        x2={center + clockRadius * 0.55} y2={center + clockRadius + s * 0.06}
        stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round"
      />
    </motion.svg>
  );
};

export default EchoTimeLogo;
