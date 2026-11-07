export function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// Swept vertical landing check prevents the player from tunneling through platforms.
export function landOnPlatforms(player, platforms, previousBottom) {
  if (player.vy < 0) return;
  for (const platform of platforms) {
    const horizontal = player.x + player.w > platform.x &&
                       player.x < platform.x + platform.w;
    const crossedTop = previousBottom <= platform.y + 2 &&
                       player.y + player.h >= platform.y;
    if (horizontal && crossedTop) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }
}
