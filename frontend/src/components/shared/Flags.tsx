// US Flag SVG Icon
export const USFlag = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px' }}>
    <rect width="32" height="24" fill="#B22234" />
    <path d="M0 2.77h32M0 5.54h32M0 8.31h32M0 11.08h32M0 13.85h32M0 16.62h32M0 19.38h32M0 22.15h32" stroke="#fff" strokeWidth="1.85" />
    <rect width="12.8" height="13.85" fill="#3C3B6E" />
  </svg>
);

// Spain Flag SVG Icon
export const SpainFlag = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px' }}>
    <rect width="32" height="24" fill="#AA151B" />
    <rect y="6" width="32" height="12" fill="#F1BF00" />
  </svg>
);
