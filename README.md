# Daylist

A small mobile TODO app built with Expo SDK 57, React Native, and TypeScript for a school assignment. The interface is in English, with a custom cream and sage green design.

## Features

- Add a task using the + button or the keyboard's Done key.
- Reject empty and whitespace-only input with a visible error.
- View tasks in a scrollable list.
- Tap a circle to mark a task complete; tap it again to undo.
- Delete an individual task using its × button.
- See completed and remaining task counts and a progress bar.
- Support iPhone safe areas, keyboard avoidance, and accessibility labels.

Tasks are kept in memory. Closing or fully reloading the app clears the list. No account or backend is needed. Task names are limited to 160 characters.

## Run on an iPhone with Expo Go

1. Install Node.js LTS (22.13 or newer) on your Mac and the latest Expo Go on your iPhone.
2. Open a terminal in the project directory.
3. Install dependencies and start the app:

   ```sh
   npm install
   npm start
   ```

   The repository includes a pnpm lockfile. If you use pnpm, run `pnpm install` and `pnpm start` instead.

4. Connect your Mac and iPhone to the same Wi-Fi network.
5. Scan the terminal's QR code with the iPhone Camera and open it in Expo Go. Allow local network access if iOS asks.
6. If Expo Go requests an Expo account, sign in to the same account in Expo Go and the CLI (`npx expo login`).

Use `npm start` for a physical iPhone. `npm run ios` is for an iOS Simulator. If LAN access is blocked, try `npx expo start --tunnel` (Expo may prompt to install its tunnel helper).

Official guides: [Expo Go setup](https://docs.expo.dev/get-started/set-up-your-environment/?device=physical&mode=expo-go&platform=ios) and [starting development](https://docs.expo.dev/get-started/start-developing/).

## Manual checks on the phone

Perform these one by one. The physical-device checks must be performed by the student; a successful build does not prove they passed.

1. **Add/list:** Enter `Buy milk`, tap +, and confirm that it appears and the input clears. Add another task with the keyboard's Done key.
2. **Validation:** Tap + with an empty input, then with only spaces. Confirm that an error appears and no task is added.
3. **Complete/undo:** Tap the circle next to one task. Confirm that its title is crossed out, the circle has a check mark, and the progress updates. Tap again to reopen it.
4. **Delete:** Tap × next to a task. Confirm that only that task disappears and the counts update. Delete all tasks and check the empty state.
5. **Layout:** Add a long title and enough tasks to scroll. Confirm that titles wrap, controls remain tappable, and the input remains accessible above the keyboard.

## Development checks

During implementation, TypeScript checking, ESLint, and an iOS production JavaScript export passed. The web preview was checked at 390 × 844 for adding by button/Enter, rejecting blank and whitespace-only titles, completing/reopening, deleting individual tasks, progress updates, and the empty state. Physical iPhone testing is still required.

```sh
npm run typecheck
npm run lint
npx expo export --platform ios
```

A web preview is available with `npm run web` for additional checks; it does not replace testing in Expo Go.

## Project structure

- `App.tsx`: task state, actions, mobile layout, and styles.
- `index.ts`: registers the app with Expo.
- `app.json`: Expo application configuration.

## Repository

Public repository: https://github.com/Superior-key597/ose-todo_app

The commit history records the Expo setup, adding/listing tasks with validation, completing/deleting tasks, and the custom mobile design with documentation.
