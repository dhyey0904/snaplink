"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    allow_registrations: true,
    max_upload_size_mb: 10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch('http://127.0.0.1:8000/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://127.0.0.1:8000/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('System Configuration updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 font-mono text-sm animate-pulse">Initializing System Controls...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
              Core Configuration
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage global platform behaviors and restrictions.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Committing...' : 'Apply Configuration'}
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Maintenance Mode */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-gray-900 font-bold text-base">Global Maintenance Mode</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-lg">
                Blocks public access to the dashboard and links. Only the landing page and free tools will remain accessible. Use during major database migrations.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          {/* Registrations */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-gray-900 font-bold text-base">Allow New Registrations</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-lg">
                When disabled, new users cannot create accounts. Existing users can still log in. Use to control invite-only access.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.allow_registrations}
                onChange={(e) => setSettings({...settings, allow_registrations: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Upload Limits */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-900 font-bold text-base">Max Upload Size Limit</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-lg">
                Maximum file size (in Megabytes) allowed for anonymous file storage users to prevent disk exhaustion.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                className="border border-gray-300 rounded-lg px-3 py-2 w-24 text-center font-mono font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                value={settings.max_upload_size_mb}
                onChange={(e) => setSettings({...settings, max_upload_size_mb: parseInt(e.target.value) || 0})}
              />
              <span className="text-gray-500 font-bold">MB</span>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
