/**
 * Logger Module
 * ============
 * 
 * Provides consistent, color-coded logging functionality for the roadmap sync tool.
 * Includes different log levels and specialized formatting for epics, tasks, and subtasks.
 * 
 * @module logger
 */

/**
 * ANSI color codes for terminal output styling.
 * 
 * @type {Object}
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

/**
 * Logging utility with colored output for different message types.
 * Provides consistent formatting for different log levels and message categories.
 * 
 * @type {Object}
 */
export const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bright}${colors.white}${msg}${colors.reset}`),
  subheader: (msg) => console.log(`${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  epic: (msg) => console.log(`\n${colors.bgBlue}${colors.white} ${msg} ${colors.reset}`),
  task: (msg) => console.log(`  ${colors.bright}${colors.blue}${msg}${colors.reset}`),
  subtask: (msg) => console.log(`    ${colors.blue}${msg}${colors.reset}`),
  detail: (msg) => console.log(`      ${colors.dim}${msg}${colors.reset}`),
};
