import { useState } from 'react';

/** Telegram user avatar: photo when available, otherwise initials. */
export default function Avatar({ user, size = 40 }) {
  const [failed, setFailed] = useState(false);
  const initials = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (user?.photo_url && !failed) {
    return (
      <img
        src={user.photo_url}
        alt=""
        style={style}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span style={style} className="grid shrink-0 place-items-center rounded-full bg-fg font-semibold text-inverse">
      {initials || 'S'}
    </span>
  );
}
