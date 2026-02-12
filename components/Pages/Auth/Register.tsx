import React, { useState } from 'react';
import type { User } from '../Community/types';
import './Auth.css';

interface RegisterProps {
  onRegister: (user: User) => void;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '', password: '', confirmPassword: '', email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 회원가입
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 아이디 확인
    if (!formData.username.trim()) {
      setError('아이디를 입력하세요.');
      return;
    }
    
    if (formData.username.length < 6 || formData.username.length > 20) {
      setError('아이디는 6~20자 사이여야 합니다.');
      return;
    }
    
    if (!/^[a-zA-Z0-9가-힣_.-]+$/.test(formData.username)) {
      setError('아이디는 영문, 숫자, 한글, _, ., -만 가능합니다.');
      return;
    }

    // 아이디 중복 검사
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (existingUsers.some((user: User) => user.name === formData.username)) {
      setError('이미 사용 중인 아이디입니다.');
      return;
    }

    // 이메일 유효성 검사
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
     setError('올바른 이메일 주소를 입력하세요 (@와 . 포함)');
     return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 비밀번호 유효성 검사
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
     setError('비밀번호는 영문과 숫자를 1개 이상 포함해야 합니다.');
     return;
    }

    // 모든 검사 체크
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const user: User = {
        id: Date.now(),
        name: formData.username,
        email: formData.email
      };
      
      // 등록된 사용자 목록에 추가
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const newUsers = [...existingUsers, user];
      localStorage.setItem('registered_users', JSON.stringify(newUsers));

      // 로그인 처리
      localStorage.setItem('loginedUser', formData.username);
      localStorage.setItem('current_user', JSON.stringify(user));
      
      onRegister(user);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <h2 className="auth-title">회원가입</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="auth-input"
            placeholder="아이디 (6자 ~ 20자)"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required 
            autoFocus
          />
          
          <input 
            type="email" 
            className="auth-input"
            placeholder="이메일 (example@example.com)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required 
          />
          
          <input 
            type="password" 
            className="auth-input"
            placeholder="비밀번호 (8자 이상, 영문+숫자)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required 
          />
          
          <input 
            type="password" 
            className="auth-input"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required 
          />

          {error && <div className="auth-error">{error}</div>}

          <button 
            type="button"
            className={`auth-button ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-switch-section">
          이미 계정이 있으신가요? 
          <button className="auth-switch-link" onClick={onSwitchToLogin} type="button">
            로그인
          </button>
        </div>

        <button className="auth-cancel-btn" onClick={onClose} type="button">
          취소
        </button>
      </div>
    </div>
  );
};

export default Register;
