import React, { useState } from 'react';
import { User, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { getLocalProfile, saveLocalProfile } from '../utils/profileStorage';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
];

const ProfilePage = () => {
  const [profile, setProfile] = useState(() => getLocalProfile());
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      const updated = saveLocalProfile({ name: name.trim() || 'Explorer', bio, avatar });
      setProfile(updated);
      setProfileMsg({ type: 'success', text: 'Profile preferences saved!' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to save profile preferences.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6 text-sky-500" />
          Traveler Profile Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize your traveler display name, bio, and avatar stored locally in your browser
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full rounded-full object-cover ring-4 ring-sky-500/40 shadow-lg"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{profile.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{profile.bio}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center justify-center gap-2">
              {AVATAR_OPTIONS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(imgUrl)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                    avatar === imgUrl ? 'border-sky-500 scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUpdateProfile} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-500" /> General Info
            </h3>

            {profileMsg.text && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Bio / Traveler Quote
              </label>
              <textarea
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a brief bio or traveler quote..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
