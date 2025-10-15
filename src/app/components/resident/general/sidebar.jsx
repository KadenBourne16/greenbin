'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  WalletIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  UserIcon,
  LifebuoyIcon,
  CogIcon,
  
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { get, del } from 'idb-keyval';

export default function Sidebar() {
  const[isOpen, setIsOpen] = useState(false);
  const[modal, setModal] = useState({
    show: false,
    type: '',
    message: '',
  });
  const router = useRouter();
  const [residentData, setResidentData] = useState({});

  useEffect(() => {
    const validateUserToken = async () => {
      const token = localStorage.getItem('greenbin_access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        const resident_data = await get('resident_data');
        setResidentData(resident_data.data);
        if (!data.success) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        router.push('/login');
      }
    };

    validateUserToken();
  }, [router])

  const handleLogoutCancel = () => {
    setModal({
      show: false,
      type: '',
      message: '',
    });
  }

  const handleLogout = () => {
    localStorage.removeItem('greenbin_access_token');
    del('resident_data');
    router.push('/login');
  }

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/resident/dashboard' },
    { name: 'Wallet & Billings', icon: WalletIcon, href: '/resident/wallet' },
    { name: 'Report Issue', icon: ClipboardDocumentListIcon, href: '/resident/report' },
    { name: 'Pickup Schedule', icon: TruckIcon, href: '/resident/pickup-schedule' },
    { name: 'Support', icon: LifebuoyIcon, href: '/resident/support' },
    { name: 'Profile', icon: UserIcon, href: '/resident/profile' },
    { name: 'Settings', icon: CogIcon, href: '/resident/settings' },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar') && !event.target.closest('.hamburger-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    {modal.show && modal.type === 'logout' && <LogoutModal handleLogout={handleLogout} handleLogoutCancel={handleLogoutCancel}/>}
      {/* Hamburger Button - Visible on all screen sizes */}
      <button
        onClick={toggleSidebar}
        className="hamburger-button fixed top-4 left-4 z-50 w-10 h-10 bg-green-700 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar Backdrop/Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className="sidebar flex">
        <div
          className={`fixed z-40 inset-y-0 left-0 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out bg-green-700 text-white w-64`}
        >
          {/* Profile section */}
          <div className="flex items-center space-x-3 px-4 py-4 border-b border-green-600">
            <div>
              <p className="font-semibold text-white">{residentData?.firstName + ' ' + residentData?.lastName || 'Resident'}</p>
              <p className="text-sm text-green-200">Resident</p>
            </div>
            <img
              src="/user-avatar.png"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex flex-col space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-green-100 hover:bg-green-600 hover:text-white transition"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 w-full border-t border-green-600">
            <button
              onClick={() => {
                setModal({
                  show: true,
                  type: 'logout',
                  message: 'Are you sure you want to logout?',
                });
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-green-100 hover:bg-green-600"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}



const LogoutModal = ({handleLogout, handleLogoutCancel}) => {
  return (
    <>
      <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <p>Are you sure you want to logout?</p>
          <div className='flex justify-end space-x-2'>
            <button className='bg-gray-500 text-white px-4 py-2 rounded-lg' onClick={handleLogoutCancel}>Cancel</button>
            <button className='bg-red-500 text-white px-4 py-2 rounded-lg' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  )
}