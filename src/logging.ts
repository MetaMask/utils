/*
import type { Debugger } from 'debug';
import debug from 'debug';
*/

import loglevel, { getLogger } from 'loglevel';
import type { Logger } from 'loglevel';
import loglevelPrefixPlugin from 'loglevel-plugin-prefix';
// import loglevelDebug from 'loglevel-debug';

/*
const globalLogger = debug('metamask');
*/

/**
 * Creates a logger via the `debug` library whose log messages will be tagged
 * using the name of your project. By default, such messages will be
 * suppressed, but you can reveal them by setting the `DEBUG` environment
 * variable to `metamask:<projectName>`. You can also set this variable to
 * `metamask:*` if you want to see log messages from all MetaMask projects that
 * are also using this function to create their loggers.
 *
 * @param projectName - The name of your project. This should be the name of
 * your NPM package if you're developing one.
 * @returns An instance of `debug`.
 */
/*
export function createProjectLogger(projectName: string): Debugger {
  return globalLogger.extend(projectName);
}
*/

/**
 * Creates a logger via the `debug` library which is derived from the logger for
 * the whole project whose log messages will be tagged using the name of your
 * module. By default, such messages will be suppressed, but you can reveal them
 * by setting the `DEBUG` environment variable to
 * `metamask:<projectName>:<moduleName>`. You can also set this variable to
 * `metamask:<projectName>:*` if you want to see log messages from the project,
 * or `metamask:*` if you want to see log messages from all MetaMask projects.
 *
 * @param projectLogger - The logger created via {@link createProjectLogger}.
 * @param moduleName - The name of your module. You could use the name of the
 * file where you're using this logger or some other name.
 * @returns An instance of `debug`.
 */
/*
export function createModuleLogger(
  projectLogger: Debugger,
  moduleName: string,
): Debugger {
  return projectLogger.extend(moduleName);
}
*/

loglevelPrefixPlugin.reg(loglevel);

/**
 * Constructs a `loglevel` logger which prefixes its messages using the given
 * `format` function.
 *
 * @param name - The name assigned to the logger.
 * @param options - The options.
 * @param options.prefix - The prefix to apply to each log message.
 * @returns The logger.
 */
export function createLogger(
  name: string,
  { prefix = '' }: { prefix?: string } = {},
): Logger {
  const logger = getLogger(name);

  // loglevelDebug(logger);

  loglevelPrefixPlugin.apply(logger, {
    format(level, loggerName, timestamp) {
      return `${timestamp.toISOString()} ${String(
        loggerName,
      )} ${level.toUpperCase()}${prefix}`;
    },
  });

  return logger;
}

/**
 *
 */
function createNullLogger() {
  const logger: Logger = getLogger('null');
  for (const methodName of [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
  ] as const) {
    logger[methodName] = () => {
      // do nothing
    };
  }
  return logger;
}
