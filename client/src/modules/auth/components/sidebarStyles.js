export const SIDEBAR_WIDTH = 240;

export const sidebarContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 16px',
};

export const sidebarMobileStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: SIDEBAR_WIDTH,
  height: '100vh',
  background: '#FFFFFF',
  borderRight: '1px solid #E8EAED',
  zIndex: 1000,
  transform: 'translateX(-100%)',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
};

export const sidebarDesktopStyles = {
  width: SIDEBAR_WIDTH,
  minHeight: '100vh',
  background: '#FFFFFF',
  borderRight: '1px solid #E8EAED',
  flexShrink: 0,
};

export const brandStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 36,
  padding: '0 8px',
};

export const brandLogoStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

export const brandIconStyles = {
  width: 34,
  height: 34,
  background: '#1A73E8',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(26, 115, 232, 0.2)',
  flexShrink: 0,
  color: '#FFFFFF',
};

export const brandTextStyles = {
  fontFamily: 'Sora, sans-serif',
  fontWeight: 700,
  fontSize: 16,
  color: '#202124',
  letterSpacing: '-0.01em',
};

export const closeButtonStyles = {
  background: 'transparent',
  border: 'none',
  color: '#5F6368',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  transition: 'all 0.2s',
  outline: 'none',
};

export const sectionLabelStyles = {
  color: '#5F6368',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '0 12px',
  marginBottom: 8,
};

export const navStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
};

export const userSectionStyles = {
  borderTop: '1px solid #E8EAED',
  paddingTop: 16,
  marginTop: 16,
};

export const userCardStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 12px',
  background: '#F8F9FA',
  
  position: 'relative',
};

export const avatarStyles = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: '#E8F0FE',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1A73E8',
  fontSize: 13,
  fontWeight: 700,
  flexShrink: 0,
};

export const userInfoStyles = {
  flex: 1,
  minWidth: 0,
};

export const userEmailStyles = {
  color: '#202124',
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: 0,
};

export const userRoleBadgeStyles = {
  display: 'inline-block',
  background: '#E8F0FE',
  color: '#1A73E8',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.02em',
  padding: '1px 8px',
  borderRadius: 100,
  textTransform: 'capitalize',
  marginTop: 2,
};

export const menuTriggerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#5F6368',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '50%',
  transition: 'all 0.2s',
  flexShrink: 0,
};

export const dropdownStyles = {
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  right: 0,
  width: '100%',
  background: '#FFFFFF',
  border: '1px solid #DADCE0',
  borderRadius: 12,
  padding: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideUp 0.15s ease-out',
};

export const logoutButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  background: 'transparent',
  border: 'none',
  color: '#D93025',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s',
};

export const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(255, 255, 255, 0.84)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99999,
  animation: 'fadeIn 0.2s ease-out',
};

export const modalStyles = {
  background: '#FFFFFF',
  border: '1px solid #DADCE0',
  borderRadius: 20,
  padding: '40px 48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  width: '90%',
  maxWidth: '360px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
  textAlign: 'center',
  animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const spinnerStyles = {
  width: 52,
  height: 52,
  borderRadius: '50%',
  background: '#E8F0FE',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1A73E8',
};

export const modalTitleStyles = {
  fontFamily: 'Sora, sans-serif',
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#202124',
  margin: 0,
  letterSpacing: '-0.01em',
};

export const modalMessageStyles = {
  color: '#5F6368',
  fontSize: '0.875rem',
  marginTop: 6,
  marginBottom: 0,
};

export const animations = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;