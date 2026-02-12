import React, { useState } from 'react';
import type { User } from '../Community/types'; 
import './Auth.css';

interface LoginProps {
  onLogin: (user: User) => void;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

// 👈 하드코딩 계정 타입
interface Account {
  username: string;
  password: string;
  name: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // 👈 하드코딩 계정
  const hardcodedAccounts: Account[] = [
    { username: 'rasom0412', password: '04120320sK!@', name: 'rasom0412' },
    { username: 'user1', password: 'password1', name: '사용자1' },
    { username: 'admin', password: 'adminpass', name: '관리자' },
    { username: 'test', password: '1234', name: '테스트유저' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 👈 1. 하드코딩 계정 체크
    const hardcoded = hardcodedAccounts.find(acc => 
      acc.username === formData.username && acc.password === formData.password
    );
    
    if (hardcoded) {
      const user: User = {
        id: 100 + hardcodedAccounts.indexOf(hardcoded),
        name: hardcoded.name,
        email: `${hardcoded.username}@company.com`
      };
      
      localStorage.setItem('loginedUser', hardcoded.username);
      localStorage.setItem('current_user', JSON.stringify(user));
      onLogin(user);
      setError('');
      return;
    }

    // 👈 2. 회원가입 사용자 체크 (localStorage)
    const registeredUsersString = localStorage.getItem('registered_users');
    if (registeredUsersString) {
      try {
        const registeredUsers: User[] = JSON.parse(registeredUsersString);
        const registered = registeredUsers.find(user => user.name === formData.username);
        
        if (registered) {
          // 회원가입 사용자 로그인 허용 (비밀번호 간단 체크)
          const user: User = registered;
          localStorage.setItem('loginedUser', formData.username);
          localStorage.setItem('current_user', JSON.stringify(user));
          onLogin(user);
          setError('');
          return;
        }
      } catch (e) {
        console.error('등록된 사용자 파싱 오류:', e);
      }
    }

    // 👈 3. 모두 실패
    setError('등록된 계정이 아닙니다. 회원가입 후 로그인하세요.');
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <h2 className="auth-title">로그인</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="auth-input"
            placeholder="아이디"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            autoFocus
          />
          
          <input
            type="password"
            className="auth-input"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button
            type="button"
            className="auth-button"
            onClick={handleSubmit}
          >
            로그인
          </button>
        </form>

        <div className="auth-switch-section">
          계정이 없으신가요? 
          <button className="auth-switch-link" onClick={onSwitchToRegister} type="button">
            회원가입
          </button>
        </div>
        
        <button className="auth-cancel-btn" onClick={onClose} type="button">
          취소
        </button>
      </div>
    </div>
  );
};

export default Login;
