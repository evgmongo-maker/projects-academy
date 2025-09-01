import React from 'react';

interface SidebarProps {
  wiggleBtn: string | null;
  setWiggleBtn: (btn: string | null) => void;
  handleUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadPopup: boolean;
  uploadedFile: File | null;
  uploadPopupVisible: boolean;
  setChatOpen: (open: boolean) => void;
  setDropdownOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  wiggleBtn,
  setWiggleBtn,
  handleUploadClick,
  fileInputRef,
  handleFileChange,
  uploadPopup,
  uploadedFile,
  uploadPopupVisible,
  setChatOpen,
  setDropdownOpen,
}) => (
  <aside style={{
    width: 70,
    background: 'rgba(34,34,34,0.95)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
    gap: '1.5rem',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
    borderTopRightRadius: 24,
    transition: 'border-radius 0.3s',
  }}>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        title="Upload"
        style={{
          background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(102,166,255,0.15)',
          transition: 'transform 0.25s cubic-bezier(.36,.07,.19,.97)',
          transform: wiggleBtn === 'upload' ? 'rotate(-10deg) scale(1.08)' : 'none',
        }}
        onClick={handleUploadClick}
        onMouseEnter={() => setWiggleBtn('upload')}
        onMouseLeave={() => setWiggleBtn(null)}
      >
        <span role="img" aria-label="upload">⬆️</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {uploadPopup && uploadedFile && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            color: '#222',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(102,166,255,0.18)',
            padding: '0.85rem 1.3rem',
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            zIndex: 20,
            minWidth: 220,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: uploadPopupVisible ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        >
          <span style={{ fontSize: 22, color: '#43e97b' }}>✔️</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 600, color: '#213547', marginBottom: 2 }}>Upload successful!</span>
            <span style={{ fontSize: '0.97rem', color: '#444' }}>{uploadedFile.name}</span>
          </div>
        </div>
      )}
    </div>
    <button
      title="Chat"
      style={{
        background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        border: 'none',
        borderRadius: '50%',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(255,210,0,0.10)',
        transition: 'transform 0.25s cubic-bezier(.36,.07,.19,.97)',
        position: 'relative',
        transform: wiggleBtn === 'chat' ? 'rotate(10deg) scale(1.08)' : 'none',
      }}
      onClick={() => {
        setChatOpen(true);
        setDropdownOpen(false);
      }}
      onMouseEnter={() => setWiggleBtn('chat')}
      onMouseLeave={() => setWiggleBtn(null)}
    >
      <span role="img" aria-label="chat">💬</span>
    </button>
  </aside>
);

export default Sidebar;
