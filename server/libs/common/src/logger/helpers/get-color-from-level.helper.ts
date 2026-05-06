export function getColorFromLevel(level: number): string {
  let color;

  switch (level) {
    case 10:
      color = '\x1b[36m'; // green
      break;
    case 20: // debug
      color = '\x1b[92m'; // green
      break;
    case 30: // info
      color = '\x1b[33m'; // yelllow
      break;
    case 40: // warn
      color = '\x1b[35m'; // pink
      break;
    case 50: //error
      color = '\x1b[31m';
      break;
    case 60: //fatal
      color = '\x1b[1m\x1b[31m';
      break;
    default:
      break;
  }

  return color;
}
