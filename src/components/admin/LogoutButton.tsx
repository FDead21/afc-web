// src/app/admin/(protected)/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
    >
      Logout
    </button>
  );
}