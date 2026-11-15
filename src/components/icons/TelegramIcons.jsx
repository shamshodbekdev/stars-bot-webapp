/**
 * Original Telegram artwork for Premium, Stars and Gifts, as PNG files in
 * public/icons/ (served at /icons/*.png).
 *
 * Sources — Telegram's own open-source clients:
 *  - premium.png — Telegram Web K (morethanwords/tweb)
 *                  public/assets/img/premium-star@2x.png
 *  - stars.png   — Telegram Android (DrKLO/Telegram)
 *                  TMessagesProj/src/main/res/raw/star_reaction.json, the
 *                  paid-Stars reaction animation, final frame rendered at 512px
 *  - gift.png    — Telegram Android, res/raw/premium_gift.json (gift box),
 *                  first frame rendered at 512px
 * Each file is trimmed to its artwork and padded square (transparent), so the
 * three icons fill their tiles evenly. The colours are the originals, so they
 * look the same in light and dark mode.
 *
 * API is unchanged from the old SVG version: `size` (px) plus any <img> props.
 */
const ICON_BASE = `${import.meta.env.BASE_URL}icons/`;

function TelegramIcon({ file, size = 24, className = '', style, ...props }) {
  return (
    <img
      src={`${ICON_BASE}${file}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      className={`inline-block shrink-0 select-none object-contain ${className}`}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}

export const PremiumIcon = (props) => <TelegramIcon file="premium.png" {...props} />;
export const StarsIcon = (props) => <TelegramIcon file="stars.png" {...props} />;
export const GiftIcon = (props) => <TelegramIcon file="gift.png" {...props} />;
