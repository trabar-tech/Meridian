#!/usr/bin/env node
/**
 * Meridian — Personal CLI knowledge & note manager.
 *
 * Usage:
 *   meridian add "Buy groceries"          # add a note
 *   meridian edit 1 "new text"            # edit a note's body
 *   meridian edit 1 -t "tag1,tag2"        # edit a note's tags
 *   meridian list                          # list all notes
 *   meridian read <id>                     # read a note by id
 *   meridian remove <id>                   # remove a note by id
 *   meridian search <query>                # search notes by keyword
 *   meridian --version                     # show version
 *   meridian --help                        # show help
 */

import pkg from '../package.json' with { type: 'json' };
import { addNote } from '../commands/add.js';
import { editNote } from '../commands/edit.js';
import { listNotes } from '../commands/list.js';
import { readNote } from '../commands/read.js';
import { removeNote } from '../commands/remove.js';
import { searchNotes } from '../commands/search.js';

const COMMANDS = {
  add: addNote,
  edit: editNote,
  list: listNotes,
  read: readNote,
  remove: removeNote,
  search: searchNotes,
};

function printHelp() {
  console.log(`Meridian v${pkg.version}
${pkg.description}

Usage:
  meridian add <note>        [-t,--tags <tags>]   Add a new note
  meridian edit <id>         [<note>] [-t,--tags <tags>]  Edit a note's body and/or tags
  meridian list              [-t,--tag <tag>]      List all notes
  meridian read <id>                                   Read a note by its id
  meridian remove <id>                                 Remove a note by its id
  meridian search <query>                              Search notes by keyword

Options:
  --version, -v   Show version number
  --help          Show this help

Examples:
  meridian add "Buy groceries" -t "shopping,home"
  meridian edit 1 "Buy groceries and milk"
  meridian edit 1 -t "shopping,home,urgent"
  meridian list
  meridian read 1
  meridian search groceries`);
}

function parseOption(args, flag, short) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag || args[i] === short) {
      const value = args[i + 1];
      if (value !== undefined && !value.startsWith('-')) {
        args.splice(i, 2);
        return value;
      }
      args.splice(i, 1);
      return true;
    }
  }
  return undefined;
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (argv.includes('--version') || argv.includes('-v')) {
    console.log(pkg.version);
    process.exit(0);
  }

  const [command, ...rest] = argv;

  if (!command || !COMMANDS[command]) {
    printHelp();
    process.exit(command ? 1 : 0);
  }

  const handler = COMMANDS[command];
  try {
    await handler(rest);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
